import { ErrorHandler } from '@angular/core';
import * as Raven from 'raven-js';

export class RavenErrorHandler implements ErrorHandler {
    handleError(err: any): void {
        Raven.captureException(err);
    }
}