import React from 'react';
import './index.scss';

interface Props {
    icon: string;
    style?: object;
    title?: string;
    className?: string;
    handler?: { [key: string]: (e: any) => void };
}

function Icon({ icon, title, style, className, handler }: Props) {
    const name = `icon-${icon}`;

    return <span className={name + ' ' + (className || '')} style={{ ...style }} {...handler} >
        {title}
    </span>;
}

export default Icon;
