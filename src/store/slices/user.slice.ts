import { createSelector, createSlice, PayloadAction, SliceActionCreator } from 'redux-starter-kit';
import { User } from '../../service/model/model';
import { StoreState } from '../model/model';

export interface UserState {
    user: User;
    expireCodes: string[];
}

export interface LoginPayload {
    code: string;
    state: string;
}

const initialState: UserState = {
    user: null,
    expireCodes: []
};

export type LoginAction = PayloadAction<LoginPayload | null>;
export type LoginCreator = SliceActionCreator<LoginPayload>;

export type LoginResponsePayload = User;
export type LoginResponseAction = PayloadAction<LoginResponsePayload>;
export type LoginResponseCreator = SliceActionCreator<LoginResponsePayload>;

export type LogoutPayload = void;
export type LogoutAction = PayloadAction<LogoutPayload>;
export type LogoutCreator = SliceActionCreator<LogoutPayload>;

export type LogoutResponsePayload = Boolean;
export type LogoutResponseAction = PayloadAction<LogoutResponsePayload>;
export type LogoutResponseCreator = SliceActionCreator<LogoutResponsePayload>;

export const userSlice = 'user';

export const {
    reducer: userReducer,
    actions: { login, loginResponse, logout, logoutResponse },
    selectors: navSelectors
} = createSlice({
    slice: userSlice,
    initialState,
    reducers: {
        login: (state: UserState, { payload }: LoginAction) => {
            if (payload) {
                state.expireCodes = [...state.expireCodes, payload.code];
            }
        },

        loginResponse: (state: UserState, { payload }: LoginResponseAction) => {
            state.user = payload;
        },

        logout: (state: UserState, { payload }: LogoutAction) => {},

        logoutResponse: (state: UserState, { payload }: LogoutResponseAction) => {
            state.user = payload ? null : state.user;
        }
    }
});

export const selectUser = createSelector<StoreState, UserState>([userSlice]);
export const selectExpiredCodes = createSelector<StoreState, string[]>(
    [selectUser],
    (state: UserState) => state.expireCodes
);

export default {
    [userSlice]: userReducer
};
