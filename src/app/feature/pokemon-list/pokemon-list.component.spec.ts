import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of, tap } from 'rxjs';
import { PokemonService } from '../pokemon.service';

import { PokemonListComponent } from './pokemon-list.component';
import { MediaObserver } from '@angular/flex-layout';
import { By } from '@angular/platform-browser';

let mockFlex = jasmine.createSpyObj({
  asObservable() {
    return of({
      mqAlias: 'xl',
    });
  },
  isActive: true,
});

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

  xit('getDeviceDetails() should set device Alias', () => {
    console.log(
      '********************** getDeviceDetails() *********************'
    );
    component.ngAfterViewInit();
    observableMedia.asObservable().subscribe((res) => {
      console.log(
        '********************** checking observable *********************'
      );
      expect(component.deviceSz).toEqual(res[0].mqAlias);
    });
  });

  xit('onSearchPokemon() result should make a copy into originalData and pokeMonData', () => {
    console.log(' *********** onSearchPokemon() ************');
    console.log(' *********** Fixture detect changes ************');
    const mock = [
      { name: 'dragonite', id: '149' },
      { name: 'mewtwo', id: '150' },
    ];
    // component.pokemonData = mock;
    //component.orginalData = mock;
    component.searchPokemon.nativeElement.value = 'mewtwo';
    const event = new KeyboardEvent('keyup', {
      bubbles: true,
      cancelable: true,
      shiftKey: false,
    });
    fixture.detectChanges();
    console.log('  component.pokemonData', component.pokemonData);
    let element = fixture.debugElement.query(By.css('input'));
    console.log('input pokemon', element);
    element.triggerEventHandler('keypress', event);
    console.log('  input', element.nativeElement);

    console.log(' nameInput.nativeElement.value ', element.nativeElement.value);

    console.log('Pokemondata', component.pokemonData);
    console.log('original Data', component.orginalData);
    expect(
      fixture.debugElement.query(By.css('input')).nativeElement.innerText
    ).toEqual('mewtwo');
  });

  function createEnterKeyPress() {
    return { keyCode: 13, preventDefault: jasmine.createSpy('preventDefault') };
  }
});
