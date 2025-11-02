import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  endDate = new Date('2025-01-25T00:00:00');
  days: number = 0;
  hours: number = 0;
  minutes: number = 0;

  notifications = [
    { name: 'Jaber Alom', message: 'KPI review session announced.', image: 'https://i.pravatar.cc/40?img=1' },
    { name: 'Asif Islam', message: 'Reminder for self-assessment.', image: 'https://i.pravatar.cc/40?img=2' },
    { name: 'Mehedi Hasan', message: 'Team evaluation due soon.', image: 'https://i.pravatar.cc/40?img=3' },
  ];
  employees = [
    { name: 'Sohail Rahman', designation: 'Software Engineer', team: 'QA', measure: 'KPI Review Session', date: 'Nov 2, 2025' },
    { name: 'Arafat Alam', designation: 'SQA Engineer', team: 'QA', measure: 'Performance Review', date: 'Nov 1, 2025' },
  ];

  ngOnInit() {
    this.updateCountdown();
    setInterval(() => this.updateCountdown(), 60000); // Update every minute
  }

  updateCountdown() {
    const now = new Date().getTime();
    const distance = this.endDate.getTime() - now;

    this.days = Math.floor(distance / (1000 * 60 * 60 * 24));
    this.hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    this.minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  }
}
