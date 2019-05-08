import { Action } from 'redux';
import { combineEpics, createEpicMiddleware } from 'redux-observable';
import { configureStore, getDefaultMiddleware } from 'redux-starter-kit';
import { StoreState } from './model/model';
import epics from './epics';
import reducer from './slices';
import { createBrowserHistory } from 'history';
import { routerMiddleware } from 'connected-react-router'

export const history = createBrowserHistory();

const rootEpic: any = combineEpics.apply(combineEpics, Object.values(epics));

const epicMiddleware = createEpicMiddleware<Action>();

const store = configureStore<StoreState, Action>({
    reducer: reducer(history),
    middleware: [...getDefaultMiddleware(), epicMiddleware, routerMiddleware(history)]
});

epicMiddleware.run(rootEpic);

export default store;
