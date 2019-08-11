import './intro.scss';

import React from 'react';
import ReactPng from '../../assets/images/react.svg';
import angular from '../../assets/images/angular.png';
import rxjs from '../../assets/images/rxjs.png';
import typescriptlang from '../../assets/images/typescript.png';
import Icon from '../icon';

interface IntroProps {
    img: string;
    intro: string;
    officeAddress: string;
}

function IntroItem({ img, intro, officeAddress }: IntroProps) {
    return (
        <li>
            <div className="language-intro">
                <img src={img} alt="intro" />
            </div>
            <p>{intro}</p>
            <div className="official">
                <Icon icon="arrowright" className="arrowright" />
                <a href={officeAddress} target="__blank">
                    官方网站
                </a>
            </div>
        </li>
    );
}

const intros: IntroProps[] = [
    {
        img: typescriptlang,
        intro: 'TypeScript 是 JavaScript的超集，它可以编译出纯净、简洁的JavaScript代码。',
        officeAddress: 'https://www.typescriptlang.org'
    },
    {
        img: ReactPng,
        intro: 'React 是一个基于 JavaScript 的 UI Library，它能帮你更轻松的构建 Web 应用。',
        officeAddress: 'https://reactjs.org/'
    },
    {
        img: rxjs,
        intro: 'RxJS 是JavaScript版本的响应式编程库，它使得编写异步或基于回调的代码更容易。',
        officeAddress: 'https://rxjs-dev.firebaseapp.com'
    }
];

function Intro() {
    return (
        <ul id="intro">
            {intros.map((item, idx) => (
                <IntroItem key={idx} {...item} />
            ))}
        </ul>
    );
}

export default Intro;
