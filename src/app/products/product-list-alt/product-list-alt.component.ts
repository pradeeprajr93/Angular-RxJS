import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { EMPTY, Observable, Subscription } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Product } from '../product';
import { ProductService } from '../product.service';

@Component({
  selector: 'pm-product-list',
  templateUrl: './product-list-alt.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductListAltComponent implements OnInit {
  pageTitle = 'Products';
  errorMessage = '';
  selectedProductId: number;

  products$: Observable<Product[]>;
  product$: Observable<Product>;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.products$ = this.productService.getProducts().pipe(
      catchError((err) => {
        this.errorMessage = err;
        return EMPTY;
      })
    );
    this.product$ = this.productService.getProduct().pipe(
      catchError((err) => {
        return EMPTY;
      })
    );
  }

  onSelected(productId: number): void {
    this.productService.selectProduct(productId);
  }
}
