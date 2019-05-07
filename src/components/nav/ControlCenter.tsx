import React, { useState } from 'react';
import { StoreState } from '../../store/model/model';
import { selectUser, UserState } from '../../store/slices/user';
import { connect } from 'react-redux';
import Icon from '../icon';
import { Menu, MenuItem, withStyles } from '@material-ui/core';

interface Props extends UserState {
    classes?: { paper: string };
}

const styles = {
    paper: {
        top: '76px!important'
    }
};

function ControlCenter({ user, classes }: Props) {
    const [anchorEl, updateAnchorEl] = useState<null | HTMLElement>(null);
    const onClose = () => {
        updateAnchorEl(null);
    };

    const logout = () => {
        console.log('logout');
        onClose();
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
            <Icon icon="edit" className="edit icon" />

            <Menu
                id="control-center-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClick={() => onClose()}
                classes={{ paper: classes!.paper }}
                disableAutoFocusItem
            >
                <MenuItem onClick={() => console.log('navigate to personal center')}>个人中心</MenuItem>
                <MenuItem onClick={logout}>退出</MenuItem>
            </Menu>
        </div>
    );
}

export default connect((state: StoreState) => selectUser(state))(withStyles(styles)(ControlCenter));
