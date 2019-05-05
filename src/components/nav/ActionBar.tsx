import { createMuiTheme, MuiThemeProvider } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { Motion, spring } from 'react-motion';

import './actionBar.scss';

import React from 'react';

import Icon from '../icon';
import { connect } from 'react-redux';
import { StoreState } from '../../store/model/model';
import { toggleSearchBox, selectNav } from '../../store/slices/nav';

interface Props {
  showSearch: boolean;
  //   isLogin: boolean;
  toggleSearchBox: any;
}

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

function ActionBar({ showSearch, toggleSearchBox }: Props) {
  return (
    <div className="action">
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

      <Icon icon="search" className="icon" handler={{ onClick: () => toggleSearchBox() }} />

      <MuiThemeProvider theme={theme}>
        <Button variant="contained">登录</Button>
      </MuiThemeProvider>
    </div>
  );
}

export default connect(
  (state: StoreState) => selectNav(state),
  { toggleSearchBox }
)(ActionBar);
