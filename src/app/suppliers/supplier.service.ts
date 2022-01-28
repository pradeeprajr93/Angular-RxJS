import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { throwError, Observable, of } from 'rxjs';
import { concatMap, map, mergeMap, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SupplierService {
  suppliersUrl = 'api/suppliers';
  suplliersWithMap$;

  constructor(private http: HttpClient) {
    // console.log('suppliers log');
    // this.subFn().subscribe((o) => o.subscribe(console.log));
    this.subFnMergemap().subscribe(console.log);
  }

  subFn() {
    return (this.suplliersWithMap$ = of(1, 2, 3).pipe(
      map((input) => this.http.get(`${this.suppliersUrl}/${input})`))
    ));
  }

  subFnConcatmap() {
    return (this.suplliersWithMap$ = of(1, 2, 3).pipe(
      concatMap((input) => this.http.get(`${this.suppliersUrl}/${input})`))
    ));
  }

  subFnMergemap() {
    return (this.suplliersWithMap$ = of(1, 2, 3).pipe(
      mergeMap((input) => this.http.get(`${this.suppliersUrl}/${input})`))
    ));
  }

  private handleError(err: any): Observable<never> {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Backend returned code ${err.status}: ${err.body.error}`;
    }
    console.error(err);
    return throwError(errorMessage);
  }
}
