import {Component, OnInit} from '@angular/core';
import {HttpFacadeService} from "../http-facade.service";

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit{
  userId: number = 1;
  orders: {
      orderId: number,
      totalPrice: number,
      orderDetails: {
        productId: number,
        name: string,
        quantity: number,
        price: number
      }[]
  }[] = [];  emptyOrderDetails: boolean = false;

  constructor(private httpFacadeService: HttpFacadeService) { }
  ngOnInit() {
    /*this.httpFacadeService.getOrder(this.userId).subscribe({
      next: orders => {
        this.orders = orders.map((order: {orderId: number, totalPrice: number, orderDetails:{productId:number, name: string, quantity: number, price: number }}) => ({
          orderId: orders.orderId,
          totalPrice: orders.totalPrice,
        }));
        if (this.orders.length ===0){
          this.emptyOrderDetails = true;
        }
      },
    });*/
    this.httpFacadeService.getOrder(this.userId).subscribe({
      next: (response: any) => {
        if (response && response['all orders']) {
          const allOrders = response['all orders'];
          this.orders = allOrders.map((orderItem: any) => ({
            orderId: orderItem.orderId,
            totalPrice: response['total price'],
            orderDetails: {
              productId: orderItem.productId,
              name: orderItem.name,
              quantity: orderItem.quantity,
              price: orderItem.price
            }
          }));
          this.emptyOrderDetails = this.orders.length === 0;
        } else {
          this.emptyOrderDetails = true;
        }
      },
      error: (error) => {
        console.error('Error fetching order details:', error);
        // Handle the error, e.g., display an error message to the user
      }
    });
  }

}
