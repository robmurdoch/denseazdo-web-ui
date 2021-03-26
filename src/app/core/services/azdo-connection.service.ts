import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ConnectionInfo } from '../shared/interfaces'

@Injectable({
  providedIn: 'root'
})
export class AzDoConnectionService {
  connections: ConnectionInfo[]
  currentConnection: ConnectionInfo
  mostRecentApiVersion: string = "6.0";

  constructor(
  ) {    
    this.currentConnection = { url: "Connections" };
    const storedConnections: ConnectionInfo[] = JSON.parse(<string>localStorage.getItem('connections'))
    if (storedConnections === null) {
      this.connections = new Array<ConnectionInfo>();
    }
    else {
      this.connections = storedConnections;
      this.connections.forEach(connection => {
        // console.log(connection);
        if (connection.selected) {
          // console.log("found initial connection");
          this.currentConnection = connection;
        }
      });
    }
  }

  getCollectionName(connection:string):string{
    return connection.substring(connection.lastIndexOf("/") + 1);
    //handle case where url is Azure DevOps Services vs. On-Premise Server 
  }

  /**
   * Provides a safe way set the current connection to one that exists in the collection
   * Need to figure out how to expose a read only variable that can be updated by a method
   * @param newConnection 
   */
  setConnection(newConnection: ConnectionInfo) {
    var foundConnection: ConnectionInfo | null = this.findConnection(newConnection.url)
    if (foundConnection) {
      this.connections.forEach(connection => {
        if (connection.url.toLocaleLowerCase() === newConnection.url.toLocaleLowerCase()) {
          // console.log(`${connection.url} now the current connection`);
          connection.selected = true;
          this.currentConnection = connection;
        } else {
          // console.log(`${connection.url} no longer the current connection`);
          connection.selected = false;
        }
      });
      // console.log(this.connections);
      localStorage.setItem("connections", JSON.stringify(this.connections))
    }
  }

  private findConnection(connectionUrl: string): ConnectionInfo | null {
    var foundConnection: ConnectionInfo | null = null;
    if (this.connections.length > 0) {
      this.connections.forEach(connection => {
        if (connection.url.toLocaleLowerCase() === connectionUrl.toLocaleLowerCase()) {
          foundConnection = connection;
        }
      });
    }
    return foundConnection;
  }

  addConnection(connection: ConnectionInfo) {
    if (!this.findConnection(connection.url)) {
      this.connections.push(connection);
      localStorage.setItem("connections", JSON.stringify(this.connections))
    }
  }

  deleteConnection(connection: ConnectionInfo) {
    if (this.findConnection(connection.url)) {
      const index = this.connections.indexOf(connection);
      if (index > -1) {
        this.connections.splice(index, 1);
      }
      localStorage.setItem("connections", JSON.stringify(this.connections))
    }
  }

  /**
   * Returns true if able to detect the version, otherwise false
   * @param result The results from REST API call or from a call to getApiVersionFromError
   * @param connectionAttempted The connection whose ApiVerion is updated
   */
  apiVersionFound(result: any, connectionAttempted: ConnectionInfo): boolean {

    if (result.count) {
      //The happy path, an array of projects returned using the highest supported Api-Version known.
      connectionAttempted.apiVersion = this.mostRecentApiVersion;
      return true;
    } else if (result === "6.0" || result === "5.0" || result === "4.0") {
      //This is a downlevel API, supported api version extracted from the error message
      connectionAttempted.apiVersion = result;
      return true;
    }
    return false;
  }

  /**
   * Parses the supported API-Version from the error passed. 
   * If a version this application doesn't support is detected provides custom error message.
   * If none of the above the error provided is returned  
   * @param error An HTTPResponseError from an attempted Azure DevOps REST API call
   */
  getApiVersionFromError(error: any): Observable<any> {
    if (error.message.includes("The latest REST API version this server supports is 6.0")) {
      return of("6.0")
    } else if (error.message.includes("The latest REST API version this server supports is 5.0")) {
      return of("5.0")
    } else if (error.message.includes("The latest REST API version this server supports is 4.0")) {
      return of("4.0")
    } else if (error.message.includes("The latest REST API version this server supports is")) {
      return of({ message: "Endpoint needs to support REST API version 4 or higher" })
    } else if (error.message.includes("Invalid api version string")) {
      return of({ message: "Opps, Microsoft changed the version and we haven't updated" })
    } else {
      return of(error)
    }
  }
}

// [{url: "http://robssurfacepro/defaultcollection",…}, {url: "https://robmurdoch.visualstudio.com",…}]
// 0: {url: "http://robssurfacepro/defaultcollection",…}
// apiVersion: "api-version=5.0"
// token: "3zmfq5v5d3fmaweh4vqd4zyk4wpzv2exspcu25gq7m3aub3p6eqa"
// url: "http://robssurfacepro/defaultcollection"
// 1: {url: "https://robmurdoch.visualstudio.com",…}
// token: "kbpdp3izjbr5i56j6ixuysnabcji7od2yx2lvui6m7ih2k64ednq"
// url: "https://robmurdoch.visualstudio.com"