import { Menu, MenuItem, withStyles } from '@material-ui/core';

import './navMenu.scss';

import React, { useState } from 'react';
import { connect } from 'react-redux';

import { ArticleCategory } from '../../constant/constant';
import { StoreState } from '../../store/model/model';
import { selectNav, toggleTopic } from '../../store/slices/nav';
import { curryRight, PredicateFn } from '../../utils';
import Icon from '../icon';

export interface NavItem {
  label: string;
  topic: string;
}

interface Props {
  active: NavItem;
  toggleTopic: any;
  classes?: { paper: string };
}

const isActive: PredicateFn<NavItem, string> = (target: NavItem, currentTopic: string) => {
  return target.topic === currentTopic;
};

const topics: NavItem[] = [
  { label: '首页', topic: '' },
  { label: 'Angular', topic: ArticleCategory.angular },
  { label: 'Rxjs', topic: ArticleCategory.rxjs },
  { label: 'TypeScript', topic: ArticleCategory.typescript },
  { label: 'JavaScript', topic: ArticleCategory.javascript },
  { label: 'Other', topic: ArticleCategory.other },
  { label: 'NGX_FORMLY_ZORRO', topic: ArticleCategory.NGX_FORMLY_ZORRO }
];

function NormalMenu({ active, toggleTopic }: Props) {
  const isSelected = curryRight(isActive)(active.topic);

  return (
    <div className="bar">
      {topics.map(item => {
        const active = isSelected(item);
        return (
          // eslint-disable-next-line
          <a href="#" key={item.label} onClick={() => toggleTopic(item)} style={{ color: active ? '#fff' : '#c7c2c7' }}>
            {item.label}
            <i className={active ? 'active' : ''} />
          </a>
        );
      })}
    </div>
  );
}

const styles = {
  paper: {
    top: '76px!important'
  }
};

function DropdownMenu({ active, toggleTopic, classes }: Props) {
  const isSelected = curryRight(isActive)(active.topic);
  const [anchorEl, updateAnchorEl] = useState<null | HTMLElement>(null);
  const onClose = (item: NavItem | null) => {
    item && toggleTopic(item);
    updateAnchorEl(null);
  };

  return (
    <div className="menu">
      <Icon icon="bars" handler={{ onClick: event => updateAnchorEl(event.currentTarget) }} />

      <Menu
        id="nav-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClick={() => onClose(null)}
        classes={{ paper: classes!.paper }}
      >
        {topics.map(item => {
          const active = isSelected(item) as boolean;

          return (
            <MenuItem key={item.label} selected={active} onClick={() => onClose(item)}>
              {item.label}
            </MenuItem>
          );
        })}
      </Menu>
    </div>
  );
}

const connectStore = connect(
  (store: StoreState) => selectNav(store),
  { toggleTopic }
);

const Normal = connectStore(NormalMenu);

const Dropdown = connectStore(withStyles(styles)(DropdownMenu));

function NavMenu() {
  return (
    <div id="nav-menu">
      <Normal />
      <Dropdown />
    </div>
  );
}

export default NavMenu;
