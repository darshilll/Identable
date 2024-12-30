import { Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from '@angular/material/dialog';
@Component({
  selector: 'app-custom-filterdialog',
  templateUrl: './custom-filterdialog.component.html',
  styleUrls: ['./custom-filterdialog.component.scss'],
})
export class CustomFilterdialogComponent {
  customFilterForm: FormGroup;
  submitted: boolean = false;
  today: string;
  minToDate: string | undefined;

  constructor(
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<CustomFilterdialogComponent>
  ) {
    const currentDate = new Date();
    this.today = currentDate.toISOString().split('T')[0];
    this.customFilterForm = this.formBuilder.group({
      startDate: ['', Validators.required],
      endDate: [''],
    });

    const startDate = new Date(parseInt(this.data.startDate))
      .toISOString()
      .split('T')[0];
    const endDate = new Date(parseInt(this.data.endDate))
      .toISOString()
      .split('T')[0];

    this.customFilterForm.patchValue({
      startDate: startDate,
      endDate: endDate,
    });
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.customFilterForm.controls[controlName].hasError(errorName);
  };

  submit() {
    this.submitted = true;

    if (this.customFilterForm.invalid) {
      return;
    }
    let formValue = this.customFilterForm.value;
    let startDate = '';
    let endDate = '';
    if (formValue?.startDate) {
      const startDateInput = new Date(formValue.startDate);
      const startDateTimestamp = startDateInput.getTime();
      const offsetMilliseconds = startDateInput.getTimezoneOffset() * 60 * 1000;
      startDate = String(startDateTimestamp - offsetMilliseconds);
    }

    if (formValue?.endDate) {
      const endDateInput = new Date(formValue.endDate);
      const endDateTimestamp = endDateInput.setHours(23, 59, 59, 999);
      const offsetMilliseconds = endDateInput.getTimezoneOffset() * 60 * 1000;
      endDate = String(endDateTimestamp - offsetMilliseconds);
    }

    this.dialogRef.close({ startDate: startDate, endDate: endDate });
  }

  close() {
    this.dialogRef.close();
  }

  updateMinToDate(): void {
    let formValue = this.customFilterForm.value;

    if (formValue.startDate) {
      const start = new Date(formValue.startDate);
      this.minToDate = new Date(start.setDate(start.getDate() + 1))
        .toISOString()
        .split('T')[0];
    } else {
      this.minToDate = this.today;
    }
    this.customFilterForm.patchValue({ endDate: this.today });
  }
}
