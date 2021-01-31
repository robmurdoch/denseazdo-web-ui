import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, EMPTY } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { ApiVersion, Collection, ProjectInfo, SecurityNamespace } from './azdo-types';
import { ConnectionInfo } from './types';
import { ConnectionService } from './connection.service';

@Injectable({
  providedIn: 'root'
})
export class AzdoService {
  httpOptions = {
    headers: new HttpHeaders({})
  };
  apiVersions: ApiVersion[] = [
    { "name": "2018", "version": "api-version=4.0" },
    { "name": "2019", "version": "api-version=5.0" },
    { "name": "2020", "version": "api-version=6.0" },
    { "name": "Services", "version": "api-version=6.0" },
  ];
  // '3zmfq5v5d3fmaweh4vqd4zyk4wpzv2exspcu25gq7m3aub3p6eqa'

  constructor(
    private connectionService: ConnectionService,
    private http: HttpClient) {
  }

  tryConnection(connectionInfo: ConnectionInfo) {
    this.apiVersions.forEach(apiVersion => {
      let url = `${connectionInfo.url}/_apis/projects?${apiVersion.version}`;
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          observe: 'response',
          Authorization: 'Basic ' + btoa("" + ":" + connectionInfo.token)
        })
      };
      this.http.get<Collection<ProjectInfo>>(url, httpOptions)
        .pipe(
          catchError(this.handleError('tryConnection', false))
        ).subscribe({
          complete: () => {
            connectionInfo.apiVersion = apiVersion.version;
            this.connectionService.add(connectionInfo);
          }
        });
    });
  }

  /** GET Security Namespaces from the server */
  getSecurityNamespaces(): Observable<Collection<SecurityNamespace>> {
    var connection = this.connectionService.getConnection();
    if (connection) {
      let url = `${connection.url}/_apis/securitynamespaces?${connection.apiVersion}`
      console.log(url);
      return this.http.get<Collection<SecurityNamespace>>(url, this.getHttpHeaders(connection))
        .pipe(
          tap(_ => this.log('fetching security namespaces')),
          catchError(this.handleError<Collection<SecurityNamespace>>('getSecurityNamespaces', {}))
        );
    }
    else {
      return EMPTY;
    }
  }

  /** GET Projects from the server */
  getProjects(): Observable<Collection<ProjectInfo>> {
    var connection = this.connectionService.getConnection();
    if (connection) {
      let url = `${connection.url}/_apis/projects?api-version=6.0`
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
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

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