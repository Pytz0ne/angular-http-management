import { Component, OnInit, isDevMode } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { APPCONFIG } from './config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public AppConfig: any;
  isdev: boolean;
  constructor(private router: Router) {
    this.isdev = isDevMode();
  }
  ngOnInit() {
    this.AppConfig = APPCONFIG;

    // Scroll to top on route change
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
  }
}
