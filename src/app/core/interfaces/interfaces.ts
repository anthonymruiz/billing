import { OrderType } from "../enums/orderType.enum";

export interface IEntityBase {
  id?: number;
  isActive?: boolean;
  creationDate?: Date;
  modificationDate?: Date;
  createdBy?: string;
  modificatedBy?: string;
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
