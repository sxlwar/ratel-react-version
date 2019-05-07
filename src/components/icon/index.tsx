import React from 'react';
import './index.scss';

interface Props {
    icon: string;
    style?: object;
    className?: string;
    handler?: { [key: string]: (e: any) => void };
}

function Icon({ icon, style, className, handler }: Props) {
    const name = `icon-${icon}`;

    return <span className={name + ' ' + className} style={{ ...style }} {...handler} />;
}

export default Icon;
