import { Action } from 'redux';
import { configureStore, getDefaultMiddleware } from 'redux-starter-kit';
import { StoreState } from './model/model';
import { navReducer, navSlice } from './slices/nav';

// const changeEnthusiasmEpic = (action$: Observable<ChangeEnthusiasmAction>, state$: StateObservable<StoreState>) =>
//   action$.pipe(
//     tap(v => console.log(v)),
//     ofType(changeEnthusiasm.toString()),
//     map(({ payload, type }) => ({ payload: payload * 2, type }))
//   );

// const setLanguageEpic = (action$: Observable<SetLanguageAction>) => action$.pipe(ofType(setLanguage.toString()));

// const rootEpic = combineEpics(changeEnthusiasmEpic, setLanguageEpic);

// const epicMiddleware = createEpicMiddleware<Action>();

export const store = configureStore<StoreState, Action>({
    reducer: {
        [navSlice]: navReducer
    },
    middleware: [...getDefaultMiddleware()]
    //   middleware: [...getDefaultMiddleware(), epicMiddleware]
});

// epicMiddleware.run(rootEpic);

export default store;
