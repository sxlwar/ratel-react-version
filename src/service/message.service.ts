import store from '../store';
import { ProjectSnackbarType, showSnackbar } from '../store/slices/tip.slice';
import { BaseService } from './base.service';

const showMessage = (variant: ProjectSnackbarType) => (message: string) => {
    const action = showSnackbar({ open: true, message, variant });

    store.dispatch(action);
};

export class MessageService extends BaseService {
    public showMessage = showMessage('info');
    public showSuccessMessage = showMessage('success');
    public showErrorMessage = showMessage('error');
    public showWarningMessage = showMessage('warning');
}
