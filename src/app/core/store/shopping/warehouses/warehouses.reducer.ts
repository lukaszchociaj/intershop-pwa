import { createReducer, on } from '@ngrx/store';
import { Warehouse } from 'ish-core/models/warehouse/warehouse.model';

import { loadWarehousesFail, loadWarehousesSuccess } from './warehouses.actions';

export interface WarehousesState {
  data: Warehouse[];
}

export const initialState: WarehousesState = {
  data: [],
};

function mergeWarehouses(
  state: WarehousesState,
  action: ReturnType<typeof loadWarehousesSuccess>
) {
  const warehouses = action.payload.warehouses;

  return {
    ...state,
    ...warehouses
  };
}

export const warehousesReducer = createReducer(
  initialState,
  on(loadWarehousesFail, state => ({
    ...state,
  })),
  on(loadWarehousesSuccess, mergeWarehouses)
);
