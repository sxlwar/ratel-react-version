import { ofType, StateObservable } from 'redux-observable';
import { createSelector, createSlice, PayloadAction, SliceActionCreator } from 'redux-starter-kit';
import { Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

import authService from '../../service/auth.service';
import { User } from '../../service/model/model';
import { StoreState } from '../model/model';

export interface UserState {
    user: User;
}

export interface LoginPayload {
    code: string;
    state: string;
}

const initialState: UserState = {
    user: null
};

export type LoginAction = PayloadAction<LoginPayload | null>;
export type LoginCreator = SliceActionCreator<LoginPayload>;

export type LoginSuccessPayload = User;
export type LoginSuccessAction = PayloadAction<LoginSuccessPayload>;
export type LoginSuccessCreator = SliceActionCreator<LoginSuccessPayload>;

export const userSlice = 'user';

export const {
    reducer: userReducer,
    actions: { login, loginResponse },
    selectors: navSelectors
} = createSlice({
    slice: userSlice,
    initialState,
    reducers: {
        login: (state: UserState, { payload }: LoginAction) => {},

        loginResponse: (state: UserState, { payload }: LoginSuccessAction) => {
            state.user = payload;
        }
    }
});

export const selectUser = createSelector<StoreState, UserState>([userSlice]);

export const loginEpic = (action$: Observable<LoginAction>, state$: StateObservable<StoreState>) =>
    action$.pipe(
        tap(v => console.log(v)),
        ofType(login.toString()),
        switchMap(({ payload }) => {
            let source: Observable<User> = null;
            if (payload) {
                const { code, state } = payload;

                source = authService.loginAsGithubUser(code, state);
            } else {
                source = authService.checkLoginState();
            }
            return source.pipe(map(res => ({ type: loginResponse.toString(), payload: res })));
        })
    );

// const setLanguageEpic = (action$: Observable<SetLanguageAction>) => action$.pipe(ofType(setLanguage.toString()));

// const rootEpic = combineEpics(changeEnthusiasmEpic, setLanguageEpic);

// const epicMiddleware = createEpicMiddleware<Action>();
