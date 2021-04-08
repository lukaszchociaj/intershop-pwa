import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'ish-shared/shared.module';
import { WarehousesComponent } from './warehouses.component';

const warehousesPageRoutes: Routes = [
  { path: '**', component: WarehousesComponent },
];


@NgModule({
  imports: [RouterModule.forChild(warehousesPageRoutes), SharedModule],
  declarations: [
    WarehousesComponent
  ],
  exports: [],
})
export class WarehousesModule { }
