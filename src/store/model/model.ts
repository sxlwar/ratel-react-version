import { ErrorResponse } from '../../service/model/model';

/**
 * 暂时没有定义 StoreState 的形状，避免循环引用
 */
export interface StoreState {
}

export interface RestfulState<T, U> {
    request: T;
    response: U;
    error?: ErrorResponse;
}
