import { IconButton, SnackbarContent, Theme } from '@material-ui/core';
import amber from '@material-ui/core/colors/amber';
import green from '@material-ui/core/colors/green';
import Snackbar from '@material-ui/core/Snackbar';
import { withStyles } from '@material-ui/core/styles';
import { SvgIconProps } from '@material-ui/core/SvgIcon';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CloseIcon from '@material-ui/icons/Close';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import WarningIcon from '@material-ui/icons/Warning';

import classNames from 'classnames';
import React from 'react';
import { connect } from 'react-redux';

import { StoreState } from '../../store/model/model';
import { closeSnackbar, ProjectSnackbarType, selectSnackbar, SnackbarState } from '../../store/slices/tip.slice';

const variantIcon: { [K in ProjectSnackbarType]: React.ComponentType<SvgIconProps> } = {
    success: CheckCircleIcon,
    warning: WarningIcon,
    error: ErrorIcon,
    info: InfoIcon
};

const styles = (theme: Theme) => ({
    snackbar: {
        color: '#fff'
    },
    success: {
        backgroundColor: green[600]
    },
    error: {
        backgroundColor: theme.palette.error.dark
    },
    info: {
        backgroundColor: theme.palette.primary.dark
    },
    warning: {
        backgroundColor: amber[700]
    },
    icon: {
        fontSize: 20
    },
    iconVariant: {
        opacity: 0.9,
        marginRight: theme.spacing.unit
    },
    message: {
        display: 'flex',
        alignItems: 'center'
    }
});

interface ProjectSnackBarProps extends SnackbarState {
    classes?: { [key: string]: any };
    onClose: () => void;
}

function ProjectSnackbarContent(props: ProjectSnackBarProps) {
    const { open, classes, message, variant, onClose, ...other } = props;
    const Icon = variantIcon[variant];

    return (
        <SnackbarContent
            className={classNames(classes[variant], classes.snackbar)}
            aria-describedby="client-snackbar"
            message={
                <span id="client-snackbar" className={classes.message}>
                    <Icon className={classNames(classes.icon, classes.iconVariant)} />
                    {message}
                </span>
            }
            action={[
                <IconButton key="close" aria-label="Close" color="inherit" onClick={() => onClose()}>
                    <CloseIcon className={classes.icon} />
                </IconButton>
            ]}
            {...other}
        />
    );
}

const ProjectSnackbarContentWrapper = withStyles(styles)(ProjectSnackbarContent);

function ProjectSnackbar({ open, message = '', variant = 'info', onClose }: ProjectSnackBarProps) {
    return (
        <div>
            <Snackbar
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center'
                }}
                open={open}
            >
                <ProjectSnackbarContentWrapper {...{ open, message, variant, onClose }} />
            </Snackbar>
        </div>
    );
}

export default connect(
    (store: StoreState) => selectSnackbar(store),
    { onClose: closeSnackbar }
)(ProjectSnackbar);
