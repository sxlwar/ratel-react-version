// import Snackbar from '@material-ui/core/Snackbar';

import { environment } from '../environments/environment';

export class BaseService {

    // readonly snakeBarConfig: MatSnackBarConfig = {
    //     horizontalPosition: 'center',
    //     verticalPosition: 'top',
    //     duration: 3000,
    //     panelClass: 'global-snack',
    // };

    protected completeApiUrl(...paths: string[]): string {
        return environment.apiAddress + '/api/' + paths.join('/');
    }
}
