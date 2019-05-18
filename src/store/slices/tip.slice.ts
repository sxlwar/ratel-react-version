import { SnackbarProps } from '@material-ui/core/Snackbar';

import { createSelector, createSlice, PayloadAction, SliceActionCreator } from 'redux-starter-kit';

import { StoreState } from '../model/model';

export type ProjectSnackbarType = 'success' | 'warning' | 'error' | 'info';

export interface SnackbarState {
    open: boolean;
    variant?: ProjectSnackbarType;
    message?: string;
}

export interface TipState {
    snackbar: SnackbarState;
}

const initialState: TipState = {
    snackbar: {
        open: false
    }
};

export type ShowSnackbarPayload = Partial<SnackbarState>;
export type ShowSnackbarAction = PayloadAction<ShowSnackbarPayload>;
export type ShowSnackbarCreator = SliceActionCreator<ShowSnackbarPayload>;

export type CloseSnackbarPayload = void;
export type CloseSnackbarAction = PayloadAction<CloseSnackbarPayload>;
export type CloseSnackbarCreator = SliceActionCreator<CloseSnackbarPayload>;

export const tipSlice = 'tip';

export const {
    reducer: tipReducer,
    actions: { showSnackbar, closeSnackbar },
    selectors: tipSelectors
} = createSlice({
    slice: tipSlice,
    initialState,
    reducers: {
        showSnackbar: (state: TipState, { payload }: ShowSnackbarAction) => {
            state.snackbar = { ...payload, open: true };
        },
        closeSnackbar: (state: TipState) => {
            // * 这里只改了open的状态，因此store中存储的是上一次的提示信息；如果把状态重置会导致 snackbar 的消化时颜色可能不一致，不太和谐。
            state.snackbar.open = false;
        }
    }
});

export const selectTip = createSelector<StoreState, TipState>([tipSlice]);
export const selectSnackbar = createSelector<StoreState, SnackbarState>(
    [selectTip],
    (state: TipState) => state.snackbar
);

export default {
    [tipSlice]: tipReducer
};
