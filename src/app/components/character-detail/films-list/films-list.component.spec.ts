import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FilmsListComponent } from './films-list.component';

describe('FilmsListComponent', () => {
  let component: FilmsListComponent;
  let fixture: ComponentFixture<FilmsListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FilmsListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FilmsListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.films).toBeUndefined(); // Initially, films should be undefined
    expect(component.tableColumns.length).toBe(5); // Check number of columns
    expect(component.tableColumns).toEqual([
      'title',
      'episode_id',
      'release_date',
      'director',
      'producer',
    ]); // Check column names
  });

  it('should receive input films', () => {
    const mockFilms = [
      {
        title: 'A New Hope',
        episode_id: 4,
        release_date: '1977-05-25',
        director: 'George Lucas',
        producer: 'Gary Kurtz',
      },
      {
        title: 'The Empire Strikes Back',
        episode_id: 5,
        release_date: '1980-05-21',
        director: 'Irvin Kershner',
        producer: 'Gary Kurtz',
      },
    ];

    component.films = mockFilms;
    fixture.detectChanges(); // Trigger change detection

    expect(component.films.length).toBe(2);
    expect(component.films[0].title).toBe('A New Hope');
    expect(component.films[1].title).toBe('The Empire Strikes Back');
  });
});
