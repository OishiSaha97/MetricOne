import { Component, Input, OnChanges, SimpleChanges, ElementRef, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-flip-tracker',
  templateUrl: './app-flip-tracker.component.html',
  styleUrls: ['./app-flip-tracker.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FlipTrackerComponent implements OnChanges {
  @Input() label!: 'Days' | 'Hours' | 'Minutes';
  @Input() value?: number;

  current = 0;
  previous = 0;
  show = false;
  flipActive = false;
  private initialized = false;

  constructor(private el: ElementRef<HTMLElement>) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (!('value' in changes)) return;

    const incoming = typeof this.value === 'number' ? Math.max(0, this.value) : undefined;

    if (incoming === undefined) {
      this.show = false;
      return;
    }
    this.show = true;

    if (!this.initialized) {
      this.current = incoming;
      this.previous = incoming;
      this.initialized = true;
      return;
    }

    if (incoming !== this.current) {
      this.previous = this.current;
      this.current = incoming;

      // restart flip animation
      this.flipActive = false;
      // Force reflow
      void this.el.nativeElement.offsetWidth;
      this.flipActive = true;
    }
  }
}
