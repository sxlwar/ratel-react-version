import React from 'react';
import './App.scss';
import Nav from './components/nav';
import { Provider } from 'react-redux';
import store from './store';

const App: React.FC = () => {
    return (
        <Provider store={store}>
            <Nav />
        </Provider>
    );
};

export default App;
