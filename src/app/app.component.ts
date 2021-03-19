import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { AzDoConnectionService } from './core/services/azdo-connection.service';
import { AzDoService } from './core/services/azdo.service';
import { ConnectionInfo } from './core/shared/interfaces';
import { ConnectionDialogComponent } from './connection-dialog/connection-dialog.component';
import { Collection, SecurityNamespace, Identity, ProjectInfo } from './core/shared/azdo-types';
import { AzDoCacheService } from './core/services/azdo-cache.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Dense Azure DevOps';
  description = 'Regulatory-driven Team Projects with drift detection';
  showSpinner: boolean = false;
  newConnectionPrompt = "New Connection";
  projects: Collection<ProjectInfo>;

  constructor(
    public azDoConnectionService: AzDoConnectionService,
    private azdoService: AzDoService,
    private azdoCacheService: AzDoCacheService,
    public dialog: MatDialog,
  ) {
    this.azDoConnectionService = azDoConnectionService;
    this.projects = {};
  }

  ngOnInit(): void {
    this.showSpinner = true;
    if (this.azDoConnectionService.currentConnection) {
      this.azdoService.getProjects()
        .subscribe(results => {
          this.projects = results;
          this.showSpinner = false;
        })
    }
  }

  connectionMenuOpened() {
    console.log("Might want to mask out the main content area when this happens");
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
