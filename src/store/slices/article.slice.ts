import { createSelector, createSlice, PayloadAction, SliceActionCreator } from 'redux-starter-kit';

import { StoreState, RestfulState } from '../model/model';
import { ArticleCreation } from '../../components/form';
import {
    CreateArticleResponse,
    ArticleDeleteResponse,
    Article,
    ArticleUpdateResponse
} from '../../service/model/model';
import { ArticleDeleteRequest, ArticleUpdateRequest } from '../../service/model/request.interface';

export type ProjectSnackbarType = 'success' | 'warning' | 'error' | 'info';

export type ArticleCreateState = RestfulState<ArticleCreation, CreateArticleResponse>;
export type ArticleDeleteState = RestfulState<ArticleDeleteRequest, ArticleDeleteResponse>;
export type ArticleUpdateState = RestfulState<ArticleUpdateRequest, ArticleUpdateResponse>;

export interface EditingArticle {
    id?: number;
    article?: Article | ArticleCreation;
}

export interface ArticleState {
    create: ArticleCreateState;
    delete: ArticleDeleteState;
    update: ArticleUpdateState;
    editingArticle: EditingArticle;
}

const initialState: ArticleState = {
    create: null,
    delete: null,
    update: null,
    editingArticle: {}
};

export type CreateArticlePayload = ArticleCreation;
export type CreateArticleAction = PayloadAction<CreateArticlePayload>;
export type CreateArticleCreator = SliceActionCreator<CreateArticlePayload>;

export type CreateArticleResponsePayload = CreateArticleResponse;
export type CreateArticleResponseAction = PayloadAction<CreateArticleResponsePayload>;
export type CreateArticleResponseCreator = SliceActionCreator<CreateArticleResponsePayload>;

export type DeleteArticlePayload = ArticleDeleteRequest;
export type DeleteArticleAction = PayloadAction<DeleteArticlePayload>;
export type DeleteArticleCreator = SliceActionCreator<DeleteArticlePayload>;

export type DeleteArticleResponsePayload = ArticleDeleteResponse;
export type DeleteArticleResponseAction = PayloadAction<DeleteArticleResponsePayload>;
export type DeleteArticleResponseCreator = SliceActionCreator<DeleteArticleResponsePayload>;

export type UpdateArticlePayload = ArticleUpdateRequest;
export type UpdateArticleAction = PayloadAction<UpdateArticlePayload>;
export type UpdateArticleCreator = SliceActionCreator<UpdateArticlePayload>;

export type UpdateArticleResponsePayload = ArticleUpdateResponse;
export type UpdateArticleResponseAction = PayloadAction<UpdateArticleResponsePayload>;
export type UpdateArticleResponseCreator = SliceActionCreator<UpdateArticleResponsePayload>;

export type SetEditingPayload = EditingArticle;
export type SetEditingAction = PayloadAction<SetEditingPayload>;
export type SetEditingCreator = SliceActionCreator<SetEditingPayload>;

export const articleSlice = 'article';

export const {
    reducer: articleReducer,
    actions: {
        createArticle,
        createArticleResponse,
        deleteArticle,
        deleteArticleResponse,
        updateArticle,
        updateArticleResponse,
        setEditingArticle
    },
    selectors: articleSelectors
} = createSlice({
    slice: articleSlice,
    initialState,
    reducers: {
        createArticle: (state: ArticleState, { payload }: CreateArticleAction) => {
            state.create = { ...state.create, request: payload };
        },

        createArticleResponse: (state: ArticleState, { payload }: CreateArticleResponseAction) => {
            state.create.response = payload;
            state.editingArticle = { id: payload.id, article: state.create.request };
        },

        deleteArticle: (state: ArticleState, { payload }: DeleteArticleAction) => {
            state.delete = { ...state.delete, request: payload };
        },

        deleteArticleResponse: (state: ArticleState, { payload }: DeleteArticleResponseAction) => {
            state.delete.response = payload;
        },

        updateArticle: (state: ArticleState, { payload }: UpdateArticleAction) => {
            state.update = { ...state.update, request: payload };
        },

        updateArticleResponse: (state: ArticleState, { payload }: UpdateArticleResponseAction) => {
            state.update.response = payload;
        },

        setEditingArticle: (state: ArticleState, { payload }: SetEditingAction) => {
            state.editingArticle = payload;
        }
    }
});

export const selectArticle = createSelector<StoreState, ArticleState>([articleSlice]);

export const selectCreateState = createSelector<StoreState, ArticleCreateState>(
    [selectArticle],
    (state: ArticleState) => state.create
);

export const selectDeleteState = createSelector<StoreState, ArticleDeleteState>(
    [selectArticle],
    (state: ArticleState) => state.delete
);

export const selectUpdateState = createSelector<StoreState, ArticleUpdateState>(
    [selectArticle],
    (state: ArticleState) => state.update
);

export const selectEditingArticle = createSelector<StoreState, EditingArticle>(
    [selectArticle],
    (state: ArticleState) => state.editingArticle
);

export default {
    [articleSlice]: articleReducer
};
