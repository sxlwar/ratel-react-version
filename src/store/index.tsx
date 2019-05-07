import { Action } from 'redux';
import { combineEpics, createEpicMiddleware } from 'redux-observable';
import { configureStore, getDefaultMiddleware } from 'redux-starter-kit';
import { StoreState } from './model/model';
import { navReducer, navSlice } from './slices/nav';
import { loginEpic, userReducer, userSlice } from './slices/user';

const rootEpic: any = combineEpics(loginEpic);

const epicMiddleware = createEpicMiddleware<Action>();

const store = configureStore<StoreState, Action>({
    reducer: {
        [userSlice]: userReducer,
        [navSlice]: navReducer
    },
    middleware: [...getDefaultMiddleware(), epicMiddleware]
});

epicMiddleware.run(rootEpic);

export default store;
