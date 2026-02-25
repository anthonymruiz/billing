import { PriceIntervalEnum } from "../enums/enums";
import { OrderType } from "../enums/orderType.enum";

export interface IEntityBase {
  id?: number;
  isActive?: boolean;
  creationDate?: Date;
  modificationDate?: Date;
  createdBy?: string;
  modificatedBy?: string;
}
  export interface IUser{
    id?: string;
    email: string;
    name: string;
    lastName?: string;
    userName?: string; 
    token: IToken; 
    photo?: string;
    subcriptionState?: ISubscriptionState;
 }
 export interface IToken{
  access_Token: string;
  expires_In: number;
  expires_In_UTC: string;
  issued_Token_Type: string;
 }
 export interface ISubscriptionState{
   State: StateEnum,
   StateId: number,
   CustomerId: string;
 }
 export enum StateEnum {
   new = "New",
   inactive = "Inactive",
   active = "Active"
 }

 export interface ITripleenableUser {
   Email: string[];
   FirstName: string;
   LastName: string;
   PhoneNumber: string;
   Photo: string | null;
   PublicKey: string;
   UserName: string;
 }

 export interface IStripePaymentMethod {
   id?: string;
   brand?: string;
   last4?: string;
   expMonth?: number;
   expYear?: number;
 }
 export interface ISubscriptionPriceViewDto {
  id: number;
  stripePriceId: string;
  stripeProductId: string;
  nickname: string;
  amountCents: number;
  currency: string;
  interval: string;
  priceType: string;
}

export interface ISubscriptionViewDto {
  stripeSubscriptionId: string;
  stripeCustomerId: string;
  status: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  autoRenew: boolean;
  canceledAt: string | null;
  cancelNotes: string | null;
  paymentBrand: string;
  paymentLast4: string;
  provider: string;
  price: ISubscriptionPriceViewDto;
}


export interface ICheckoutRequest {
  interval: PriceIntervalEnum | number;
  referredCode?: string;
}

export interface ICouponRequestDto {
  code: string;
  expiresAt: string | null;
  hasExpired: boolean;
  couponDiscount: string;
}
 

export interface IDynamicFilter {
  /** 
   * Filtro condicional (WHERE).
   * En frontend se puede enviar como texto o clave-valor para búsqueda básica.
   * El backend mapea esto a Expression<Func<T, bool>>.
   */
  filter?: string | Record<string, any>;

  /**
   * Campo por el cual ordenar (ORDER BY).
   * Puede ser el nombre de la propiedad del modelo.
   */
  order?: string;

  /**
   * Campos a seleccionar (SELECT ...).
   * Ejemplo: "Id, Name, Email"
   */
  selectText?: string;

  /**
   * Tipo de orden (Ascendente o Descendente).
   */
  orderType?: OrderType;

  /**
   * Número de página (0 o 1 según tu backend).
   * En tu caso actual, el backend usa Page como OFFSET (Skip).
   */
  page?: number;

  /**
   * Cantidad de registros a tomar (Take).
   */
  pageSize?: number;

  from?: string;

  to?: string;
}
