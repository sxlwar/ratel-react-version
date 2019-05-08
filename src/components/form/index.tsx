import React from 'react';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';

import './index.scss';

interface ArticleFormProps {
    title?: string;
    subtitle?: string;
    author?: string;
    classes: any;
}

const style = (theme: any) => {
    console.log(theme);
    return {
        'ratel-form-field': {
            display: 'flex',
            'flex-direction': 'column'
        },
        textField: {
            marginLeft: theme.spacing.unit,
            marginRight: theme.spacing.unit
        },
        root: {
            border: '1px solid blue'
        }
    };
};

function ArticleForm({ title = '', subtitle = '', author = '', classes }: ArticleFormProps) {
    return (
        <form action="" className={classes['ratel-form-field'] + ' ratel-form-field'}>
            <TextField
                id="outlined-title"
                label="文章标题"
                margin="normal"
                variant="outlined"
                placeholder="请输入标题"
                // value={title}
                className={classes.textField}
            />

            <TextField
                id="outlined-subtitle"
                label="副标题"
                margin="normal"
                variant="outlined"
                placeholder="可以在这里输入一个副标题"
                value={subtitle}
            />

            <TextField id="outlined-author" label="作者" margin="normal" variant="outlined" value={author} />
        </form>
    );
}

export default withStyles(style)(ArticleForm);
