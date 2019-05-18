import React from 'react';

import Intro from './Intro';
import { Button } from '@material-ui/core';
import ErrorService from '../../service/error.service';

function Home() {
    return (
        <>
            <Intro />
            <Button variant="contained" onClick={() => ErrorService.instance.showErrorMessage('xxxxx')}>
                snackbar
            </Button>
        </>
    );
}

export default Home;
