import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  fromEvent,
  tap,
} from 'rxjs';
import { environment } from 'src/environments/environment';
import { PokemonService, TPokeMonDetails } from '../pokemon.service';

@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.scss'],
})
export class PokemonListComponent implements OnInit {
  @ViewChild('searchPokemon') searchPokemon!: ElementRef;
  public pokemonData!: TPokeMonDetails[];
  private orginalData!: TPokeMonDetails[];
  public imageBaseUrl = environment.imageUrl;
  constructor(private pokemonService: PokemonService) {}

  ngOnInit(): void {
    this.pokemonService
      .getPokemonDetails()
      .subscribe(
        (res: TPokeMonDetails[]) => (
          (this.orginalData = res), (this.pokemonData = this.orginalData)
        )
      );
  }
  ngAfterViewInit() {
    fromEvent(this.searchPokemon.nativeElement, 'keyup')
      .pipe(
        filter(Boolean),
        debounceTime(700),
        distinctUntilChanged(),
        tap((text) => {
          console.log('Value enter ' + this.searchPokemon.nativeElement.value);

          this.pokemonData = this.pokemonData.filter((data) =>
            data.name
              .toLowerCase()
              .includes(this.searchPokemon.nativeElement.value)
          );
          if (this.searchPokemon.nativeElement.value === '')
            this.pokemonData = this.orginalData;
        })
      )
      .subscribe();
  }
}
