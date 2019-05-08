import navSlice from './nav.slice';
import userSlice from './user.slice';
import { connectRouter } from 'connected-react-router';
import { History } from 'history';

export default (history: History) => ({
    router: connectRouter(history),
    ...navSlice,
    ...userSlice
});
