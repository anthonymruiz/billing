import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';   
import { environment } from '../../../environments/environment.development';
import { IDynamicFilter } from '../interfaces/interfaces';

export interface IBaseService<T> {
  headers: HttpHeaders;
  // getById(id: number): Observable<T>;
  // list(): Observable<T[]>;
  // list(filter: IDynamicFilter): Observable<T[]>;
  // save(entity: T): Observable<T>;
  // update(entity: T): Observable<T>;
  // delete(id: number): Observable<void>;
  // inactivate(id: number): Observable<void>;
  // activate(id: number): Observable<void>;
  // searchImage(username: string) : Observable<any>;
}

@Injectable({
  providedIn: 'root'
})
export class BaseService<T> implements IBaseService<T> {
  entity: string;
  headers: HttpHeaders; 

  constructor(public http: HttpClient) {
    this.headers = new HttpHeaders()
   //   .set('content-type', 'application/json')
      .set('Access-Control-Allow-Origin', '*');
    
  }
  // getById(id: number): Observable<T> {
  //   return this.http.get<T>(`${environment.SERVER}/${this.entity}/${id}`, { headers: this.headers });
  // }

  //   list(filter?: IDynamicFilter): Observable<T[]> { 
  //   let params = new HttpParams();  
  //   if (filter) {
  //     if (filter?.selectText)
  //       params = params.set('selectText', filter.selectText);
  //     if (filter?.order)
  //       params = params.set('order', filter.order.toString());
  //     if (filter?.orderType) 
  //       params = params.set('orderType', filter.orderType.toString());
  //     if (filter?.page != null)
  //       params = params.set('page', filter.page.toString());
  //     if (filter?.pageSize != null)
  //       params = params.set('pageSize', filter.pageSize.toString());
  //     if (filter?.filter)
  //       params = params.set('filter', filter.filter.toString());
  //      if (filter?.from && filter?.to){
  //       params = params.set('from', filter.from.toString());
  //       params = params.set('to', filter.to.toString());

  //      }
  //   }   
  //   return this.http.get<T[]>(`${environment.SERVER}/${this.entity}`, {
  //     headers: this.headers,
  //     params
  //   });
  // }

  // save(value: T): Observable<T> {
  //   return this.http.post<T>(`${environment.SERVER}/${this.entity}`, value, { headers: this.headers });
  // }

  // update(entity: T): Observable<T> {
  //   return this.http.put<T>(`${environment.SERVER}/${this.entity}/${entity['id']}`, entity, { headers: this.headers });
  // }

  // delete(id: number): Observable<void> {
  //   return this.http.delete<void>(`${environment.SERVER}/${this.entity}/${id}`, { headers: this.headers });
  // }
  // inactivate(id: number): Observable<void> {
  //   return this.http.post<void>(`${environment.SERVER}/${this.entity}/inactivate/${id}`, { headers: this.headers });
  // }
  // activate(id: number): Observable<void> {
  //   return this.http.post<void>(`${environment.SERVER}/${this.entity}/activate/${id}`, { headers: this.headers });
  // } 
}
