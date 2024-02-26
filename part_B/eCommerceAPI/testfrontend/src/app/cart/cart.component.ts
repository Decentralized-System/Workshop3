import {Component, OnInit} from '@angular/core';
import {HttpFacadeService} from "../http-facade.service";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit{
  userId: number=1;
  emptyCartList: boolean=false;
  totalPrice : number=0.0;
  carts: {productId: number; name: string; price: number; quantity: number}[]=[];



  constructor(private httpFacadeService: HttpFacadeService) {
  }

  ngOnInit() {
    this.httpFacadeService.getCart(this.userId).subscribe({
      next: (response: any) => {
        if (response && response['cart detail']) {
          const cartDetails = response['cart detail'];
          this.carts = cartDetails.map((cartItem: any) => ({
            productId: cartItem.id,
            name: cartItem.name,
            price: cartItem.price,
            quantity: cartItem.quantity,
            // Ajoutez d'autres propriétés du produit si nécessaire
          }));

          this.totalPrice = response['total price'];
          this.emptyCartList = this.carts.length === 0;
        } else {
          // Gérer le cas où la réponse ne contient pas les détails du panier attendus
        }
      },
      error: (error) => {
        console.error('Erreur lors de la récupération du panier :', error);
        // Gérer l'erreur, par exemple afficher un message à l'utilisateur
      }
    });
  }

  deleteCart(productId: number, userId: number) {
    this.httpFacadeService.deleteCart(productId, userId).subscribe(
      () => {
        this.ngOnInit();
      },
      (error) => {
        console.error('Erreur lors de la suppression du produit :', error);
      }
    );
  }

  purchaseCart(userId: number){
    this.httpFacadeService.newOrder(userId).subscribe(
      ()=>{
        for(let i = 0; i< this.carts.length; i++)
        {
          this.deleteCart(this.carts[i].productId, this.userId);
        }
      }
    )
  }

}
