import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar'

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(
    private _snackBar: MatSnackBar) {
  }

  error(message: string) {
    return this._snackBar.open(message, "Dismiss");
  }

  success(message: string) {
    return this._snackBar.open(message);
  }

  info(message: string) {
    return this._snackBar.open(message, undefined, { duration: 2000 });
  }
}
