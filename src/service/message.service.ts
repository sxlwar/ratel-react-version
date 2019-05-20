import store from '../store';
import { ProjectSnackbarType, showSnackbar, showAlert } from '../store/slices/tip.slice';
import { BaseService } from './base.service';
import { PayloadAction } from 'redux-starter-kit';

export class MessageService extends BaseService {
    private snackbar = (variant: ProjectSnackbarType) => (message: string) => {
        const action = showSnackbar({ open: true, message, variant, timestamp: Date.now() });

        store.dispatch(action);
    };

    public alert = (message: string, confirmAction: PayloadAction<any>) => {
        const action = showAlert({ open: true, message, confirmAction });

        store.dispatch(action);
    };

    public showMessage = this.snackbar('info');
    public showSuccessMessage = this.snackbar('success');
    public showErrorMessage = this.snackbar('error');
    public showWarningMessage = this.snackbar('warning');
}
