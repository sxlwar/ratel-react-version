import React from 'react';
import { RouteProps, Switch, Route } from 'react-router';
import { ConnectedRouter } from 'connected-react-router';
import { history } from '../../store';

const routerNames = [
    'React',
    'ReactNative',
    'Rxjs',
    'TypeScript',
    'JavaScript',
    'Redux',
    'Mobox',
    'Other',
];
const routes: RouteProps[] = routerNames.map(name => {
    const rt: RouteProps = {
        path: `/topic/${name}`, component: () => RouterBuilder(name),
    };
    return rt;
});

function RouterBuilder(name: string) {
    return (<div>{name} Component</div>);
}


function TopicComponent() {
    return (
        <div>
            <ConnectedRouter history={history}>
                <Switch>
                    {routes.map((route, idx) => (
                        <Route key={idx} path={route.path} component={route.component} />
                    ))}
                </Switch>
            </ConnectedRouter>
        </div>
    );
}

export default TopicComponent;
