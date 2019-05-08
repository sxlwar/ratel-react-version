import React, { useState } from 'react';
import { StoreState } from '../../store/model/model';
import { selectUser, UserState, logout } from '../../store/slices/user.slice';
import { connect } from 'react-redux';
import Icon from '../icon';
import { Menu, MenuItem, withStyles } from '@material-ui/core';
import { push, Push } from 'connected-react-router';

interface Props extends UserState {
    classes?: { paper: string };
    push: Push;
    logout: () => any;
}

const styles = {
    paper: {
        top: '76px!important'
    }
};

function ControlCenter({ user, classes, logout, push }: Props) {
    const [anchorEl, updateAnchorEl] = useState<null | HTMLElement>(null);
    const onClose = () => {
        updateAnchorEl(null);
    };

    return (
        <div>
            <img
                src={user.avatar}
                onClick={event => updateAnchorEl(event.currentTarget)}
                alt=""
                style={{ zIndex: 9 }}
            />
            <span>{user.name || user.account}</span>
            <Icon icon="edit" className="edit icon" handler={{ onClick: () => push('/create') }} />
            <Menu
                id="control-center-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClick={() => onClose()}
                classes={{ paper: classes!.paper }}
                disableAutoFocusItem
            >
                <MenuItem onClick={() => console.log('navigate to personal center')}>个人中心</MenuItem>
                <MenuItem
                    onClick={() => {
                        onClose();
                        logout();
                    }}
                >
                    退出
                </MenuItem>
            </Menu>
        </div>
    );
}

export default connect(
    (state: StoreState) => selectUser(state),
    { logout, push }
)(withStyles(styles)(ControlCenter));
