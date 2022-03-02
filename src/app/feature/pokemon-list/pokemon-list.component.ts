import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  fromEvent,
  Subscription,
  tap,
} from 'rxjs';
import { MediaObserver } from '@angular/flex-layout';
import { environment } from 'src/environments/environment';
import { PokemonService, TPokeMonDetails } from '../pokemon.service';

@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.scss'],
})
export class PokemonListComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('searchPokemon') searchPokemon!: ElementRef;
  public orginalData!: TPokeMonDetails[];

  public pokemonData!: TPokeMonDetails[];
  public imageBaseUrl = environment.imageUrl;
  public sub!: Subscription;
  deviceSz!: string;

  constructor(
    private pokemonService: PokemonService,
    private observableMedia: MediaObserver
  ) {}

  ngOnDestroy(): void {
    console.log('OnDestroy');
    this.sub.unsubscribe();
  }

  ngOnInit(): void {
    this.sub = this.pokemonService
      .getPokemonDetails()
      .subscribe(
        (res: TPokeMonDetails[]) => (
          (this.orginalData = res), (this.pokemonData = this.orginalData)
        )
      );
  }

  ngAfterViewInit(): void {
    this.onSearchPokemon();
    this.getDeviceDetails();
  }

  getDeviceDetails(): void {
    this.observableMedia.asObservable().subscribe((change) => {
      console.log('getting device data', change);
      this.deviceSz = change[0].mqAlias;
    });
  }

  onSearchPokemon(): void {
    this.sub = fromEvent(this.searchPokemon.nativeElement, 'keyup')
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
