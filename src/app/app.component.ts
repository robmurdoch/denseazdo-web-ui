import { Component } from '@angular/core';

import { ConnectionDialogComponent } from './connection-dialog/connection-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ConnectionService } from './connection.service';
import { ConnectionInfo } from './types';
import { AzdoService } from './azdo.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Dense Azure DevOps';
  description = 'Regulatory-driven Team Projects';
  connections: ConnectionInfo[] | null;
  currentConnection: ConnectionInfo | null;
  url: string;
  token: string;

  constructor(
    private connectionService: ConnectionService,
    private azdoService: AzdoService,
    public dialog: MatDialog) {
    this.connections = connectionService.connections;
    this.currentConnection = null;
    this.url = "";
    this.token = "";
  }

  connectionChanged(event: any) {
    console.log(event.value)
    if (event.value.url?.substring(1, 4)?.toLowerCase() === "http") {
      this.connectionService.setConnection(event.value)
    }
  }

  openConnectionDialog(): void {
    const dialogRef = this.dialog.open(ConnectionDialogComponent, {
      width: '400px',
      data: { url: this.url, token: this.token }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        let newConnection: ConnectionInfo = new ConnectionInfo(result.url, result.token)
        this.azdoService.tryConnection(newConnection);
        if (this.connectionService.findConnection(newConnection.url)) {
          this.currentConnection = newConnection;
        }
      }
    });
  }
}
