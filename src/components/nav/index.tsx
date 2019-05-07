import React, { useEffect } from 'react';
import NavMenu from './NavMenu';
import './index.scss';
import logo from '../../assets/images/logo.png';
import ActionBar from './ActionBar';
import { Motion, spring } from 'react-motion';
import { connect } from 'react-redux';
import { StoreState } from '../../store/model/model';
import { selectSearchBox } from '../../store/slices/nav';
import { login, LoginPayload } from '../../store/slices/user';

interface Props {
    showSearch: boolean;
    login: (payload: LoginPayload) => any;
}

function Nav({ showSearch, login }: Props) {
    useEffect(() => {
        const search = window.location.search;
        const payload = search
            ? (search
                  .slice(1)
                  .split('&')
                  .map(item => item.split('='))
                  .reduce((acc: object, [key, value]) => ({ ...acc, [key]: value }), {}) as LoginPayload)
            : null;

        login(payload);
    });

    return (
        <nav>
            <div className="header">
                <div>
                    <img className="logo" src={logo} alt="" />
                    <Motion style={{ x: spring(showSearch ? 0 : 100) }}>
                        {({ x }) => (
                            <span style={{ opacity: x }}>
                                <NavMenu />
                            </span>
                        )}
                    </Motion>
                </div>
                <ActionBar />
            </div>
        </nav>
    );
}

export default connect(
    (state: StoreState) =>
        ({
            showSearch: selectSearchBox(state)
        } as Props),
    { login }
)(Nav);
