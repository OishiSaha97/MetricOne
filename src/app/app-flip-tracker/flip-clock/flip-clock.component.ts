import { Component, Input, Output, EventEmitter, OnDestroy, OnInit } from '@angular/core';

type TimeParts = {
  Days?: number;
  Hours?: number;
  Minutes?: number;
  Seconds?: number;
  Total?: number; // ms remaining (or ms since start if tick-up)
};

@Component({
  selector: 'app-flip-clock',
  templateUrl: './flip-clock.component.html',
  styleUrls: ['./flip-clock.component.css']
})
export class FlipClockComponent implements OnInit, OnDestroy {
  /** Target end datetime (e.g., '2017-02-11' or '2025-12-31 23:59:59' or Date) */
  @Input() date?: string | Date;

  /** If false, shows only H/M/S (no Days). Defaults true. */
  @Input() showDays = true;

  /** Emit when countdown hits zero or below (only when date is provided) */
  @Output() completed = new EventEmitter<void>();

  time: TimeParts = {};
  trackers: Array<'Days' | 'Hours' | 'Minutes' > = ['Days', 'Hours', 'Minutes'];

  private frameId: number | null = null;
  private ticking = false;
  private i = 0;

  ngOnInit(): void {
    if (!this.showDays) {
      this.trackers = ['Hours', 'Minutes'];
    }
    this.start();
  }

  ngOnDestroy(): void {
    this.stop();
  }

  private start(): void {
    // initial compute + align to next second
    this.computeTime();
    const ms = 1000 - (new Date().getMilliseconds());
    setTimeout(() => {
      this.tick();
      this.ticking = true;
      this.loop();
    }, ms);
  }

  private stop(): void {
    if (this.frameId != null && 'cancelAnimationFrame' in window) {
      cancelAnimationFrame(this.frameId);
    }
    this.ticking = false;
  }

  /** RAF loop throttled to ~6fps like your Vue (every 10th frame @60fps) */
  private loop = () => {
    if (!this.ticking) return;
    this.frameId = requestAnimationFrame(this.loop);
    if (this.i++ % 10) return; // throttle
    this.tick();
  };

  tick(): void {
    const t = this.computeTime();
    // If countdown and reached zero, emit once
    if (this.date && typeof t.Total === 'number' && t.Total <= 0) {
      this.completed.emit();
      // Optional: stop at zero
      this.stop();
    }
  }

  computeTime(): TimeParts {
    const now = new Date();

    if (this.date) {
      const target = (typeof this.date === 'string')
        ? this.parseDateTime(this.date)
        : new Date(this.date);

      const diff = target.getTime() - now.getTime(); // ms remaining (can be negative)
      const total = diff;

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);

      this.time.Days = this.showDays ? Math.max(0, days) : undefined;
      this.time.Hours = Math.max(0, hours);
      this.time.Minutes = Math.max(0, minutes);
      this.time.Total = total;
    } else {
      // Clock mode (no target date): show current time
      this.time.Days = undefined;
      this.time.Hours = now.getHours();            // 24h; change to (now.getHours()%12 || 12) for 12h
      this.time.Minutes = now.getMinutes();
      this.time.Total = now.getTime();
    }

    // Angular will push @Input() updates to children
    return this.time;
  }

  /** Parses 'YYYY-MM-DD' or 'YYYY-MM-DD HH:mm:ss' as local time */
  private parseDateTime(s: string): Date {
    const parts = s.trim().split(/\s+/);
    const [y, m, d] = parts[0].split('-').map(Number);
    if (parts.length === 1) return new Date(y, (m - 1), d, 0, 0, 0, 0);
    const [hh, mm, ss] = (parts[1] || '00:00:00').split(':').map(Number);
    return new Date(y, (m - 1), d, hh || 0, mm || 0, ss || 0, 0);
  }
}
