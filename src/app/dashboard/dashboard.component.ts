import {ChangeDetectorRef, Component} from '@angular/core';
import {Router} from "@angular/router";
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  constructor(private router: Router,
              private cdr: ChangeDetectorRef) {

  }

  generatedId: string = '';
  ngOnInit() {
    const token = localStorage.getItem('token');
    this.generatedId = Math.random().toString(36).substring(2, 10);

    if (!token) {
      this.router.navigate(['/login']);
    }
  }
}
