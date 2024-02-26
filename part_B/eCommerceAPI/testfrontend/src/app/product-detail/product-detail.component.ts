import { Component, OnInit } from '@angular/core';
import {cart, HttpFacadeService, product} from "../http-facade.service";
import { ActivatedRoute, Router } from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  userId: number = 1;
  productId: number = 0;
  product!: { productId: number; name: string; description: string; category: string; price: number; quantity: number };
  quantForm!: FormGroup;
  productForm : FormGroup = this.formBuilder.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    category: ['', Validators.required],
    price: ['', [Validators.required, Validators.min(0)]],
    quantity:['', [Validators.required, Validators.min(0)]]
  });

  constructor(private route: ActivatedRoute, private httpFacadeService: HttpFacadeService, private router: Router, private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.productId = params['productId'];
      this.loadProduct(this.productId);
    });
  }

  loadProduct(productId: number) {
    this.httpFacadeService.getProduct(productId).subscribe({
      next: product => {
        this.product = product;
        this.initializeForm();
      },
      error: err => {
        console.error('Une erreur s\'est produite lors de la récupération du produit :', err);
      }
    });
  }

  initializeForm() {
    // Initialiser le formulaire avec FormBuilder après avoir reçu les données du produit
    this.quantForm = this.formBuilder.group({
      quantity: ['', [Validators.required, Validators.min(0), Validators.max(this.product.quantity)]]
    });
  }

  modifyProduct(): void {
    this.httpFacadeService.modifyProduct(
      this.product.productId,
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
          this.loadProduct(this.productId);
        },
        (error) => {
          console.error('Erreur lors de l\'ajout du produit :', error);
        }
      );
  }

  addToCart(): void {
    this.httpFacadeService.addToCart(
      this.userId,
      this.product.productId,
      this.quantForm.value.quantity
    ).subscribe(
      (newCart: cart) => {
        console.log('produit ajouté au panier:', newCart);
        this.quantForm.reset();
      },
      (error) => {
        console.error('Erreur lors de l\'ajout du produit :', error);
      }
    );
  }

}
