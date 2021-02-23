import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { AzDoConnectionService } from './core/services/azure-devops-connection.service';
import { ConnectionInfo } from './shared/interfaces';
import { ConnectionDialogComponent } from './connection-dialog/connection-dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Dense Azure DevOps';
  description = 'Regulatory-driven Team Projects with drift detection';
  newConnectionPrompt = "New Connection";
  azDoConnectionService: AzDoConnectionService;

  constructor(
    azDoConnectionService: AzDoConnectionService,
    public dialog: MatDialog,
  ) {
    this.azDoConnectionService = azDoConnectionService;
  }

  connectionMenuOpened() {
    console.log("connectionMenuOpened");
  }

  connectionClicked(connection: ConnectionInfo | undefined) {
    if (connection === undefined) {
      this.openConnectionDialog({ url: "", token: "" });
    } else {
      this.azDoConnectionService.setConnection(connection);
    }
  }

  openConnectionDialog(connectionInfo: ConnectionInfo): void {
    const dialogRef = this.dialog.open(ConnectionDialogComponent, {
      width: '500px',
      data: connectionInfo
    });
  }
}
