import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, of, EMPTY, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { Collection, ProjectInfo, SecurityNamespace, Identity, Folder } from '../shared/azdo-types';
import { ConnectionInfo } from '../shared/interfaces';
import { AzDoConnectionService } from './azdo-connection.service';
import { ObserversModule } from '@angular/cdk/observers';

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

  tryConnection(connectionInfo: ConnectionInfo): any {
    if (connectionInfo) {
      const url = `${connectionInfo.url}/_apis/projects?api-version=${this.azDoConnectionService.mostRecentApiVersion}`;
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
    const connection = this.azDoConnectionService.currentConnection;
    if (connection) {
      const url = `${connection.url}/_apis/securitynamespaces?api-version=${connection.apiVersion}`;
      console.log(url);
      return this.http.get<Collection<SecurityNamespace>>(url, this.getHttpHeaders(connection))
        .pipe(
          catchError(this.handleError<Collection<SecurityNamespace>>('getSecurityNamespaces', {}))
        );
    }
    else {
      return EMPTY;
    }
  }

  /**
   * Get the folder heirarchy
   * https://docs.microsoft.com/en-us/rest/api/azure/devops/release/folders/list?view=azure-devops-rest-6.0
   * GET https://vsrm.dev.azure.com/{organization}/{project}/_apis/release/folders/{path}?api-version=6.0-preview.2
   */
  getReleaseFolders(projectName: string): Observable<Collection<Folder>> {
    const connection = this.azDoConnectionService.currentConnection;
    if (connection) {
      const url = `${connection.url}/${projectName}/_apis/release/folders?api-version=${connection.apiVersion}-preview.1`;
      console.log(url);
      return this.http.get<Collection<Folder>>(url, this.getHttpHeaders(connection))
        .pipe(
          catchError(this.handleError<Collection<Folder>>('getReleaseFolders', {}))
        );
    }
    else {
      return EMPTY;
    }
  }

  // Security
  // Need the security namespace guid
  // Retrieve the Security Namespace
  // Extract the PermssionBits namespaceResponse.value.actions
  // If reporting a heirarchy of permissions c788c23e-1b46-4162-8f5e-d7585343b5de
  // * Retrieve the root node and report the root node
  // * Walk the child nodes recursiivly to the desired level and report each node
  // * Reporting a node
  // * * Get the Identity (from already retrieved data)
  // * * Get the acl for the token and parse the acesDictionary
  // * * Iterate the items in the acesDictionary
  // * * Iterate the permission bits NotSet is the default

  /**
   * GET Access Control Lists
   * From the docs: https://docs.microsoft.com/en-us/azure/devops/organizations/security/namespace-reference
   * Security namespaces are used to store access control lists (ACLs) on tokens. Data stored in security namespaces determines
   *  the level of access the entities have to perform a specific action on specific resources.
   */
  getAccessControlLists(namespace: string, token: string): Observable<Collection<any>> {
    const connection = this.azDoConnectionService.currentConnection;
    if (connection) {
      const url = `${connection.url}/_apis/accesscontrollists/${namespace}?token=${token}&includeextendedinfo=true&recurse=true&api-version=${connection.apiVersion}`;
      console.log(url);
      return this.http.get<Collection<any>>(url, this.getHttpHeaders(connection))
        .pipe(
          catchError(this.handleError<Collection<any>>('getAccessControlLists', {}))
        );
    }
    else {
      return EMPTY;
    }
  }


  getProjectValidUsersGroup(projectName: string): Observable<Collection<Identity>> {
    const connection = this.azDoConnectionService.currentConnection;
    const url = `${connection.url}/_apis/identities?searchFilter=General&filterValue=[${projectName}]\\Project%20Valid%20Users&queryMembership=direct&api-version=${connection.apiVersion}`;
    console.log(url);
    return this.http.get<Collection<Identity>>(url, this.getHttpHeaders(connection))
      .pipe(
        catchError(this.handleError<Collection<Identity>>('getProjectValidUsersGroup', {}))
      );
  }

  // TODO: get the Special EveryoneApplicationGroup instead
  getProjectCollectionValidUsersGroup(): Observable<Collection<Identity>> {
    const connection = this.azDoConnectionService.currentConnection;
    const url = `${connection.url}/_apis/identities?searchFilter=General&filterValue=Project%20Collection%20Valid%20Users&queryMembership=direct&api-version=${connection.apiVersion}`;
    console.log(url);
    return this.http.get<Collection<Identity>>(url, this.getHttpHeaders(connection))
      .pipe(
        catchError(this.handleError<Collection<Identity>>('getProjectCollectionValidUsersGroup', {}))
      );
  }

  // Get the everyonegroup's membership identities
  getIdentities(memberIds: string[]): Observable<Collection<Identity>> {
    const connection = this.azDoConnectionService.currentConnection;
    // const url = `${connection.url}/_apis/identities?descriptors=${descriptors.join()}&queryMembership=direct&api-version=${connection.apiVersion}`
    const url = `${connection.url}/_apis/identities?identityIds=${memberIds.join()}&queryMembership=direct&api-version=${connection.apiVersion}`;
    console.log(url);
    return this.http.get<Collection<Identity>>(url, this.getHttpHeaders(connection))
      .pipe(
        catchError(this.handleError<Collection<Identity>>('getIdentities', {}))
      );
  }

  /** GET Projects from the server */
  getProjects(): Observable<Collection<ProjectInfo>> {
    const connection = this.azDoConnectionService.currentConnection;
    if (connection) {
      const url = `${connection.url}/_apis/projects?api-version=${connection.apiVersion}`;
      console.log(url);
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
  private handleError<T>(operation = 'operation', result?: T): any {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log the full error to console for now

      // TODO: send human readable problems to the ui (a snack bar)
      // this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  log(message: string): void {
    // TODO: emit in UI somewhere
    console.log(message);
  }

  private getHttpHeaders(connectionInfo: ConnectionInfo): any {
    return {
      headers: new HttpHeaders({
        observe: 'response',
        Authorization: 'Basic ' + btoa('' + ':' + connectionInfo.token + '')
      })
    };
  }
}
