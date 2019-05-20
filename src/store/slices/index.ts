import { connectRouter } from 'connected-react-router';
import { History } from 'history';

import navSlice from './nav.slice';
import tipSlice from './tip.slice';
import uploadSlice from './upload.slice';
import userSlice from './user.slice';
import articleSlice from './article.slice';
import errorSlice from './error.slice';

export default (history: History) => ({
    router: connectRouter(history),
    ...navSlice,
    ...userSlice,
    ...tipSlice,
    ...uploadSlice,
    ...articleSlice,
    ...errorSlice,
});
