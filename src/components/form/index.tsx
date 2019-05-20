import { FormControl, FormHelperText, FormLabel, Radio, RadioGroup } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import MuiCheckbox from '@material-ui/core/Checkbox';
import { brown, deepPurple } from '@material-ui/core/colors';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import { createMuiTheme, MuiThemeProvider, Theme, withStyles } from '@material-ui/core/styles';

import 'cropperjs/dist/cropper.min.css';
import './index.scss';

import { Field, Formik, FormikProps, FieldProps } from 'formik';
import { fieldToCheckbox, TextField } from 'formik-material-ui';
import React, { useEffect, ChangeEvent } from 'react';
import ReactCropper, { default as Cropper } from 'react-cropper';
import * as Yup from 'yup';

import { Article } from '../../service/model/model';
import Editor from '../editor';
import { omit } from '../../utils';
import {
    selectEditingArticle,
    EditingArticle,
    updateArticle,
    CreateArticlePayload,
    UpdateArticlePayload,
    createArticle
} from '../../store/slices/article.slice';
import { connect } from 'react-redux';
import { StoreState } from '../../store/model/model';

type CropperFn = () => string;

interface ArticleFormProps extends EditingArticle {
    classes: { [key: string]: any };
}

export interface ArticleCreation {
    author: string;
    title: string;
    subtitle: string;
    category: string[];
    isOriginal: boolean;
    isCustomThumbnail: boolean;
    thumbnail: string;
    content: string;
    isPublished: boolean;
    cropper?: CropperFn;
}

interface CreationFieldProps extends FieldProps<ArticleCreation> {
    classes: { [key: string]: any };
    disabled: boolean;
}

interface SubmitProps extends EditingArticle {
    isUpdate: boolean;
    isPublished: boolean;
    submit: () => ArticleCreation;
    createArticle: (payload: CreateArticlePayload) => void;
    updateArticle: (payload: UpdateArticlePayload) => void;
}

const style = (theme: Theme) => {
    return {
        'ratel-form-field': {
            display: 'flex',
            'flex-direction': 'column'
        },
        control: {
            'flex-direction': 'row',
            alignItems: 'center'
        },
        row: {
            alignItems: 'center'
        },
        label: {
            marginRight: '2em;'
        }
    };
};

const theme: Theme = createMuiTheme({
    palette: {
        primary: {
            main: '#000'
        },
        secondary: {
            light: deepPurple['A100'],
            main: deepPurple['A200'],
            dark: deepPurple['A400']
        },
        error: brown
    },
    typography: {
        useNextVariants: true,
        fontSize: 16
    }
});

/**
 * * 初始化表单值，提供给formik组件使用
 */
const initForm = (article?: Article | ArticleCreation): ArticleCreation => {
    const defaultValue: ArticleCreation = {
        author: '',
        title: '',
        subtitle: '',
        category: [],
        isOriginal: true,
        isCustomThumbnail: false,
        thumbnail: '',
        content: '',
        isPublished: true
    };

    return article ? (article as ArticleCreation) : defaultValue;
};

/**
 * * 表单字段的验证器，所有的错误信息在此配置
 */
const ArticleFormSchema = Yup.object().shape({
    title: Yup.string()
        .max(100, '标题太长了')
        .required('请输入一个标题'),
    author: Yup.string()
        .max(10, '最大长度10')
        .min(3, '名称长度最少要求3个字符')
        .required('请输入作者名称'),
    category: Yup.array().min(1, '请至少选择一个和此文章相关的系列'),
    thumbnail: Yup.string().when('isCustomThumbnail', {
        is: true,
        then: (fieldSchema: any) => fieldSchema.required('请上传封面图片')
    }),
    content: Yup.string()
        .min(300, '文章长度最少300字符')
        .required('文章长度最少300字符')
});

const CATEGORIES: string[] = ['angular', 'rxjs', 'typescript', 'javascript', 'other'];

/**
 * * 表单控件：文章类型，checkbox的值发生改变后直接修改表单字段的 category 字段
 */
const CategoryField = ({ classes, disabled, ...props }: CreationFieldProps) => {
    const category: string[] = props.field.value;
    const { category: isCategoryTouched } = props.form.touched;
    const { category: errorMessage } = props.form.errors;
    const error = isCategoryTouched && !!errorMessage;
    const { name } = props.field;

    return (
        <FormControl error={error}>
            <FormGroup row className={classes.row}>
                <FormLabel className={classes.label}>文章类型</FormLabel>
                {CATEGORIES.map(cat => (
                    <FormControlLabel
                        label={cat}
                        key={cat}
                        control={
                            <MuiCheckbox
                                value={cat}
                                checked={category.includes(cat)}
                                disabled={disabled}
                                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                                    const { value } = event.target;
                                    let result = [];
                                    if (category.includes(value)) {
                                        result = category.filter(item => item !== value);
                                    } else {
                                        result = [...category, value];
                                    }
                                    props.form.setFieldValue(name, result);
                                    props.form.setTouched({ ...props.form.touched, [name]: true });
                                }}
                            />
                        }
                    />
                ))}
            </FormGroup>
            {error && <FormHelperText error>{errorMessage}</FormHelperText>}
        </FormControl>
    );
};

/**
 * * 表单控件：是否原创
 */
const IsOriginalField = ({ classes, ...props }: CreationFieldProps) => {
    const name = props.field.name;

    return (
        <FormControl>
            <FormGroup row className={classes.row}>
                <FormLabel className={classes.label}>原创文章</FormLabel>
                <FormControlLabel
                    label="声明原创"
                    control={<MuiCheckbox {...fieldToCheckbox(props)} value={name} checked={props.field.value} />}
                />
            </FormGroup>
        </FormControl>
    );
};

/**
 * * 表单控件：是否使用使用自定义封面图片 radio的值发生变化后修改表单的 IsCustomThumbnailField 字段
 */
const IsCustomThumbnailField = ({ classes, disabled, ...props }: CreationFieldProps) => {
    const thumbnailType = props.field.value ? 'custom' : 'default';
    const { name } = props.field;

    return (
        <FormControl className={classes.control}>
            <FormLabel className={classes.label}>封面图片</FormLabel>
            <RadioGroup
                row
                className={classes.row}
                defaultValue={thumbnailType}
                onChange={(_, value) => {
                    const isCustom = value === 'custom';

                    props.form.setFieldValue(name, isCustom);
                    props.form.setTouched({ ...props.form.touched, [name]: true });
                }}
            >
                <FormControlLabel control={<Radio />} disabled={disabled} value="default" label="使用默认图片" />
                <FormControlLabel control={<Radio />} disabled={disabled} value="custom" label="自定义图片" />
            </RadioGroup>
        </FormControl>
    );
};

/**
 * * 上传封面图片按钮，选择图片之后将会给表单字段 thumbnail 设置初始值
 */
const ThumbnailSelectButton = (props: FormikProps<ArticleCreation>) => (
    <Button variant="contained" color="secondary" style={{ backgroundColor: '#ff5252' }} className="file-select-btn">
        选择图片
        <input
            type="file"
            onChange={(event: any) => {
                let files;

                if (event.dataTransfer) {
                    files = event.dataTransfer.files;
                } else if (event.target) {
                    files = event.target.files;
                }

                const reader = new FileReader();

                reader.onload = () => props.setFieldValue('thumbnail', reader.result);
                reader.readAsDataURL(files[0]);
            }}
        />
    </Button>
);

/**
 * * 表单控件：thumbnail 用户选择自定义图片后，使用此控件对图片进行修改，但是修改操作不会立即发生。此控件通过设置表单的 copper 字段
 * * 将剪切方法暴露给父组件 - form 组件，在表单的提交操作发生时对自定义的图片进行剪切。
 */
const ThumbnailField = ({ classes, ...props }: CreationFieldProps) => {
    const { value } = props.field;
    const { isCustomThumbnail } = props.form.values;
    const { thumbnail: errorMessage } = props.form.errors;
    let cropperRef: ReactCropper;

    const cropperImage = (cropperRef: ReactCropper): CropperFn => () => {
        if (typeof cropperRef.getCroppedCanvas() === 'undefined') {
            console.warn('None image found!');
            return null;
        }

        return cropperRef.getCroppedCanvas().toDataURL();
    };

    useEffect(() => {
        !!cropperRef && props.form.setFieldValue('cropper', cropperImage(cropperRef));
    }, [value]);

    return (
        isCustomThumbnail && (
            <>
                <div className="thumbnail">
                    <Cropper
                        ref={cropper => {
                            cropperRef = cropper;
                        }}
                        guides={false}
                        aspectRatio={16 / 9}
                        src={value}
                        preview=".image-preview"
                        className="cropper"
                    />
                    <div className="image-preview" />
                </div>
                {errorMessage && <FormHelperText error>{errorMessage}</FormHelperText>}
            </>
        )
    );
};

/**
 * * 表单控件 文章内容 组件传递修改方法给编辑器以使编辑器可以修改 content 字段的内容
 */
const ContentField = ({ field, form }:  FieldProps<ArticleCreation>) => {
    const name = field.name;
    const { content: tip } = form.errors;
    const onContentChange = (name: string) => (content: string) => {
        form.setFieldValue(name, content);
    };

    // ! BUG 没有下面Effect的时候，content 不做任何修改时表单可以通过验证
    useEffect(() => {
        form.setTouched({ ...form.touched, content: true });
    }, []);

    return <Editor onContentChange={onContentChange(name)} value={field.value} tip={tip} />;
};

/**
 * * 生成请求参数，自定义封面图片的剪切操作在此阶段进行。
 */
const generateRequestParams = (params: ArticleCreation, isUpdating: boolean): ArticleCreation => {
    const { cropper, isCustomThumbnail } = params;
    const request = omit(params, 'cropper');

    request.thumbnail = isCustomThumbnail && !isUpdating ? cropper() : '';
    return request as ArticleCreation;
};

/**
 * * 提交操作，决定表单的内容调用哪个接口给后台传递数据
 */
const Submit = ({ isUpdate, isPublished, submit, createArticle, updateArticle, id }: SubmitProps) => {
    const publishFactory = (immediatePublish: boolean) => () => {
        const request = { ...submit(), isPublished: immediatePublish };

        createArticle(request);
    };

    const updateFactory = (isPublish?: boolean) => () => {
        const { content } = submit();
        const params = { id, content };
        const request = isPublish ? { ...params, isPublish } : params;

        updateArticle(request);
    };

    return (
        <div className="submit">
            {!isUpdate ? (
                <>
                    <Button variant="contained" color="primary" onClick={publishFactory(true)}>
                        创建并发表
                    </Button>
                    <Button variant="contained" color="secondary" onClick={publishFactory(false)}>
                        暂存
                    </Button>
                </>
            ) : (
                <>
                    {!isPublished && (
                        <Button variant="contained" color="primary" onClick={updateFactory(true)}>
                            更新并发表
                        </Button>
                    )}
                    <Button variant="contained" color="secondary" onClick={updateFactory()}>
                        仅更新
                    </Button>
                </>
            )}
        </div>
    );
};

const SubmitButtons = connect(
    (state: StoreState) => selectEditingArticle(state),
    { createArticle, updateArticle }
)(Submit);

/**
 * * 创建文章的表单组件
 */
function ArticleForm({ id, article, classes }: ArticleFormProps) {
    const isUpdating = !!id; // id存在则此文章已创建
    const isPublished = !!article && article.isPublished;

    return (
        <Formik
            initialValues={initForm(article)}
            validationSchema={ArticleFormSchema}
            onSubmit={() => {}}
            render={(props: FormikProps<ArticleCreation>) => (
                <form className={classes['ratel-form-field'] + ' ratel-form-field'}>
                    <MuiThemeProvider theme={theme}>
                        <Field
                            name="title"
                            label="标题"
                            component={TextField}
                            id="outlined-title"
                            margin="normal"
                            variant="outlined"
                            placeholder="请输入标题"
                            disabled={isUpdating}
                        />

                        <Field
                            name="subtitle"
                            component={TextField}
                            id="outlined-subtitle"
                            label="副标题"
                            margin="normal"
                            variant="outlined"
                            placeholder="副标题"
                            disabled={isUpdating}
                        />

                        <Field
                            id="outlined-author"
                            name="author"
                            component={TextField}
                            label="作者"
                            margin="normal"
                            variant="outlined"
                            disabled={isUpdating}
                        />

                        <Field name="category" disabled={isUpdating} component={CategoryField} classes={classes} />

                        <Field name="isOriginal" disabled={isUpdating} component={IsOriginalField} classes={classes} />

                        <div>
                            <Field
                                name="isCustomThumbnail"
                                disabled={isUpdating}
                                component={IsCustomThumbnailField}
                                classes={classes}
                            />
                            {props.values.isCustomThumbnail && !isUpdating && <ThumbnailSelectButton {...props} />}
                        </div>

                        {!isUpdating && <Field name="thumbnail" component={ThumbnailField} classes={classes} />}
                    </MuiThemeProvider>

                    <Field name="content" component={ContentField} />

                    {props.isValid && (
                        <SubmitButtons
                            isUpdate={isUpdating}
                            isPublished={isPublished}
                            submit={() => generateRequestParams(props.values, isUpdating)}
                        />
                    )}
                </form>
            )}
        />
    );
}

export default connect(
    (state: StoreState) => selectEditingArticle(state),
    null
)(withStyles(style)(ArticleForm));
