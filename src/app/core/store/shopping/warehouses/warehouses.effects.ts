import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map,  } from 'rxjs/operators';
import { switchMap } from 'rxjs/operators';
import { mapErrorToAction } from 'ish-core/utils/operators';
import { loadWarehouses, loadWarehousesFail, loadWarehousesSuccess } from './warehouses.actions';
import { WarehousesService } from 'ish-core/services/warehouses/warehouses.service';

@Injectable()
export class WarehousesEffects {
  constructor(private actions$: Actions, private warehouseService: WarehousesService) {}

  loadWarehouses$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadWarehouses),
      switchMap(() =>
        this.warehouseService.getWarehouses().pipe(
          map(warehouses => loadWarehousesSuccess({ warehouses })),
          mapErrorToAction(loadWarehousesFail)
        )
      )
    )
  );
}
