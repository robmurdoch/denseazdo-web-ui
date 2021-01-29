import { Component, OnInit } from '@angular/core';

import { Collection, CollectionInfo, SecurityNamespace } from '../azdo-types';
import { AzdoService } from '../azdo.service';

@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.css']
})
export class CollectionComponent implements OnInit {
  securityNamespaces: Collection<SecurityNamespace>;

  constructor(
    private azdoService: AzdoService) {
    this.securityNamespaces = {};
  }

  ngOnInit(): void {
    this.azdoService.getSecurityNamespaces()
      .subscribe(result => {
        this.securityNamespaces = result;
      });
  }
}
