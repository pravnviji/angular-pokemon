import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { FeatureRoutingModule } from './feature-routing.module';
import { PokemonListComponent } from './pokemon-list/pokemon-list.component';
import { PokemonService } from './pokemon.service';

@NgModule({
  declarations: [PokemonListComponent],
  providers: [PokemonService],
  imports: [CommonModule, FeatureRoutingModule, HttpClientModule],
})
export class FeatureModule {}
