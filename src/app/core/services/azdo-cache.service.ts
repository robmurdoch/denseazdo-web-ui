import { Injectable } from '@angular/core';
import { Observable, from, of, EMPTY } from 'rxjs';
import { AzDoService } from './azdo.service';
import { Collection, SecurityNamespace, Identity, ProjectInfo } from '../shared/azdo-types';
import { shareReplay } from 'rxjs/operators';
import { CloseScrollStrategy } from '@angular/cdk/overlay';
import { element } from 'protractor';

@Injectable({
  providedIn: 'root'
})
export class AzDoCacheService {
  securityNamespaces: Collection<SecurityNamespace> = {};
  releaseManagementSecurityNamespaceId = 'c788c23e-1b46-4162-8f5e-d7585343b5de';
  identities: Identity[] = [];

  // everyoneGroup: Collection<Identity> = {};
  // everyone: Collection<Identity> = {};

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
    const returnNamespace = this.securityNamespaces.value?.find(
      securityNamespace => securityNamespace?.namespaceId === namespaceId
    );
    return returnNamespace!;
  }

  cacheIdentities(identityCollection: Collection<Identity>): void {
    this.identities = this.identities.concat(identityCollection.value!);
  }

  getIdentity(descriptor: string): Identity{
    const returnIdentity = this.identities.find(
      identity => identity?.descriptor === descriptor
      );
    return returnIdentity!;
  }

}
