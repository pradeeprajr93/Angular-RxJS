import { Component, OnInit } from '@angular/core';

import {
  BehaviorSubject,
  combineLatest,
  EMPTY,
  Observable,
  of,
  Subject,
  Subscription,
} from 'rxjs';
import { catchError, map, tap, withLatestFrom } from 'rxjs/operators';
import { ProductCategory } from '../product-categories/product-category';
import { ProductCategoryService } from '../product-categories/product-category.service';

import { Product } from './product';
import { ProductService } from './product.service';

@Component({
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {
  pageTitle = 'Product List';
  errorMessage = '';
  categories$: Observable<ProductCategory[]>;
  productsWithCategories$: Observable<Product[]>;
  private categorySelectionSubject = new BehaviorSubject<number>(0);
  categorySelectedAction$ = this.categorySelectionSubject.asObservable();

  ngOnInit() {
    // this.productsWithCategories$ = combineLatest([
    //   this.productService.getProducts(),
    //   this.categoryService.getProductCategories(),
    // ]).pipe(
    //   map(([products, categories]) =>
    //     products.map((product) => {
    //       return {
    //         ...product,
    //         category: categories.find((c) => c.id === product.categoryId).name,
    //       } as Product;
    //     })
    //   ),
    //   catchError((err) => {
    //     this.errorMessage = err;
    //     return EMPTY;
    //   })
    // );
    this.categories$ = this.categoryService.getProductCategories().pipe(
      catchError((err) => {
        this.errorMessage = err;
        return EMPTY;
      })
    );
    this.productsWithCategories$ = combineLatest([
      this.productService.getProductsWithAdditions(),
      this.categorySelectedAction$,
    ]).pipe(
      // tap(console.log),
      map(([p, a]) => p.filter((p) => (a ? p.categoryId === a : true)))
    );
    // this.productsWithCategories$ = this.productService.getProducts().pipe(
    //   map((products) =>
    //     products.map((product) => {
    //       return { ...product, price: 1.5 * product.price };
    //     })
    //   ),
    //   catchError((err) => {
    //     this.errorMessage = err;
    //     return EMPTY;
    //   })
    // );
  }

  constructor(
    private productService: ProductService,
    private categoryService: ProductCategoryService
  ) {}

  onAdd(): void {
    this.productService.addNewProduct();
  }

  onSelected(categoryId: string): void {
    this.categorySelectionSubject.next(+categoryId);
  }
}
