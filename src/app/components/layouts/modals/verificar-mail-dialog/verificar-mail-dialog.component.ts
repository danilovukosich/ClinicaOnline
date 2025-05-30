import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-verificar-mail-dialog',
    imports: [MatDialogModule,
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatButtonModule,
        RouterLink],
    templateUrl: './verificar-mail-dialog.component.html',
    styleUrl: './verificar-mail-dialog.component.css'
})
export class VerificarMailDialogComponent {


  readonly dialogRef = inject(MatDialogRef<VerificarMailDialogComponent>);

  OkClick(): void {
    this.dialogRef.close();
  }
}
