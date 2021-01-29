import { Component, OnInit, Optional, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


export interface DialogData {
  url: string;
  token: string;
}

@Component({
  selector: 'app-connection-dialog',
  templateUrl: './connection-dialog.component.html',
  styleUrls: ['./connection-dialog.component.css']
})
export class ConnectionDialogComponent implements OnInit {
  
  constructor(
    public dialogRef: MatDialogRef<ConnectionDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: DialogData
    ) {

  }

  ngOnInit(): void {
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }
}
