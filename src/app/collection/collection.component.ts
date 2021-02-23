import { Component, OnInit } from '@angular/core';

import { Collection, SecurityNamespace, Identity } from '../shared/azdo-types';
import { AzDoService } from '../core/services/azdo.service';

@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.css']
})
export class CollectionComponent implements OnInit {
  securityNamespaces: Collection<SecurityNamespace>;
  projectValidUsersGroup: Collection<Identity>;

  constructor(
    private azdoService: AzDoService) {
    this.securityNamespaces = {};
    this.projectValidUsersGroup = {};
  }

  ngOnInit(): void {
    // this.azdoService.getSecurityNamespaces()
    //   .subscribe(result => {
    //     this.securityNamespaces = result;
    //   });
  }

  inspectProjectValidUsersGroup(): void {

    // Call this from a Check Wellknown everyone group membership button
    
    // Get the Project Valid Users Group (Wellknown Everyone Group)
    // Concatenate the member ids and get their Identities
    // Look for each of the OOTB and Idiomatic groups 
    //   removing those found (should be empty when done)
    //   when finding OOTB and indiomatic groups update a bit
    // If OOTB and/or Idiomatic groups are missing - display them
    // If Identies exist (not removed) - report them
    // this.azdoService.getProjectValidUsersGroup()
    //   .subscribe(result => {
    //     this.projectValidUsersGroup = result;
    //   });


    // this.projectValidUsersGroup.array.forEach(element => {

    // });
  }

}
