import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehousesComponent } from './warehouses.component';

describe('Warehouses Component', () => {
  let component: WarehousesComponent;
  let fixture: ComponentFixture<WarehousesComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WarehousesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WarehousesComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
