import { IconButton, Tooltip, withStyles } from '@material-ui/core';

import './index.scss';

import React, { ChangeEvent, useState } from 'react';
import { Motion, spring } from 'react-motion';
import { connect } from 'react-redux';

import { upload } from '../../store/slices/upload.slice';
import Icon from '../icon';
import ProjectMarkdown from '../markdown';
import CodeMirror, { defaultProps } from './codemirror';
import classNames from 'classnames';

interface Props {
    classes: any;
    tip?: string;
    value?: string;
    showBack?: boolean;
    upload: (files: FileList) => void;
    onContentChange?: (content: string) => void;
}

const style = {
    container: {
        display: 'flex'
    },
    editor: {
        height: '100%',
        paddingBottom: '2em',
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center'
    },
    btn: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }
};

function Editor({ classes, upload, onContentChange, value, tip = '', showBack = false }: Props) {
    const [showPreview, toggleShowPreview] = useState(true);
    const [content, setContent] = useState(value);
    const onCodeMirrorContentChange = (value: string, change: CodeMirror.EditorChangeLinkedList) => {
        setContent(value);

        onContentChange && onContentChange(value);
    };

    return (
        <div className={classNames(classes.container, 'container', 'full-model')}>
            <Motion style={{ x: spring(showPreview ? 48 : 99.8) }}>
                {({ x }) => (
                    <>
                        <div className={classNames(classes.editor, 'editor')} style={{ minWidth: x + '%' }} onDrop={(event) => {
                            const transfer = event.dataTransfer;

                            if(!!transfer) {
                                upload(transfer.files);
                            }
                        }}>
                            <ul className={classNames(classes.toolbar,'toolbar')}>
                                <li className={classNames(classes.btn, 'btn')}>
                                    <Tooltip title="插入图片" placement="top">
                                        <IconButton>
                                            <Icon icon="picture" className="icon" />
                                            <input
                                                type="file"
                                                multiple
                                                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                                                    upload(event.target.files)
                                                }
                                            />
                                        </IconButton>
                                    </Tooltip>
                                </li>
                                <li className={classNames(classes.btn, 'btn')}>
                                    <Tooltip title="预览markdown" placement="top">
                                        <IconButton onClick={() => toggleShowPreview(!showPreview)}>
                                            <Icon icon="previewcode" className="icon" />
                                        </IconButton>
                                    </Tooltip>
                                </li>
                                {showBack && (
                                    <li className={classNames(classes.btn, 'btn')}>
                                        <Tooltip title="返回" placement="top">
                                            <IconButton>
                                                <Icon icon="back" className="icon" />
                                            </IconButton>
                                        </Tooltip>
                                    </li>
                                )}

                                <li>支持 Markdown 语法 {tip}</li>
                            </ul>
                            <CodeMirror {...defaultProps} value={content} onChange={onCodeMirrorContentChange} />
                        </div>
                        {/* 最大宽度 99.8% ，margin-left 4% editor 宽度 x */}
                        <div className="preview" style={{ minWidth: 99.8 - 4 - x + '%' }}>
                            <ProjectMarkdown source={content} />
                        </div>
                    </>
                )}
            </Motion>
        </div>
    );
}

export default connect(
    null,
    { upload }
)(withStyles(style)(Editor));
