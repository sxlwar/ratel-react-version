import { withStyles } from '@material-ui/core/styles';

import { fromTextArea } from 'codemirror';
import React, { MutableRefObject, useEffect, useRef } from 'react';
import { connect } from 'react-redux';

import { UploadResult } from '../../../service/upload.service';
import { StoreState } from '../../../store/model/model';
import { selectUpload } from '../../../store/slices/upload.slice';

type ChangHandler = (value: string, change: CodeMirror.EditorChangeLinkedList) => void;
type CursorActivityHandler = (editor: CodeMirror.Editor) => void;
type FocusChangeHandler = (focused: boolean) => void;
type ScrollHandler = (editor: CodeMirror.Editor) => void;

interface Props {
    className: string;
    name: string;
    onChange?: ChangHandler;
    onCursorActivity?: CursorActivityHandler;
    onFocusChange?: FocusChangeHandler;
    onScroll?: ScrollHandler;
    options: { [key: string]: any };
    preserveScrollPosition: boolean;
    value: string;
    classes?: { [key: string]: any };
    images?: UploadResult[];
}

const ALLOW_UPLOAD_FILE_TYPES = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif'];

export const defaultProps: Props = {
    className: '',
    name: '',
    options: {
        theme: 'eclipse',
        mode: 'markdown',
        indentUnit: 4,
        lineWrapping: true,
        styleActiveLine: true,
        autoFocus: false,
        dragDrop: true,
        allowDropFileTypes: ALLOW_UPLOAD_FILE_TYPES
    },
    preserveScrollPosition: false,
    value: ''
};

const styles = {
    ReactCodeMirror: {
        height: 'calc(100% - 58px)'
    }
};

function CodeMirror(props: Props) {
    const editorClassName = `${props.classes.ReactCodeMirror} ${props.className}`;
    const addEventListener = (codeMirror: CodeMirror.EditorFromTextArea) => {
        codeMirror.on('change', (editor: CodeMirror.Editor, change: CodeMirror.EditorChangeLinkedList) => {
            props.onChange && props.onChange(editor.getValue(), change);
        });
    };
    let textareaNode: MutableRefObject<HTMLTextAreaElement> = useRef(null);

    const { images } = props;

    useEffect(() => {
        const codeMirror = fromTextArea(textareaNode.current, props.options);

        addEventListener(codeMirror);

        if (images.length) {
            const url = props.images.map(image => `![${image.name}](${image.url})`).join('\n\r');
            const doc = codeMirror.getDoc();
            const cursor = doc.getCursor();
            const line = doc.getLine(cursor.line);
            const pos = {
                line: cursor.line,
                ch: line.length + 1
            };

            doc.replaceRange('\n' + url + '\n', pos);
        }

        return () => {
            codeMirror.toTextArea();
        };
    }, [images]);

    return (
        <div className={editorClassName}>
            <textarea
                ref={textareaNode}
                name={props.name}
                value={props.value}
                autoComplete="off"
                autoFocus={props.options.autoFocus}
                onChange={event => props.onChange(event.target.value, null)}
            />
        </div>
    );
}

export default connect((store: StoreState) => ({
    ...selectUpload(store)
}))(withStyles(styles)(CodeMirror));
