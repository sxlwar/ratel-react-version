type Fn = <T, U, R>(arg1: T, arg2: U) => R;

export interface PredicateFn<T, U> extends Fn {
    (arg1: T, arg2: U): boolean;
}

export const curryRight = <T, U>(fn: Fn) => (arg2: U) => (arg1: T) => fn(arg1, arg2);

export const curryLeft = <T, U>(fn: Fn) => (arg1: T) => (arg2: U) => fn(arg1, arg2);
