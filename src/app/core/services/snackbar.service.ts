import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TextOnlySnackBar } from '@angular/material/snack-bar/simple-snack-bar';
import { MatSnackBarRef } from '@angular/material/snack-bar/snack-bar-ref';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(
    private snackbar: MatSnackBar) {
  }

  error(message: string): MatSnackBarRef<TextOnlySnackBar> {
    return this.snackbar.open(message, 'Dismiss');
  }

  success(message: string): MatSnackBarRef<TextOnlySnackBar> {
    return this.snackbar.open(message);
  }

  info(message: string): MatSnackBarRef<TextOnlySnackBar> {
    return this.snackbar.open(message, undefined, { duration: 2000 });
  }
}
