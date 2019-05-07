import { NavState } from '../slices/nav';
import { UserState } from '../slices/user';

export interface StoreState {
    user: UserState;
    nav: NavState;
}
