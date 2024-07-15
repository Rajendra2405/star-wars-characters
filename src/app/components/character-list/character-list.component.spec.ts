import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CharacterListComponent } from './character-list.component';
import { StarWarsService } from '../../services/star-wars.service';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

describe('CharacterListComponent', () => {
  let component: CharacterListComponent;
  let fixture: ComponentFixture<CharacterListComponent>;
  let starWarsService: jasmine.SpyObj<StarWarsService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const starWarsServiceSpy = jasmine.createSpyObj('StarWarsService', [
      'getCharacters',
    ]);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      declarations: [CharacterListComponent],
      providers: [
        { provide: StarWarsService, useValue: starWarsServiceSpy },
        { provide: Router, useValue: routerSpy },
        FormBuilder,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CharacterListComponent);
    component = fixture.componentInstance;
    starWarsService = TestBed.inject(
      StarWarsService
    ) as jasmine.SpyObj<StarWarsService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load state from localStorage on init', () => {
    spyOn(localStorage, 'getItem').and.returnValue(
      JSON.stringify({ pageIndex: 1, pageSize: 20, filterValue: 'Luke' })
    );

    component.loadState();

    expect(component.pageIndex).toBe(1);
    expect(component.pageSize).toBe(20);
    expect(component.filterValue).toBe('Luke');
  });

  it('should load characters on ngAfterViewInit', () => {
    starWarsService.getCharacters.and.returnValue(
      of({ results: [], count: 0 })
    );
    component.ngAfterViewInit();

    expect(starWarsService.getCharacters).toHaveBeenCalledWith(1);
  });

  it('should handle error when loading characters', () => {
    starWarsService.getCharacters.and.returnValue(
      throwError('Error fetching data')
    );

    component.loadCharacters(0, 10);

    expect(component.loading).toBeFalse(); // should stop loading on error
  });

  it('should filter characters', () => {
    component.characters = [
      { name: 'Luke Skywalker' },
      { name: 'Darth Vader' },
    ];

    component.applyFilter('Luke');

    expect(component.filteredCharacters.length).toBe(1);
    expect(component.filteredCharacters[0].name).toBe('Luke Skywalker');
  });

  it('should toggle favorites', () => {
    const character = { name: 'Luke Skywalker', favorite: false };
    spyOn(localStorage, 'setItem');
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify([]));

    component.toggleFavorite(character, new Event('click'));

    expect(character.favorite).toBeTrue();
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'favorites',
      JSON.stringify(['Luke Skywalker'])
    );
  });

  it('should navigate to character details', () => {
    const character = { url: 'https://swapi.dev/api/people/1/' };

    component.showCharacterDetails(character);

    expect(router.navigate).toHaveBeenCalledWith(['/characters/', '1']);
  });
});
