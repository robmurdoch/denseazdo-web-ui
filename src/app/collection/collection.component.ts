import { Component, OnInit } from '@angular/core';

import { Collection, SecurityNamespace, Identity, ProjectInfo } from '../core/shared/azdo-types';
import { AzDoService } from '../core/services/azdo.service';

@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.css']
})
export class CollectionComponent implements OnInit {
  securityNamespaces: Collection<SecurityNamespace>;
  projectValidUsersGroup: Collection<Identity>;
  projects: Collection<ProjectInfo>;

  constructor(
    private azdoService: AzDoService) {
    this.securityNamespaces = {};
    this.projects = {};
    this.projectValidUsersGroup = {};
  }

  ngOnInit(): void {
    this.azdoService.getSecurityNamespaces()
      .subscribe(results => {
        this.securityNamespaces = results;
      });
    this.azdoService.getProjects()
      .subscribe(results => {
        this.projects = results;
      })
  }
}
