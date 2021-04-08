import { Injectable } from '@angular/core';
import { Warehouse } from 'ish-core/models/warehouse/warehouse.model';
import { ApiService } from 'ish-core/services/api/api.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WarehousesService {
  constructor(private apiService: ApiService) { }

  getWarehouses(): Observable<Warehouse[]> {
    return this.apiService.get('warehouses');
  }
}
