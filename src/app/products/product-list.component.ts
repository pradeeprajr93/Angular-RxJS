import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { combineLatest, EMPTY, Observable, of, Subscription } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
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
  categories;
  productsWithCategories$: Observable<Product[]>;

  ngOnInit() {
    this.productsWithCategories$ = combineLatest([
      this.productService.getProducts(),
      this.categoryService.getProductCategories(),
    ]).pipe(
      map(([products, categories]) =>
        products.map(
          (product) =>
            ({
              ...product,
              category: categories.find((c) => c.id === product.categoryId)
                .name,
            } as Product)
        )
      ),
      tap((d) => console.log('***********')),
      tap((d) => console.log)
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
    console.log('Not yet implemented');
  }

  onSelected(categoryId: string): void {
    console.log('Not yet implemented');
  }
}
