import { Injectable } from '@angular/core';

import { ConnectionInfo } from './types'

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {
  connections: ConnectionInfo[]

  constructor() {
    let storedConnections: any = JSON.parse(<any>localStorage.getItem('connections'));
    if (storedConnections === null) {
      this.connections = new Array<ConnectionInfo>();
    }
    else {
      this.connections = storedConnections;
    }
  }

  private findConnection(connectionUrl: string): ConnectionInfo | null {
    var foundConnection: ConnectionInfo | null = null;
    this.connections.forEach(connection => {
      if(connection.url.toLocaleLowerCase() === connectionUrl.toLocaleLowerCase()){
        foundConnection = connection;
      }
    });
    return foundConnection;
  }

  add(connection: ConnectionInfo) {
    if (!this.findConnection(connection.url)){
      this.connections.push(connection);
      localStorage.setItem("connections", JSON.stringify(this.connections))
    }
  }

  delete(connection: ConnectionInfo) {
    if (this.findConnection(connection.url)){
      const index = this.connections.indexOf(connection);
      if (index > -1) {
        this.connections.splice(index, 1);
      }
      localStorage.setItem("connections", JSON.stringify(this.connections))
    }
  }
}
