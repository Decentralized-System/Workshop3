import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {HttpFacadeService, product} from "../http-facade.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";


@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit{
  products : { productId: number; name: string, description: string; category: string; price: number; quantity: number }[] = [];
  emptyProductList: boolean = false;
  productForm : FormGroup = this.formBuilder.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    category: ['', Validators.required],
    price: ['', [Validators.required, Validators.min(0)]],
    quantity:['', [Validators.required, Validators.min(0)]]
  });

  constructor(private route: ActivatedRoute, private httpFacadeService : HttpFacadeService, private router : Router, private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.route.queryParams.subscribe({
      next: params => {
      }
    });
    this.refreshProductList();
  }
  productDetail(productId: number) {
    this.router.navigate(['/products-details'], {
      queryParams: {
        productId: productId,
      }
    });
  }

  deleteProduct(productId: number) {
    this.httpFacadeService.deleteProduct(productId).subscribe(
      () => {
        this.refreshProductList();
      },
      (error) => {
        console.error('Erreur lors de la suppression du produit :', error);
      }
    );
  }

  refreshProductList() {
    this.httpFacadeService.getAllProducts().subscribe({
      next: products => {
        this.products = products.map((product: { productId: number; name: string, description: string; category: string; price: number; quantity: number }) => ({
          productId: product.productId,
          name: product.name,
          description: product.description,
          category: product.category,
          price: product.price,
          quantity: product.quantity,
        }));
        if (this.products.length ===0){
          this.emptyProductList = true;
        }
      },
    });
  }

  addProduct(): void {
    this.httpFacadeService.postNewProduct(
      this.productForm.value.name,
      this.productForm.value.description,
      this.productForm.value.category,
      this.productForm.value.price,
      this.productForm.value.quantity,
    )
      .subscribe(
        (newProduct: product) => {
          console.log('Nouveau produit ajouté:', newProduct);
          this.productForm.reset();
          this.refreshProductList();
        },
        (error) => {
          console.error('Erreur lors de l\'ajout du produit :', error);
        });
  }
}
