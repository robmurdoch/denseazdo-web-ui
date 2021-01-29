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
  description = 'Regulatory-driven Team Project organization';
  connections: ConnectionInfo[] | null;
  currentConnection: ConnectionInfo | null;
  url: string;
  token: string;

  constructor(
    private connectionService: ConnectionService,
    private azdoService: AzdoService,
    public dialog: MatDialog) {
    this.connections = connectionService.connections;
    if (this.connections.length > 0) {
      this.currentConnection = this.connections[0];
    }
    else {
      this.currentConnection = null;
    }
    this.url = "";
    this.token = "";
  }

  openConnectionDialog(): void {
    const dialogRef = this.dialog.open(ConnectionDialogComponent, {
      width: '400px',
      data: { url: this.url, token: this.token }
    });

    dialogRef.afterClosed().subscribe(result => {
      let newConnection: ConnectionInfo = new ConnectionInfo(result.url, result.token)
      this.azdoService.tryConnection(
        newConnection, this.connectionService);
    });
  }
}
