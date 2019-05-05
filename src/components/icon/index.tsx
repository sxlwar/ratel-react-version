import React from 'react';
import './index.scss';

interface Props {
  icon: string;
  color?: string;
  size?: string;
  className?: string;
  handler?: { [key: string]: (e: any) => void };
}

function Icon({ icon, color, size, className, handler }: Props) {
  const name = `icon-${icon}`;

  return <span className={name + ' ' + className} style={{ color, fontSize: size + 'px' }} {...handler} />;
}

export default Icon;
