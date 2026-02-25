import { HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, filter, Observable, Subject, switchMap, take, tap } from 'rxjs'; 
import { Helper } from '../helpers/helper.service';
import { IDynamicFilter, IEntityBase } from '../interfaces/interfaces';
import { IBaseService } from '../services/baseService';

export interface IBaseBloc<T> {
  readonly state$: Observable<T[]>;
  readonly currentValue: T[]; 
  dynamicFilter: IDynamicFilter;
  searchFields: any[];
  orderFields: string[];
  downloadFields: any[];
  loading : BehaviorSubject<boolean>;
  // getById(id: number): Observable<T>;
  // list(reload: boolean, clearData: boolean): Observable<T[]>;
  // save(entity: T): Observable<T>;
  // update(entity: T): Observable<T>;
  // delete(id: number): Observable<void>;
  // emit(state: T[]): void;
}

export abstract class BaseBloc<T extends IEntityBase> implements IBaseBloc<T> {
  public readonly _state$ = new BehaviorSubject<T[]>([]);
  public readonly state$ = this._state$.asObservable();
  onUpdate: Subject<T> = new Subject<T>();
  onSave: Subject<T> = new Subject<T>();
  onDelete: Subject<number> = new Subject<number>(); 
  loading = new BehaviorSubject<boolean>(false);
  headers: HttpHeaders;
  searchFields: any[] = [];
  orderFields: string[] = [];
  dynamicFilter: IDynamicFilter;
  downloadFields: any[]
  reachedPageLimits = false

  constructor(private service: IBaseService<T>, private helper: Helper) {
    this.dynamicFilter = {
      page: 1,
      pageSize: 20,
      filter: null,
      order: null,
      orderType: null,
      selectText: null
    }
  }

  public get currentValue(): T[] {
    return this._state$.value;
  }
  emit(state: T[]): void {
    this._state$.next(state);
  }
//   getById(id: number): Observable<T> {
//     return this.service.getById(id);
//   }
  
//   save(entity: T): Observable<T> {
//     return this.service.save(entity).pipe(
//       tap((newEntity) => {
//         this._state$.next([...this.currentValue, newEntity])
//         this.emit(this.currentValue);
//         this.onSave.next(newEntity);
//       })
//     );
//   }
//   update(entity: T): Observable<T> {
//     return this.service.update(entity).pipe(
//       tap((updated: T) => {
//         this.setOnUpdate(updated)
//       })
//     );
//   }
//   private setOnUpdate(updated: T) {
//     this.onUpdate.next(updated)
//     const updatedList: T[] = this.currentValue.map((x: any) => {
//       if (x['id'] == updated['id']) {
//         Object.keys(updated).forEach(key => {
//           x[key] = updated[key] ? updated[key] : x[key]
//         })
//       }
//       return x
//     });
//     this.emit(updatedList);
//   }
//   delete(id: number): Observable<void> {
//     return this.service.delete(id).pipe(
//       tap(() => {
//         this.helper.success("Removed");
//         this.onDelete.next(id);
//         this.emit(this.currentValue.filter((x: any) => (x as any).id !== id));
//       })
//     );
//   }
//   inactivate(entity: T): Observable<void> {
//     return this.service.inactivate(entity.id).pipe(
//       tap(() => {
//         entity.isActive = false;
//         this.helper.success("Inactivated");
//         this.emit(this.currentValue);
//       })
//     );
//   }
//   activate(entity: T): Observable<void> {
//     return this.service.activate(entity.id).pipe(
//       tap(() => {
        
//         entity.isActive = true;
//         this.setOnUpdate(entity)
//         this.helper.success("Activated!"); 
//       })
//     );
//   }
   
//   list(
//   reload: boolean = false,
//   clearData: boolean = false
// ): Observable<T[]> {

//   return this.loading.pipe(
//     filter(loading => !loading),  
//     take(1),
//     switchMap(() => {
 
//       if (!reload && this.currentValue.length > 0) {
//         return this.state$;
//       }
//       if (clearData) this.clearData();

//       this.loading.next(true);

//       return this.service.list(this.dynamicFilter).pipe(
//         tap(data => {

//           if (!data?.length) {
//             this.reachedPageLimits = true;
//           }

//           const value = this.currentValue?.length
//             ? [...this.currentValue, ...data]
//             : data;

//           this._state$.next(value);
//           this.emit(value);

//           this.loading.next(false);
//         })
//       );
//     })
//   );
// }

//   nextPage() {
//     if (this.reachedPageLimits) return
//     this.dynamicFilter.page += 1
//     this.list(true).subscribe()
//   }
 
//   linkPhoto(user: any) { 
//     //todo
//   } 
//   protected clearData(){ 
//     this._state$.next([])
//   }
}