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
  everyoneGroup: Collection<Identity> = {};
  everyone: Collection<Identity> = {};

  constructor(
    private azdoService: AzDoService
  ) {
    this.cacheData();
  }

  private async cacheData() {
    // this.securityNamespaces = await this.azdoService.getSecurityNamespaces().toPromise();
    // this.everyoneGroup = await this.azdoService.getProjectCollectionValidUsersGroup().toPromise();
    // if (this.everyoneGroup && this.everyoneGroup.value?.length && this.everyoneGroup.value[0].memberIds) {
    //   const memberIds = this.everyoneGroup?.value[0]?.memberIds
    //   this.everyone = await this.azdoService.getIdenties(memberIds).toPromise()
    // }
    // console.log("Data cached")
  }

  // getSecurityNamespaces(): Collection<SecurityNamespace> {
  //   console.log(this.securityNamespaces.count)
  //   return this.securityNamespaces;
  // }

  // getProjectCollectionValidUsersGroup(): Collection<Identity> {
  //   console.log(this.everyoneGroup.count)
  //   return this.everyoneGroup;
  // }

  // getIdenties(): Collection<Identity> {
  //   console.log(this.everyone.count)
  //   return this.everyone;
  // }
}
