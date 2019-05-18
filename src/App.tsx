import './App.scss';

import { ConnectedRouter } from 'connected-react-router';
import React from 'react';
import { Provider } from 'react-redux';
import { Redirect, Route, RouteProps, Switch } from 'react-router-dom';

import Create from './components/create';
import Home from './components/home';
import Nav from './components/nav';
import Topic from './components/topic';
import store, { history } from './store';
import './App.scss';
import SnackBar from './components/tip/snackbar';

const routes: RouteProps[] = [
    { path: '/home', component: Home, exact: true },
    { path: '/topic/angular', component: Topic },
    { path: '/create', component: Create }
];

const App: React.FC = () => {
    return (
        <Provider store={store}>
            <Nav />
            <div id='content'>
                <ConnectedRouter history={history}>
                    <>
                        <Switch>
                            {routes.map((route, idx) => (
                                <Route key={idx} path={route.path} component={route.component} exact={route.exact} />
                            ))}
                            <Redirect from="/" to="/home" />
                        </Switch>
                    </>
                </ConnectedRouter>
            </div>
            <SnackBar />
        </Provider>
    );
};

export default App;
