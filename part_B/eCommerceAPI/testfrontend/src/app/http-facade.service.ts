import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

export interface user {
  userId : number;
  name : string;
}

export interface product {
  productId:number;
  name:string;
  description:string;
  category:string;
  price: number;
  quantity:number;
}

export interface cart {
  productId:number;
  userId: number;
  quantity:number;
}

export interface order {
  orderId:number;
  userId: number;
  totalPrice:number;
}

export interface productOrdered {
  productId:number;
  orderId: number;
  quantity: number;
}
@Injectable({
  providedIn: 'root'
})
export class HttpFacadeService {

  private backendUrl = 'http://localhost:3000';
  constructor(private httpClient:HttpClient) { }

  getProduct(productId: number): Observable<product> {
    return this.httpClient.get<product>(`${this.backendUrl}/products/${productId}`);
  }

  getAllProducts(): Observable<product[]> {
    return this.httpClient.get<product[]>(`${this.backendUrl}/products`);
  }

  deleteProduct(productId : number): Observable<any>{
    return this.httpClient.delete<any>(`${this.backendUrl}/products/${productId}`);
  }

  postNewProduct(name : string, description : string,category : string,price : number,quantity : number):Observable<product>{
    const body = {name, description,category,price,quantity};
    return  this.httpClient.post<product>(`${this.backendUrl}/products`, body);
  }

  modifyProduct(productId: number, name : string, description : string,category : string,price : number,quantity : number): Observable<any> {
    const body = {name, description,category,price,quantity};
    return this.httpClient.put<any>(`${this.backendUrl}/products/${productId}`, body);
  }

  addToCart(userId: number, productId: number, quantity: number): Observable<any>{
    const body = {productId, userId, quantity};
    return  this.httpClient.post<product>(`${this.backendUrl}/cart/${userId}`, body);
  }

  //cart
  getCart(userId: number): Observable<any> {
    return this.httpClient.get<any>(`${this.backendUrl}/cart/${userId}`);
  }

  deleteCart(productId:number, userId: number): Observable<any>{
    return this.httpClient.delete<any>(`${this.backendUrl}/cart/${userId}/item/${productId}`);
  }

  //orders
  getOrder(userId: number): Observable<any> {
    return this.httpClient.get<any>(`${this.backendUrl}/orders/${userId}`);
  }

  newOrder(userId: number): Observable<any>{
    return this.httpClient.post<any>(`${this.backendUrl}/orders`,{userId});
  }
}


