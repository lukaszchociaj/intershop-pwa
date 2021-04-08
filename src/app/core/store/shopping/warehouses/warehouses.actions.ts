import { createAction } from '@ngrx/store';
import { Warehouse } from 'ish-core/models/warehouse/warehouse.model';
import { httpError, payload } from 'ish-core/utils/ngrx-creators';

export const loadWarehouses = createAction('[Warehouses Internal] Load all warehouses');
export const loadWarehousesFail = createAction('[Warehouses API] Load warehouses fail', httpError());
export const loadWarehousesSuccess = createAction(
  '[Warehouses API] Load warehouses success',
  payload<{ warehouses: Warehouse[] }>()
);
