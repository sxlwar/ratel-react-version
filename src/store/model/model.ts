import { NavState } from '../slices/nav.slice';
import { UserState } from '../slices/user.slice';

export interface StoreState {
    user: UserState;
    nav: NavState;
}
