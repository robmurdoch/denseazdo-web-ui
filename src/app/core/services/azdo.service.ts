import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, of, EMPTY, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { Collection, ProjectInfo, SecurityNamespace, Identity } from '../shared/azdo-types';
import { ConnectionInfo } from '../shared/interfaces';
import { AzDoConnectionService } from './azdo-connection.service';

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

  /** 
   * GET Security Namespaces 
   * From the docs: https://docs.microsoft.com/en-us/azure/devops/organizations/security/namespace-reference
   * Security namespaces are used to store access control lists (ACLs) on tokens. Data stored in security namespaces determines
   *  the level of access the entities have to perform a specific action on specific resources.
  */
  getSecurityNamespaces(): Observable<Collection<SecurityNamespace>> {
    var connection = this.azDoConnectionService.currentConnection;
    console.log(connection)
    if (connection) {
      let url = `${connection.url}/_apis/securitynamespaces?api-version=${connection.apiVersion}`
      return this.http.get<Collection<SecurityNamespace>>(url, this.getHttpHeaders(connection))
        .pipe(
          catchError(this.handleError<Collection<SecurityNamespace>>('getSecurityNamespaces', {}))
        );
    }
    else {
      return EMPTY;
    }
  }

  getProjectValidUsersGroup(projectName: string): Observable<Collection<Identity>> {
    var connection = this.azDoConnectionService.currentConnection;
    let url = `${connection.url}/_apis/identities?searchFilter=General&filterValue=[${projectName}]\\Project%20Valid%20Users&queryMembership=direct&api-version=${connection.apiVersion}`
    return this.http.get<Collection<Identity>>(url, this.getHttpHeaders(connection))
      .pipe(
        catchError(this.handleError<Collection<Identity>>('getProjectValidUsersGroup', {}))
      );
  }

  // TODO: get the Special EveryoneApplicationGroup instead
  getProjectCollectionValidUsersGroup(): Observable<Collection<Identity>> {
    var connection = this.azDoConnectionService.currentConnection;
    let url = `${connection.url}/_apis/identities?searchFilter=General&filterValue=Project%20Collection%20Valid%20Users&queryMembership=direct&api-version=${connection.apiVersion}`
    return this.http.get<Collection<Identity>>(url, this.getHttpHeaders(connection))
      .pipe(
        catchError(this.handleError<Collection<Identity>>('getProjectCollectionValidUsersGroup', {}))
      );
  }

  // Get the everyonegroup's membership identities
  getIdentities(memberIds: string[]): Observable<Collection<Identity>> {
    var connection = this.azDoConnectionService.currentConnection;
    // let url = `${connection.url}/_apis/identities?descriptors=${descriptors.join()}&queryMembership=direct&api-version=${connection.apiVersion}`
    let url = `${connection.url}/_apis/identities?identityIds=${memberIds.join()}&queryMembership=direct&api-version=${connection.apiVersion}`
    return this.http.get<Collection<Identity>>(url, this.getHttpHeaders(connection))
      .pipe(
        catchError(this.handleError<Collection<Identity>>('getIdentities', {}))
      );
  }

  /** GET Projects from the server */
  getProjects(): Observable<Collection<ProjectInfo>> {
    var connection = this.azDoConnectionService.currentConnection;
    if (connection) {
      let url = `${connection.url}/_apis/projects?api-version=${connection.apiVersion}`
      return this.http.get<Collection<ProjectInfo>>(url, this.getHttpHeaders(connection))
        .pipe(
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