import red from '@material-ui/core/colors/red';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

import './actionBar.scss';

import React from 'react';
import { Motion, spring } from 'react-motion';
import { connect } from 'react-redux';

import { StoreState } from '../../store/model/model';
import { selectNav, toggleSearchBox } from '../../store/slices/nav.slice';
import { selectUser } from '../../store/slices/user.slice';
import Icon from '../icon';
import ControlCenter from './ControlCenter';
import Login from './Login';

interface Props {
    showSearch: boolean;
    toggleSearchBox: any;
    hasLogin: boolean;
}

const theme = createMuiTheme({
    palette: {
        primary: {
            light: red['500'],
            main: red['700'],
            dark: red['900']
        },
        type: 'dark'
    },
    typography: {
        useNextVariants: true
    }
});

function ActionBar({ showSearch, toggleSearchBox, hasLogin }: Props) {
    return (
        <div className="action">
            <MuiThemeProvider theme={theme}>
                <Motion style={{ x: spring(showSearch ? 0 : 100) }}>
                    {({ x }) => (
                        <TextField
                            id="search-content"
                            label="请输入文章标题"
                            style={{
                                transform: `translateX(${x}%)`,
                                marginBottom: '1.125em',
                                opacity: (100 - x) / 100
                            }}
                        />
                    )}
                </Motion>
            </MuiThemeProvider>

            <Icon icon="search" className="icon" handler={{ onClick: () => toggleSearchBox() }} />

            {hasLogin ? <ControlCenter /> : <Login />}
        </div>
    );
}

export default connect(
    (state: StoreState) => ({ ...selectNav(state), hasLogin: !!selectUser(state).user }),
    { toggleSearchBox }
)(ActionBar);
