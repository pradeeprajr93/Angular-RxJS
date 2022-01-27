import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject, merge, Observable, Subject, throwError } from 'rxjs';
import {
  catchError,
  map,
  scan,
  shareReplay,
  tap,
  withLatestFrom,
} from 'rxjs/operators';

import { Product } from './product';
import { Supplier } from '../suppliers/supplier';
import { SupplierService } from '../suppliers/supplier.service';
import { ProductCategoryService } from '../product-categories/product-category.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private productsUrl = 'api/products';

  private productSelectionSubject = new BehaviorSubject<number>(1);
  productSelectAction$ = this.productSelectionSubject.asObservable();

  private productAdditionSubject = new Subject<Product>();
  productAddAction$ = this.productAdditionSubject.asObservable();

  constructor(
    private http: HttpClient,
    private supplierService: SupplierService,
    private categoryService: ProductCategoryService
  ) {}

  selectProduct(id: number) {
    this.productSelectionSubject.next(id);
  }

  addNewProduct(product?: Product) {
    if (!product) {
      product = this.fakeProduct();
    }
    this.productAdditionSubject.next(product);
  }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.productsUrl).pipe(
      withLatestFrom(this.categoryService.getProductCategories()),
      map(([products, categories]) =>
        products.map(
          (product) =>
            ({
              ...product,
              category: categories.find((v) => v.id === product.categoryId)
                .name,
            } as Product)
        )
      ),
      tap(console.log),
      catchError(this.handleError)
    );
  }

  getProductsWithAdditions() {
    return merge(this.getProducts(), this.productAddAction$).pipe(
      scan((acc: Product[], value: Product) => [...acc, value])
    );
  }

  getProduct(): Observable<Product> {
    return this.productSelectAction$.pipe(
      withLatestFrom(this.getProducts()),
      map(([id, products]) => products.find((product) => product.id === +id))
    );
  }

  private fakeProduct(): Product {
    return {
      id: 42,
      productName: 'Another One',
      productCode: 'TBX-0042',
      description: 'Our new product',
      price: 8.9,
      categoryId: 3,
      category: 'Toolbox',
      quantityInStock: 30,
    };
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
    return throwError(() => new Error(errorMessage));
  }
}
