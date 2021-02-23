import { Component, OnInit, Optional, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { catchError } from 'rxjs/operators';

import { ConnectionInfo } from '../shared/interfaces';
import { AzDoConnectionService } from '../core/services/azure-devops-connection.service';
import { AzDoService } from '../core/services/azdo.service';
import { SnackbarService } from '../core/services/snackbar.service'

/**
 * Interface that models data passed to and back from the Connection Dialog
 */
export interface DialogData {
  url: string;
  token: string;
}

@Component({
  selector: 'app-connection-dialog',
  templateUrl: './connection-dialog.component.html',
  styleUrls: ['./connection-dialog.component.css']
})
export class ConnectionDialogComponent {

  //FormBuilder'up a FormGroup for validating user input
  connectionForm = this.fb.group({
    inputUrl: [this.data.url, [
      Validators.required,
      Validators.pattern("^(http:\/\/|https:\/\/).*")
    ]],
    inputToken: [this.data.token, [
      Validators.required,
      Validators.minLength(40)
    ]]
  });

  //Eye candy while user waits to validate a connection
  showSpinner: Boolean = false;

  constructor(
    private azDoConnectionService: AzDoConnectionService,
    private azDoService: AzDoService,
    private snackbar: SnackbarService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ConnectionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData | any
  ) {
    this.azDoConnectionService = azDoConnectionService;
    this.azDoService = azDoService;
  }

  //Some convience methods used in the view to referece the model
  get inputUrl() { return this.connectionForm.get('inputUrl') }
  get inputToken() { return this.connectionForm.get('inputToken') }
  getUrlErrorMessages(): string | undefined {
    return this.inputUrl?.hasError('required') ? "Url is required" :
      this.inputUrl?.hasError('pattern') ? "Invalid url: http://host/collection or https://org.visualstudio.com" : "";
  }
  getTokenErrorMessages(): string | undefined {
    return this.inputToken?.hasError('required') ? "Token is required" :
      this.inputToken?.hasError('minlength') ? "Value must be at least 40 characters" : "";
  }

  //Supports canceling the dialog without changing any state
  onCancelClick(): void {
    this.dialogRef.close();
  }

  /**
   * Tries an Azure DevOps (Server and Services) connection to determine the version of the 
   * API supported by the endpoint. Attempts to trap some common errors to better inform the 
   * user (but this is largely untested).
   * 
   * If the version is successfully determined, the new connection becomes the current 
   * connection that the system uses for all AzDO requests.
   * 
   * Experiements: 
   * Modeling an attempted connection: e.g. AttemptedConnection interface that holds the 
   *      API Version and error messages. I had to add a count for the happy path when
   *      projects are returned. TypeScript (Angular) realized the type which clashed with the
   *      normal result exposed for Subscribe. Need to attempt subclassing that adding my
   *      payload.
   * Moving this code to AzDoService: Unsuccessfull for a couple reasons:
   *      1: I wanted to show a spinner for long running requests
   *      2: I wanted to validate the form input before attempting the request
   *      3: I wanted the request to complete before hiding the spinner, showing errors,
   *          and closing the dialog.
   * 
   * TODO: 
   *      1. Change for each new version of the REST API.
   *      2. Implement Preview API support
   *      3. Extrac the collection (Server) or organization (Services)
   */
  onOkClick(): void {
    if (this.connectionForm.valid) {
      var newConnection: ConnectionInfo = {
        url: this.inputUrl?.value,
        token: this.inputToken?.value
      }
      this.showSpinner = true;
      this.azDoService.tryConnection(newConnection)
        .pipe(
          catchError(error => {
            return this.azDoConnectionService.getApiVersionFromError(error);
          })
        )
        .subscribe(result => {
          if (this.azDoConnectionService.apiVersionFound(result, newConnection)) {
            this.azDoConnectionService.addConnection(newConnection);
            this.azDoConnectionService.setConnection(newConnection);
            this.showSpinner = false;
            this.dialogRef.close();
          } else {
            this.showSpinner = false;
            this.snackbar.error(`(${result.status}) ${result.statusText}`)
          }
        });
    }
  }
}
