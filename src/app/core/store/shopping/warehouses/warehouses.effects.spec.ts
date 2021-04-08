import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { ShoppingStoreModule } from 'ish-core/store/shopping/shopping-store.module';

import { WarehousesEffects } from './warehouses.effects';

describe('Compare Effects', () => {
  let actions$: Observable<Action>;
  let effects: WarehousesEffects;
  let store$: Store;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CoreStoreModule.forTesting(), ShoppingStoreModule.forTesting('warehouses')],
      providers: [WarehousesEffects, provideMockActions(() => actions$)],
    });

    effects = TestBed.inject(WarehousesEffects);
    store$ = TestBed.inject(Store);
  });

  // describe('toggleCompare$', () => {
  //   it('should switch to ADD action', () => {
  //     const sku = '123';

  //     const action = toggleCompare({ sku });
  //     const completion = addToCompare({ sku });

  //     actions$ = hot('-a', { a: action });
  //     const expected$ = cold('-b', { b: completion });

  //     expect(effects.toggleCompare$).toBeObservable(expected$);
  //   });

  //   it('should switch to REMOVE action', () => {
  //     const sku = '123';
  //     store$.dispatch(addToCompare({ sku }));

  //     const action = toggleCompare({ sku });
  //     const completion = removeFromCompare({ sku });

  //     actions$ = hot('-a', { a: action });
  //     const expected$ = cold('-b', { b: completion });

  //     expect(effects.toggleCompare$).toBeObservable(expected$);
  //   });
  // });
});
