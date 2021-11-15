import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import { Finding } from '../core/shared/interfaces';

export interface DialogData {
  findings: Finding[];
}

@Component({
  selector: 'app-finding-dialog',
  templateUrl: './finding-dialog.component.html',
  styleUrls: ['./finding-dialog.component.css']
})
export class FindingDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<FindingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData | any
  ) { }

  ngOnInit(): void {
    console.log(this.data);
    // Might have to do something here
  }

  onOkClick(): void {
    this.dialogRef.close();
  }

}
