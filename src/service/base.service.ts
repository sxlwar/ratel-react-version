import { SnackbarProps } from '@material-ui/core/Snackbar';

import { environment } from '../environments/environment';

export class BaseService {
    readonly snakeBarConfig: SnackbarProps = {
        anchorOrigin: { vertical: 'top', horizontal: 'center' },
        open: true,
        autoHideDuration: 3000
    };

    protected completeApiUrl(...paths: string[]): string {
        return environment.apiAddress + '/api/' + paths.join('/');
    }
}
