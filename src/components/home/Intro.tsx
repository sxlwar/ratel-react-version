import { Button, Card, CardActions, CardContent, Link } from '@material-ui/core';
import React from 'react';
import ReactPng from '../../assets/images/react.svg';
import rxjs from '../../assets/images/rxjs.png';
import typescriptlang from '../../assets/images/typescript.png';
import './intro.scss';


interface IntroProps {
    img: string;
    title: string;
    intro: string;
    officialAddress: string;
}

function IntroItem({ img, title, intro, officialAddress }: IntroProps) {
    return (
        <Card className="IntroItem">
            <h4>{title}</h4>
            <CardContent className="IntroItemContent">
                <img src={img} alt={title} width="110" height="110" />
                <p> {intro}</p>
            </CardContent>
            <CardActions className="IntroItemAction">
                <Button variant="contained" color="primary">
                    <Link color="inherit" href={officialAddress} target="_blank" underline="none">
                        官方网站
                   </Link>
                </Button>
            </CardActions>
        </Card>
    );
}

const intros: IntroProps[] = [
    {
        img: typescriptlang,
        title: 'Typescript',
        intro: 'TypeScript 是 JavaScript 的超集，它可以编译出纯净、简洁的 JavaScript 代码。',
        officialAddress: 'https://www.typescriptlang.org'
    },
    {
        img: ReactPng,
        title: 'React',
        intro: 'React 是一个基于 JavaScript 的 UI Library，它能帮你更轻松的构建 Web 应用。',
        officialAddress: 'https://reactjs.org/'
    },
    {
        img: rxjs,
        title: 'Rxjs',
        intro: 'RxJS 是 JavaScript 版本的响应式编程库，它使得编写异步或基于回调的代码更容易。',
        officialAddress: 'https://rxjs-dev.firebaseapp.com'
    }
];

function Intro() {
    return (
        <div id="intro">
            {intros.map((item, idx) => (
                <IntroItem key={idx} {...item} />
            ))}
        </div>
    );
}

export default Intro;
