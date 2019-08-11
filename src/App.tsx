import './App.scss';

import { ConnectedRouter } from 'connected-react-router';
import React from 'react';
import { Provider } from 'react-redux';
import { Route, RouteProps, Switch } from 'react-router-dom';

import CreateComponent from './components/create';
import HomeComponent from './components/home';
import Nav from './components/nav';
import TopicComponent from './components/topic';
import store, { history } from './store';
import './App.scss';
import SnackBar from './components/tip/snackbar';
import Alert from './components/tip/alert';

const routes: RouteProps[] = [
    { path: '/home', component: HomeComponent, exact: true },
    { path: '/topic', component: TopicComponent },
    { path: '/create', component: CreateComponent }
];

const App: React.FC = () => {
    return (
        <Provider store={store}>
            <Nav />
            <div id='content'>
                <ConnectedRouter history={history}>
                    <Switch>
                        {routes.map((route, idx) => (
                            <Route key={idx} path={route.path} component={route.component} exact={route.exact} />
                        ))}
                    </Switch>
                </ConnectedRouter>
            </div>
            <SnackBar />
            <Alert />
        </Provider>
    );
};

export default App;
