import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { ConnectionInfo } from './types'

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {
  readonly connections: ConnectionInfo[]
  private currentConnection: ConnectionInfo | null
  private connectionChangeEventSource = new Subject<string>();
  private connectionChanged$ = this.connectionChangeEventSource.asObservable();

  constructor() {
    let storedConnections: any = JSON.parse(<any>localStorage.getItem('connections'));
    if (storedConnections === null) {
      this.connections = new Array<ConnectionInfo>();
      this.currentConnection = null;
    }
    else {
      this.connections = storedConnections;
      this.currentConnection = this.connections[0] //TODO: set cookie for return visitors
      this.raiseConnectionChangedEvent(this.currentConnection.url)
    }
  }

  setConnection(newConnection: ConnectionInfo) {
    var connection: ConnectionInfo | null = this.findConnection(newConnection.url)
    if (connection) {
      this.currentConnection = newConnection;
      this.raiseConnectionChangedEvent(this.currentConnection.url)
    }
  }

  getConnection(): ConnectionInfo | null {
    return this.currentConnection;
  }

  raiseConnectionChangedEvent(name: string) {
    this.connectionChangeEventSource.next(name);
  }

  findConnection(connectionUrl: string): ConnectionInfo | null {
    var foundConnection: ConnectionInfo | null = null;
    this.connections.forEach(connection => {
      if (connection.url.toLocaleLowerCase() === connectionUrl.toLocaleLowerCase()) {
        foundConnection = connection;
      }
    });
    return foundConnection;
  }

  add(connection: ConnectionInfo) {
    if (!this.findConnection(connection.url)) {
      this.connections.push(connection);
      localStorage.setItem("connections", JSON.stringify(this.connections))
    }
  }

  delete(connection: ConnectionInfo) {
    if (this.findConnection(connection.url)) {
      const index = this.connections.indexOf(connection);
      if (index > -1) {
        this.connections.splice(index, 1);
      }
      localStorage.setItem("connections", JSON.stringify(this.connections))
    }
  }
}
