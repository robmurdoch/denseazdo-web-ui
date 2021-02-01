import { Component, OnInit } from '@angular/core';

import { Collection, CollectionInfo, SecurityNamespace, Identity } from '../azdo-types';
import { AzdoService } from '../azdo.service';

@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.css']
})
export class CollectionComponent implements OnInit {
  securityNamespaces: Collection<SecurityNamespace>;
  projectValidUsersGroup: Collection<Identity>;

  constructor(
    private azdoService: AzdoService) {
    this.securityNamespaces = {};
    this.projectValidUsersGroup = {};
  }

  ngOnInit(): void {
    this.azdoService.getSecurityNamespaces()
      .subscribe(result => {
        this.securityNamespaces = result;
      });

    this.azdoService.getProjectValidUsersGroup()
      .subscribe(result => {
        this.projectValidUsersGroup = result;
      });
  }

  // inspectProjectValidUsersGroup(): void {
  //   this.projectValidUsersGroup.array.forEach(element => {
      
  //   });
  // }

}
