import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { map, of, tap } from 'rxjs';
import { PokemonService } from '../pokemon.service';

import { PokemonListComponent } from './pokemon-list.component';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { By } from '@angular/platform-browser';
import * as rxjs from 'rxjs';

class PokemonServiceStub {
  mockDataRes = [
    { name: 'dragonite', id: '149' },
    { name: 'mewtwo', id: '150' },
  ];
  getPokemonDetails() {
    return of(this.mockDataRes);
  }
  transformData() {
    return this.mockDataRes;
  }
}

class MockMediaObserver {
  asObservable() {
    return of({
      mqAlias: 'xl',
    });
  }
  isActive() {
    return of(true);
  }
}

describe('PokemonListComponent', () => {
  let component: PokemonListComponent;
  let fixture: ComponentFixture<PokemonListComponent>;
  let observableMedia: MediaObserver;
  const mockFlex = of({
    // create an Observable that returns a desired result
    mqAlias: 'xs',
    mediaQuery: 'test mQ',
  });
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PokemonListComponent],
    }).compileComponents();
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PokemonListComponent],
      providers: [
        { provide: PokemonService, useClass: PokemonServiceStub },
        { provide: MediaObserver, useClass: MockMediaObserver },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PokemonListComponent);
    observableMedia = fixture.debugElement.injector.get(MediaObserver);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnit() result should make a copy into originalData and pokeMonData', () => {
    const mock = [
      { name: 'dragonite', id: '149' },
      { name: 'mewtwo', id: '150' },
    ];
    component.ngOnInit();

    expect(component.pokemonData).toEqual(mock);
  });

  it('ngAfterViewInit() result should call onSearchPokemon(), getDeviceDetails()', () => {
    spyOn(component, 'onSearchPokemon').and.callThrough();
    spyOn(component, 'getDeviceDetails').and.callThrough();

    component.ngAfterViewInit();

    expect(component.onSearchPokemon).toHaveBeenCalledTimes(1);
    expect(component.getDeviceDetails).toHaveBeenCalledTimes(1);
  });

  it('onSearchPokemon() result should filter the value', () => {
    let element = fixture.debugElement.query(By.css('[name="searchPokemon"]'));
    element.nativeElement.value = 'mewtwo';
    const mock = [
      { name: 'dragonite', id: '149' },
      { name: 'mewtwo', id: '150' },
    ];

    const event = new KeyboardEvent('keyup', {
      bubbles: true,
      key: 'mewtwo',
      cancelable: true,
      shiftKey: false,
    });

    element.triggerEventHandler('keypress', { key: '' });
    fixture.detectChanges();

    console.log('Native element', element.nativeElement.value);

    expect(
      fixture.debugElement.query(By.css('[name="searchPokemon"]')).nativeElement
        .value
    ).toEqual('mewtwo');

    console.log(component.pokemonData);
    console.log(component.orginalData);

    expect(component.pokemonData).toEqual(mock);
    expect(component.orginalData).toEqual(mock);
  });

  it('getDeviceDetails() should set device Alias', () => {
    component.ngOnInit();
    component.ngAfterViewInit();
    fixture.detectChanges();
    console.log(
      '********************** getDeviceDetails() *********************'
    );
    console.log('Component device size', component.deviceSz);
    observableMedia.asObservable().subscribe((change: MediaChange[]) => {
      const res: any = change;
      const finalRes: string = res['mqAlias'];
      console.log('new res spec', finalRes);
      expect(finalRes).toEqual('xl');
    });
  });
});
