import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, of, EMPTY, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { ApiVersion, Collection, ProjectInfo, SecurityNamespace, Identity } from '../../shared/azdo-types';
import { ConnectionInfo } from '../../shared/interfaces';
import { AzDoConnectionService } from './azure-devops-connection.service';

@Injectable({
  providedIn: 'root'
})
export class AzDoService {
  httpOptions = {
    headers: new HttpHeaders({})
  };

  constructor(
    private azDoConnectionService: AzDoConnectionService,
    private http: HttpClient
  ) {
  }

  tryConnection(connectionInfo: ConnectionInfo): Observable<Collection<ProjectInfo>> {
    if (connectionInfo) {
      let url = `${connectionInfo.url}/_apis/projects?api-version=${this.azDoConnectionService.mostRecentApiVersion}`
      return this.http.get<Collection<ProjectInfo>>(url, this.getHttpHeaders(connectionInfo));
    }
    else {
      return EMPTY;
    }
  }

  /** GET Security Namespaces from the server */
  // getSecurityNamespaces(): Observable<Collection<SecurityNamespace>> {
  //   var connection = this.connectionService.getConnection();
  //   if (connection) {
  //     let url = `${connection.url}/_apis/securitynamespaces?${connection.apiVersion}`
  //     console.log(url);
  //     return this.http.get<Collection<SecurityNamespace>>(url, this.getHttpHeaders(connection))
  //       .pipe(
  //         tap(_ => this.log('fetching security namespaces')),
  //         catchError(this.handleError<Collection<SecurityNamespace>>('getSecurityNamespaces', {}))
  //       );
  //   }
  //   else {
  //     return EMPTY;
  //   }
  // }

  // TODO: get the EveryoneApplicationGroup instead
  // getProjectValidUsersGroup():Observable<Collection<Identity>>{
  //   var connection = this.connectionService.getConnection();
  //   if (connection) {
  //     let url = `${connection.url}/_apis/identities?searchFilter=DisplayName&filterValue=Project%20Collection%20Valid%20Users&queryMembership=expandedDown&${connection.apiVersion}`
  //     console.log(url);
  //     return this.http.get<Collection<Identity>>(url, this.getHttpHeaders(connection))
  //       .pipe(
  //         tap(_ => this.log('fetching identities')),
  //         catchError(this.handleError<Collection<Identity>>('getProjectValidUsersGroup', {}))
  //       );
  //   }
  //   else {
  //     return EMPTY;
  //   }
  // }

  /** GET Projects from the server */
  getProjects(): Observable<Collection<ProjectInfo>> {
    var connection = this.azDoConnectionService.currentConnection;
    if (connection) {
      let url = `${connection.url}/_apis/projects?api-version=${connection.apiVersion})`
      return this.http.get<Collection<ProjectInfo>>(url, this.getHttpHeaders(connection))
        .pipe(
          tap(_ => this.log('fetched projects')),
          catchError(this.handleError<Collection<ProjectInfo>>('getProjects', {}))
        );
    }
    else {
      return EMPTY;
    }
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log the full error to console for now

      // TODO: send human readable problems to the ui (a snack bar)
      // this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  log(message: string) {
    // TODO: emit in UI somewhere
    console.log(message);
  }

  private getHttpHeaders(connectionInfo: ConnectionInfo) {
    return {
      headers: new HttpHeaders({
        observe: 'response',
        Authorization: 'Basic ' + btoa("" + ":" + connectionInfo.token + "")
      })
    };
  }
}