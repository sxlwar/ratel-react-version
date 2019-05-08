import { createSelector, createSlice, PayloadAction, SliceActionCreator } from 'redux-starter-kit';
import { NavItem } from '../../components/nav/NavMenu';
import { StoreState } from '../model/model';

export interface NavState {
    active: NavItem;
    showSearch: boolean;
}

const initialState: NavState = {
    active: {
        label: '首页',
        topic: ''
    },
    showSearch: false
};

export type ToggleTopicPayload = NavItem;
export type ToggleTopicAction = PayloadAction<ToggleTopicPayload>;
export type ToggleTopicCreator = SliceActionCreator<ToggleTopicPayload>;

export type ToggleSearchBoxPayload = void;
export type ToggleSearchBoxAction = PayloadAction<ToggleSearchBoxPayload>;
export type ToggleSearchBoxCreator = SliceActionCreator<ToggleSearchBoxPayload>;

export type Action = ToggleTopicAction | ToggleSearchBoxAction;
export type Creator = ToggleTopicCreator | ToggleSearchBoxCreator;

export const navSlice = 'nav';

export const {
    reducer: navReducer,
    actions: { toggleTopic, toggleSearchBox },
    selectors: navSelectors
} = createSlice({
    slice: navSlice,
    initialState,
    reducers: {
        toggleTopic: (state: NavState, { payload }: ToggleTopicAction) => {
            state.active = payload;
        },
        toggleSearchBox: (state: NavState) => {
            state.showSearch = !state.showSearch;
        }
    }
});

export const selectNav = createSelector<StoreState, NavState>([navSlice]);
export const selectSearchBox = createSelector<StoreState, boolean>(
    [selectNav],
    (state: NavState) => state.showSearch
);

export default {
    [navSlice]: navReducer,
}
