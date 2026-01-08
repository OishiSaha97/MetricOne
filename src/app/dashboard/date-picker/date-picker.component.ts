import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ControlValueAccessor} from "@angular/forms";

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.css']
})
export class DatePickerComponent implements ControlValueAccessor {
  @Input() disabled = false;
  @Input() minDate: Date | null = null;
  @Input() maxDate: Date | null = null;
  @Input() selectedDate: Date | null = null;
  @Input() placeholder: string = 'Select date';

  @Output() dateChange = new EventEmitter<string>();

  // selectedDate: Date | null = null;
  showCalendar: boolean = false;
  isDisabled: boolean = false;

  get initialDate(): Date {
    return this.selectedDate ? new Date(this.selectedDate) : new Date();
  }


  get displayText(): string {
    if (!this.selectedDate) return '';

    const date = new Date(this.selectedDate);

    // Format as DD-MMM-YYYY
    const day = date.getDate().toString().padStart(2, '0');
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  }



  toggleCalendar(event: MouseEvent): void {
    if (this.isDisabled) return;

    event.stopPropagation();
    this.showCalendar = !this.showCalendar;
  }

  onDateSelected(date: Date): void {
    this.selectedDate = date;
    // Convert to YYYY-MM-DD string
    const dateStr = date.toISOString().split('T')[0];
    console.log('Date selected from date-picker:', dateStr);
    this.onChange(date);
    this.onTouched();
    this.dateChange.emit(dateStr);
    this.showCalendar = false;
  }

  // ================= ControlValueAccessor =================
  private onChange: any = () => {};
  private onTouched: any = () => {};

  writeValue(value: any): void {
    if (value) {
      this.selectedDate = value instanceof Date ? value : new Date(value);
    } else {
      this.selectedDate = null;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }
}
