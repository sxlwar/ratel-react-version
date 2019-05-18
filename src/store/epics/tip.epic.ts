import { ofType, StateObservable } from 'redux-observable';
import { Observable, of } from 'rxjs';
import { delay, filter, map, mergeMapTo, takeUntil } from 'rxjs/operators';

import { StoreState } from '../model/model';
import { closeSnackbar, selectSnackbar, showSnackbar, ShowSnackbarAction } from '../slices/tip.slice';

/**
 * 3秒后关闭尝试关闭snackbar，如果它还没有被手动关掉的话。
 */
const snackbarEpic = (action$: Observable<ShowSnackbarAction>, state$: StateObservable<StoreState>) =>
    action$.pipe(
        ofType(showSnackbar.toString()),
        mergeMapTo(
            of(closeSnackbar()).pipe(
                delay(3000),
                takeUntil(
                    state$.pipe(
                        map(state => selectSnackbar(state).open),
                        filter(isOpen => !isOpen)
                    )
                )
            )
        )
    );

export default {
    snackbarEpic
};
