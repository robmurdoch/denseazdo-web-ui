import { Injectable } from '@angular/core';
import { Observable, from, of, EMPTY } from 'rxjs';
import { AzDoService } from './azdo.service';
import { Collection, SecurityNamespace, Identity, ProjectInfo } from '../shared/azdo-types';
import { shareReplay } from 'rxjs/operators';
import { CloseScrollStrategy } from '@angular/cdk/overlay';

@Injectable({
  providedIn: 'root'
})
export class AzDoCacheService {
  securityNamespaces: Collection<SecurityNamespace> = {};
  releaseManagementSecurityNamespaceId: string = "c788c23e-1b46-4162-8f5e-d7585343b5de";

  everyoneGroup: Collection<Identity> = {};
  everyone: Collection<Identity> = {};

  constructor(
    private azdoService: AzDoService
  ) {
    this.azdoService.getSecurityNamespaces()
      .subscribe(results => {
        this.securityNamespaces = results;
      });
    // this.cacheData();
  }

  getSecurityNamespace(namespaceId: string): SecurityNamespace {
    const securityNamespace = this.securityNamespaces.value?.find(
      securityNamespace => securityNamespace?.namespaceId === namespaceId
    )
    return securityNamespace!;
  }
}
