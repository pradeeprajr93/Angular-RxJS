import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'pm-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  pageTitle = 'Acme Product Management';

  obs$ = new Observable((observer) => {
    observer.next('Hey');
    observer.next('Hello!');
    observer.complete();
  });

  ngOnInit() {
    this.obs$.subscribe(console.log);
  }
}
