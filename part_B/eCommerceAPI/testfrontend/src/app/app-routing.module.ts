import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {ProductListComponent} from "./product-list/product-list.component";
import {ProductDetailComponent} from "./product-detail/product-detail.component";
import {CartComponent} from "./cart/cart.component";
import {OrderComponent} from "./order/order.component";

const routes: Routes = [
  {path: '', redirectTo:'/home', pathMatch:'full'},
  {path:'home', component: HomeComponent},
  {path: 'products', component: ProductListComponent},
  {path: 'products-details', component: ProductDetailComponent},
  {path: 'cart', component: CartComponent},
  {path: 'orders', component: OrderComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
