import { createMuiTheme, Dialog, DialogTitle, MuiThemeProvider, withStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import MuiDialogActions from '@material-ui/core/DialogActions';
import MuiDialogContent from '@material-ui/core/DialogContent';

import React, { useState } from 'react';
import Icon from '../icon';

import authService from '../../service/auth.service';

const theme = createMuiTheme({
    palette: {
        grey: {
            A100: '#434343',
            300: '#434343'
        }
    },
    typography: {
        useNextVariants: true
    }
});

const DialogContent = withStyles({
    root: {
        'text-align': 'center',
        width: 500
    }
})(MuiDialogContent);

const DialogActions = withStyles({
    root: {
        marginLeft: '1rem',
        justifyContent: 'flex-start'
    }
})(MuiDialogActions);

const DialogButton = withStyles({
    root: {
        width: '75%',
        lineHeight: '3rem'
    }
})(Button);

function Login() {
    const [open, handleOpen] = useState(false);
    const close = () => handleOpen(false);
    const getLoginConfig = () => {
        authService.getGithubAddress(window.location.pathname).subscribe(domain => {
            window.location.href = domain;
        });
    };

    return (
        <React.Fragment>
            <MuiThemeProvider theme={theme}>
                <Button variant="contained" onClick={() => handleOpen(true)}>
                    登录
                </Button>
            </MuiThemeProvider>
            <Dialog onClose={close} aria-labelledby="login-dialog-title" open={open}>
                <DialogTitle id="login-dialog-title">请选择登录方式</DialogTitle>
                <DialogContent>
                    <DialogButton
                        variant="contained"
                        color="primary"
                        onClick={() => {
                            getLoginConfig();
                            close();
                        }}
                    >
                        <Icon icon="github" style={{ marginRight: '1rem' }} />
                        使用Github帐号登录
                    </DialogButton>
                </DialogContent>
                <DialogActions>
                    <Button onClick={close}>暂不登录</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}

export default Login;
