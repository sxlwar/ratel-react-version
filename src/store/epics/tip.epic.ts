import { ofType, StateObservable } from 'redux-observable';
import { Observable, of } from 'rxjs';
import { delay, filter, map, mergeMap, takeUntil } from 'rxjs/operators';

import { StoreState } from '../model/model';
import { closeSnackbar, selectSnackbarItem, showSnackbar, ShowSnackbarAction } from '../slices/tip.slice';

/**
 * 3秒后尝试关闭snackbar，如果它还没有被手动关掉的话。
 */
const snackbarEpic = (action$: Observable<ShowSnackbarAction>, state$: StateObservable<StoreState>) =>
    action$.pipe(
        ofType(showSnackbar.toString()),
        mergeMap(({ payload }) =>
            of(closeSnackbar({ ...payload, open: false })).pipe(
                delay(3000),
                takeUntil(
                    state$.pipe(
                        map(state => selectSnackbarItem(payload.timestamp)(state)),
                        filter(isOpen => !isOpen)
                    )
                )
            )
        )
    );

export default {
    snackbarEpic
};
