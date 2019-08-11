import React, { Fragment } from 'react';

import Intro from './Intro';

function Home() {
    return (
        <Fragment>
            <Intro />
            {/* <Button variant="contained" onClick={() => message.showErrorMessage('xxxxx')}>
                snackbar
            </Button>
            <Button
                variant="contained"
                onClick={() => message.alert('确认后此文章将无法找回，确定要删除这篇文章吗？', deleteArticle({id: 0}))}
            >
                dialog
            </Button> */}
        </Fragment>
    );
}

export default Home;
