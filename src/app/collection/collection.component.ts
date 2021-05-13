import { Component, OnInit } from '@angular/core';

import { Collection, SecurityNamespace, Identity, ProjectInfo } from '../core/shared/azdo-types';
import { AzDoService } from '../core/services/azdo.service';
import { AzDoCacheService } from '../core/services/azdo-cache.service';

@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.css']
})
export class CollectionComponent implements OnInit {
  projectValidUsersGroup: Collection<Identity>;
  projects: Collection<ProjectInfo>;

  constructor(
    private azdoService: AzDoService,
    private AzDoCacheService: AzDoCacheService) {
    this.projects = {};
    this.projectValidUsersGroup = {};
  }

  ngOnInit(): void {
    this.azdoService.getProjects()
      .subscribe(results => {
        this.projects = results;
      })
  }
}
