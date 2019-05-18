import React from 'react';
import Markdown, { ReactMarkdownProps } from 'react-markdown';

import 'prismjs';
import 'prismjs/themes/prism-okaidia.css';
import 'prismjs/components/prism-css.min.js';
import 'prismjs/components/prism-typescript.min.js';
import 'prismjs/components/prism-javascript.min.js';
import 'prismjs/components/prism-bash.min.js';
import 'prismjs/components/prism-less.min.js';
import 'prismjs/components/prism-scss.min.js';
import 'prismjs/components/prism-json.min.js';

import { markdownDefaultOptions } from './util';

const defaultProps = markdownDefaultOptions();

const ProjectMarkdown = (props: ReactMarkdownProps) => {
    const completeProps = { ...defaultProps, ...props };

    return <Markdown {...completeProps} />;
};

export default ProjectMarkdown;
