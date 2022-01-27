import { Component, OnInit } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { Product } from '../product';
import { catchError } from 'rxjs/operators';
import { ProductService } from '../product.service';

@Component({
  selector: 'pm-product-detail',
  templateUrl: './product-detail.component.html',
})
export class ProductDetailComponent implements OnInit {
  pageTitle = 'Product Detail';
  errorMessage = '';
  product$: Observable<Product>;

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.product$ = this.productService.getProduct().pipe(
      catchError((err) => {
        console.log(err);
        return EMPTY;
      })
    );
  }
}
