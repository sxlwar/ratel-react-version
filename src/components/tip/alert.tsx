import { Theme } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { withStyles } from '@material-ui/core/styles';

import classNames from 'classnames';
import React from 'react';
import { connect } from 'react-redux';

import store from '../../store';
import { StoreState } from '../../store/model/model';
import { AlertState, closeAlert, CloseAlertPayload, selectAlert } from '../../store/slices/tip.slice';

const styles = (theme: Theme) => ({
    alert: {
        color: '#fff'
    },
    confirmBtn: {
        backgroundColor: theme.palette.error.dark,
        '&:hover': {
            backgroundColor: theme.palette.error.main
        }
    },
    btn: {
        margin: '1em'
    }
});

interface ProjectAlertProps extends AlertState {
    classes?: { [key: string]: any };
    onClose: (payload: CloseAlertPayload) => void;
}

function ProjectAlert({ open, message, onClose, classes, confirmAction, title = '操作确认' }: ProjectAlertProps) {
    const close = () => onClose({ open: false });
    const confirm = () => {
        close();
        store.dispatch(confirmAction);
    };

    return (
        <Dialog
            open={open}
            onClose={close}
            fullWidth={true}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">{message}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={() => confirm()}
                    variant="contained"
                    color="primary"
                    className={classNames(classes.btn, classes.confirmBtn)}
                >
                    确定
                </Button>
                <Button onClick={close} variant="contained" autoFocus className={classes.btn}>
                    取消
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default connect(
    (store: StoreState) => selectAlert(store),
    { onClose: closeAlert }
)(withStyles(styles)(ProjectAlert));
