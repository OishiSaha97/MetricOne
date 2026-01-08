import {Component, EventEmitter, HostListener, Input, Output} from '@angular/core';
import {DropdownOption} from "../dropdown-option/dropdown-option.component";

interface CalendarDay {
  day: number;
  month: number;
  year: number;
  type: 'prev' | 'current' | 'next';
}


@Component({
  selector: 'app-calendar-picker',
  templateUrl: './calendar-picker.component.html',
  styleUrls: ['./calendar-picker.component.css']
})
export class CalendarPickerComponent {

  @Input() initialDate: Date | null = null;
  @Input() minDate: Date | null = null;
  @Input() maxDate: Date | null = null;

  @Output() dateSelected = new EventEmitter<Date>();
  @Output() close = new EventEmitter<void>();

  currentDate!: Date;
  selectedDate: Date | null = null;
  weeks: CalendarDay[][] = [];

  currentMonth: number = 0;
  currentYear: number = 0;

  months: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  years: number[] = Array.from({ length: 201 }, (_, i) => 1900 + i);

  monthOptions: DropdownOption[] = this.months.map((month, index) => ({
    label: month,
    value: index
  }));

  yearOptions: DropdownOption[] = this.years.map(year => ({
    label: year.toString(),
    value: year
  }));

  constructor() {}

  ngOnInit(): void {
    // Single source of truth: use initialDate for both view and selection
    this.currentDate = this.initialDate ? new Date(this.initialDate) : new Date();
    this.selectedDate = this.initialDate;
    this.generateCalendar();
  }

  /* ================= CALENDAR GENERATION ================= */
  generateCalendar(): void {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    this.currentMonth = month;
    this.currentYear = year;

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const calendarDays: CalendarDay[] = [];

    for (let i = firstDay - 1; i >= 0; i--) {
      const d = new Date(year, month - 1, daysInPrevMonth - i);
      calendarDays.push({ day: d.getDate(), month: d.getMonth(), year: d.getFullYear(), type: 'prev' });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      calendarDays.push({ day: i, month: month, year: year, type: 'current' });
    }

    let nextDay = 1;
    while (calendarDays.length < 42) {
      const d = new Date(year, month + 1, nextDay++);
      calendarDays.push({ day: d.getDate(), month: d.getMonth(), year: d.getFullYear(), type: 'next' });
    }

    this.weeks = [];
    for (let i = 0; i < 6; i++) {
      this.weeks.push(calendarDays.slice(i * 7, i * 7 + 7));
    }
  }

  /* ================= NAVIGATION ================= */
  prevMonth(): void {
    this.currentDate = new Date(this.currentDate.setMonth(this.currentDate.getMonth() - 1));
    this.generateCalendar();
  }

  nextMonth(): void {
    this.currentDate = new Date(this.currentDate.setMonth(this.currentDate.getMonth() + 1));
    this.generateCalendar();
  }

  selectDate(day: CalendarDay): void {
    if (this.isDateDisabled(day)) return;

    this.selectedDate = new Date(day.year, day.month, day.day);
    console.log("Selected date:", this.selectedDate);

    if (day.type !== 'current') {
      this.currentDate = new Date(day.year, day.month, 1);
      this.generateCalendar();
    }
  }

  onMonthChange(monthIndex: number): void {
    this.currentDate = new Date(this.currentDate.setMonth(monthIndex));
    this.generateCalendar();
  }

  onYearChange(year: number): void {
    this.currentDate = new Date(this.currentDate.setFullYear(year));
    this.generateCalendar();
  }

  confirm(): void {
    if (this.selectedDate) {
      this.dateSelected.emit(this.selectedDate);
    }
  }

  cancel(): void {
    this.close.emit();
  }

  /* ================= HELPERS ================= */
  getSelectedDay(): string {
    if (!this.selectedDate) return '';
    return this.selectedDate.toLocaleDateString('default', {
      weekday: 'short', month: 'short', day: 'numeric'
    });
  }

  isDaySelected(day: CalendarDay): boolean {
    if (!this.selectedDate) return false;
    return this.selectedDate.getDate() === day.day &&
      this.selectedDate.getMonth() === day.month &&
      this.selectedDate.getFullYear() === day.year;
  }

  isDateDisabled(day: CalendarDay): boolean {
    const dateOnly = new Date(day.year, day.month, day.day).getTime();
    if (this.minDate) {
      const min = new Date(this.minDate.getFullYear(), this.minDate.getMonth(), this.minDate.getDate()).getTime();
      if (dateOnly < min) return true;
    }
    if (this.maxDate) {
      const max = new Date(this.maxDate.getFullYear(), this.maxDate.getMonth(), this.maxDate.getDate()).getTime();
      if (dateOnly > max) return true;
    }
    return false;
  }

  /* ================= CLOSING LOGIC ================= */
  @HostListener('document:click')
  onDocumentClick(): void {
    this.close.emit();
  }

  @HostListener('document:keydown.escape')
  onEscKeydown(): void {
    this.close.emit();
  }
}
