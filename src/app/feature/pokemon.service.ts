import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map, pluck } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  constructor(private http: HttpClient) {}

  getPokemonDetails(): Observable<TPokeMonDetails[]> {
    return this.http.get(environment.baseUrl + environment.maxLimit).pipe(
      pluck('results'),
      map((result) => this.transformData(result as TPokeMonServerRes[])),
      catchError((err) => this.handleError(err))
    );
  }
  transformData(result: TPokeMonServerRes[]): TPokeMonDetails[] {
    console.log(result);
    let finalResult: TPokeMonDetails[] = [];
    result.forEach((items) => {
      const filterId = items.url.split('/');
      finalResult.push({
        id: filterId[filterId.length - 2],
        name: items.name,
      });
    });
    return finalResult;
  }

  handleError(error: any) {
    console.log('Error');
    console.log(error);
    return throwError(() => error);
  }
}

export type TPokeMonDetails = {
  id: string;
  name: string;
};

export type TPokeMonServerRes = {
  name: string;
  url: string;
};
