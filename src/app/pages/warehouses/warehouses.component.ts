import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { Warehouse } from 'ish-core/models/warehouse/warehouse.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'ish-warehouses',
  templateUrl: './warehouses.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WarehousesComponent implements OnInit {

  warehouses$: Observable<Warehouse[]>;
  constructor(private facade: ShoppingFacade) { }

  ngOnInit() {
    this.warehouses$ = this.facade.warehouses$();
  }

}
