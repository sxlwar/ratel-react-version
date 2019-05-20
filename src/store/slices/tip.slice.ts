import { createSelector, createSlice, PayloadAction, SliceActionCreator } from 'redux-starter-kit';

import { StoreState } from '../model/model';

export type ProjectSnackbarType = 'success' | 'warning' | 'error' | 'info';

interface TipUnit {
    open: boolean;
    message?: string;
}
export interface SnackbarState extends TipUnit {
    variant?: ProjectSnackbarType;
    timestamp: number;
}

export interface AlertState extends TipUnit {
    title?: string;
    confirmAction?: PayloadAction<any>; // 用户确认后需要执行的动作，由dialog的 确认按钮触发。
}

export interface TipState {
    snackbar: SnackbarState[];
    alert: AlertState;
}

const initialState: TipState = {
    snackbar: [],
    alert: {
        open: false
    }
};

export type ShowSnackbarPayload = SnackbarState;
export type ShowSnackbarAction = PayloadAction<ShowSnackbarPayload>;
export type ShowSnackbarCreator = SliceActionCreator<ShowSnackbarPayload>;

export type CloseSnackbarPayload = SnackbarState;
export type CloseSnackbarAction = PayloadAction<CloseSnackbarPayload>;
export type CloseSnackbarCreator = SliceActionCreator<CloseSnackbarPayload>;

export type ShowAlertPayload = AlertState;
export type ShowAlertAction = PayloadAction<ShowAlertPayload>;
export type ShowAlertCreator = SliceActionCreator<ShowAlertPayload>;

export type CloseAlertPayload = AlertState;
export type CloseAlertAction = PayloadAction<CloseAlertPayload>;
export type CloseAlertCreator = SliceActionCreator<CloseAlertPayload>;

export const tipSlice = 'tip';

export const {
    reducer: tipReducer,
    actions: { showSnackbar, closeSnackbar, showAlert, closeAlert },
    selectors: tipSelectors
} = createSlice({
    slice: tipSlice,
    initialState,
    reducers: {
        showSnackbar: (state: TipState, { payload }: ShowSnackbarAction) => {
            state.snackbar = [...state.snackbar, payload];
        },
        closeSnackbar: (state: TipState, { payload }: CloseSnackbarAction) => {
            // * 这里只改了open的状态，因此store中存储的是上一次的提示信息；如果把状态重置会导致 snackbar 的消化时颜色可能不一致，不太和谐。
            // state.snackbar.open = false;
            state.snackbar = state.snackbar.filter(item => item.timestamp !== payload.timestamp);
        },
        showAlert: (state: TipState, { payload }: ShowAlertAction) => {
            state.alert = payload;
        },
        closeAlert: (state: TipState, { payload }: CloseAlertAction) => {
            state.alert = payload;
        }
    }
});

export const selectTip = createSelector<StoreState, TipState>([tipSlice]);
export const selectSnackbar = createSelector<StoreState, SnackbarState[]>(
    [selectTip],
    (state: TipState) => state.snackbar
);
export const selectSnackbarItem = (timestamp: number) => createSelector<StoreState, SnackbarState>(
    [selectSnackbar],
    (state: SnackbarState[]) => state.find(item => item.timestamp === timestamp)
);

export const selectAlert = createSelector<StoreState, AlertState>(
    [selectTip],
    (state: TipState) => state.alert
);

export default {
    [tipSlice]: tipReducer
};
