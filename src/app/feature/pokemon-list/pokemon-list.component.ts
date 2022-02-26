import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PokemonService, TPokeMonDetails } from '../pokemon.service';

@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.scss'],
})
export class PokemonListComponent implements OnInit {
  public pokemonData$: Observable<TPokeMonDetails[]> | undefined;
  public imageBaseUrl = environment.imageUrl;
  constructor(private pokemonService: PokemonService) {}

  ngOnInit(): void {
    this.pokemonData$ = this.pokemonService.getPokemonDetails();
  }
}
