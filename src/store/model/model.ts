import { NavState } from '../slices/nav.slice';
import { UserState } from '../slices/user.slice';
import { TipState } from '../slices/tip.slice';

export interface StoreState {
    user: UserState;
    nav: NavState;
    tip: TipState;
}
