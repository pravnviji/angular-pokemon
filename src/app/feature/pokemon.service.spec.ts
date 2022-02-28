import { TestBed, getTestBed } from '@angular/core/testing';

import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import {
  PokemonService,
  TPokeMonDetails,
  TPokeMonServerRes,
} from './pokemon.service';
import { HttpErrorResponse } from '@angular/common/http';

const dummyPokemonData = {
  count: 1126,
  next: 'https://pokeapi.co/api/v2/pokemon?offset=150&limit=150',
  previous: null,
  results: [
    {
      name: 'dragonite',
      url: 'https://pokeapi.co/api/v2/pokemon/149/',
    },
    {
      name: 'mewtwo',
      url: 'https://pokeapi.co/api/v2/pokemon/150/',
    },
  ],
};
describe('PokemonService', () => {
  let serviceTest: PokemonService;
  let httpMock: HttpTestingController;
  let injector: TestBed;

  const baseUrl = 'https://pokeapi.co/api/v2/pokemon?limit=';
  const maxLimit = 150;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PokemonService],
    });

    injector = getTestBed();
    serviceTest = injector.get(PokemonService);
    httpMock = injector.get(HttpTestingController);
  });
  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(serviceTest).toBeTruthy();
  });
  it('getPokemonDetails() should call valid URL with maxLimit param', () => {
    serviceTest.getPokemonDetails().subscribe();
    const reqMock = httpMock.expectOne(
      (req) => req.method === 'GET' && req.url === baseUrl + maxLimit
    );
    expect(reqMock.request.method).toBe('GET');
    reqMock.flush(dummyPokemonData);
  });

  it('getPokemonDetails() should call handleError()', () => {
    spyOn(serviceTest as any, 'handleError').and.callThrough();
    const errorData: HttpErrorResponse = new HttpErrorResponse({
      error: {},
      status: 500,
      url: baseUrl + maxLimit,
      statusText: 'Bad Request',
    });
    serviceTest.getPokemonDetails().subscribe(
      () => fail('should error'),
      () => {
        expect(serviceTest.handleError).toHaveBeenCalled();
      }
    );
    const reqMock = httpMock.expectOne(
      (req) => req.method === 'GET' && req.url === baseUrl + maxLimit
    );

    reqMock.flush(errorData);
  });

  it('transformData() should return transform Data and result should be equal ', () => {
    const res: TPokeMonDetails[] = [
      { name: 'dragonite', id: '149' },
      { name: 'mewtwo', id: '150' },
    ];
    const req = serviceTest.transformData(
      dummyPokemonData.results as TPokeMonServerRes[]
    );
    expect(req).toEqual(res);
  });
  it('handleError() should handle error inside ', () => {
    const errorData: HttpErrorResponse = new HttpErrorResponse({
      error: {},
      status: 500,
      url: baseUrl + maxLimit,
      statusText: 'Bad Request',
    });

    const req = serviceTest.handleError(errorData);
    expect(req).toThrowError;
  });
});
