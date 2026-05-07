import { catchError, of } from 'rxjs';
import { AccountService } from '@app/_services';

export function appInitializer(accountService: AccountService) {
    return () => accountService.refreshToken()
        .pipe(
            // Catch error to allow the app to start regardless of whether 
            catchError(() => of())
        );
}
