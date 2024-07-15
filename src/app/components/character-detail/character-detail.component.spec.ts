import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CharacterDetailComponent } from './character-detail.component';
import { ActivatedRoute } from '@angular/router';
import { StarWarsService } from '../../services/star-wars.service';
import { of } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';

describe('CharacterDetailComponent', () => {
  let component: CharacterDetailComponent;
  let fixture: ComponentFixture<CharacterDetailComponent>;
  let starWarsService: jasmine.SpyObj<StarWarsService>;

  beforeEach(() => {
    const starWarsServiceSpy = jasmine.createSpyObj('StarWarsService', [
      'getCharacter',
      'getHomeworld',
      'getFilm',
    ]);

    TestBed.configureTestingModule({
      declarations: [CharacterDetailComponent],
      providers: [
        { provide: StarWarsService, useValue: starWarsServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => '1' } } },
        },
        ChangeDetectorRef,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CharacterDetailComponent);
    component = fixture.componentInstance;
    starWarsService = TestBed.inject(
      StarWarsService
    ) as jasmine.SpyObj<StarWarsService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load character details on init', () => {
    const mockCharacter = {
      id: 1,
      name: 'Luke Skywalker',
      height: '172',
      mass: '77',
      hair_color: 'blond',
      skin_color: 'fair',
      eye_color: 'blue',
      birth_year: '19BBY',
      gender: 'male',
      homeworld: 'http://swapi.dev/api/planets/1/',
      films: ['http://swapi.dev/api/films/1/', 'http://swapi.dev/api/films/2/'],
    };

    starWarsService.getCharacter.and.returnValue(of(mockCharacter));
    starWarsService.getHomeworld.and.returnValue(
      of('http://swapi.dev/api/planets/1/')
    ); // Return URL as string
    starWarsService.getFilm.and.returnValue(of({ title: 'A New Hope' }));

    component.ngOnInit();

    expect(starWarsService.getCharacter).toHaveBeenCalledWith(1);
    expect(component.character).toEqual(mockCharacter);

    // Check if homeworld was fetched
    expect(starWarsService.getHomeworld).toHaveBeenCalledWith(
      mockCharacter.homeworld
    );

    // Check if films were fetched
    expect(starWarsService.getFilm).toHaveBeenCalledTimes(
      mockCharacter.films.length
    );
    expect(component.films).toEqual([{ title: 'A New Hope' }]); // Adjust based on number of films
  });
});
