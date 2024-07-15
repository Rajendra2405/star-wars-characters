import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { StarWarsService } from '../../services/star-wars.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-character-list',
  templateUrl: './character-list.component.html',
  styleUrls: ['./character-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CharacterListComponent implements OnInit {
  characters: any[] = [];
  totalCharacters = 0;
  pageSize = 10;
  pageIndex = 0;
  searchForm: FormGroup;
  displayedColumns: string[] = [
    'favorite',
    'name',
    'gender',
    'birthyear',
    'skin_color',
    'eye_color',
  ];

  subscription: Subscription;
  dataSource = new MatTableDataSource<any>();
  loading: boolean = true;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  filterValue: string = '';
  filteredCharacters: any[] = [];
  constructor(
    private starWarsService: StarWarsService,
    private router: Router,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // this.loadCharacters(this.pageIndex, this.pageSize);
  }
  ngAfterViewInit(): void {
    this.paginator.pageIndex = this.pageIndex;
    this.loadState();
    this.loadCharacters(this.pageIndex, this.pageSize);
    this.cdRef.detectChanges();
  }
  ngAfterViewChecked(): void {
    if (this.paginator) {
      this.paginator.pageIndex = this.pageIndex;
    }
  }
  loadFavorites(): void {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    this.characters.forEach((character) => {
      character.favorite = favorites.includes(character.name);
    });
  }

  toggleFavorite(character: any, event: Event): void {
    event.stopPropagation();
    character.favorite = !character.favorite;

    let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    if (character.favorite) {
      favorites.push(character.name);
    } else {
      favorites = favorites.filter((fav: any) => fav !== character.name);
    }

    localStorage.setItem('favorites', JSON.stringify(favorites));
  }

  isFavorite(character: any): boolean {
    return character.favorite;
  }

  loadState(): void {
    const savedState = JSON.parse(
      localStorage.getItem('characterListState') || '{}'
    );
    this.pageIndex = savedState.pageIndex || 0;
    this.pageSize = savedState.pageSize || 10;
     this.filterValue = savedState.filterValue || '';
     if (this.filterValue) {
       // If there is a saved filter value, apply it
       this.applyFilter(this.filterValue);
     }
  }

  loadCharacters(pageIndex: number, pageSize: number): void {
    this.loading = true;
    console.log('Loading characters for page:', pageIndex + 1);
    this.starWarsService.getCharacters(pageIndex + 1).subscribe(
      (data) => {
        this.characters = data.results;
        this.filteredCharacters = this.characters;

        this.totalCharacters = data.count; // Set the total count from the API response
        console.log('Total characters:', this.totalCharacters);
        console.log('Characters data:', this.characters);
        this.loading = false; // Data has been loaded, stop showing the loading spinner
        this.applyFilter(this.filterValue);
        this.loadFavorites();
        this.cdRef.detectChanges();
      },
      (error) => {
        this.loading = false; // In case of an error, stop showing the loading spinner
        console.error('Error fetching data', error);
      }
    );
  }
  applyFilter(filterValue: string): void {
    console.log(filterValue);
    this.filterValue = filterValue.trim().toLowerCase();
    this.filteredCharacters = this.characters.filter((character) =>
     
      character.name.toLowerCase().includes(this.filterValue)
    );
     console.log(this.filteredCharacters);
    this.saveState();
  }
  saveState(): void {
    const state = {
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
      filterValue: this.filterValue,
    };
    console.log(state);
    localStorage.setItem('characterListState', JSON.stringify(state));
  }
  onPageChange(event: PageEvent) {
    this.filterValue = ''; 
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    
    this.saveState();
    this.loadCharacters(this.pageIndex, this.pageSize);
  }

  showCharacterDetails(character: any) {
    const urlSegments = character.url.split('/');
    this.starWarsService.selectedCharacter = character;
    this.router.navigate(['/characters/', urlSegments[urlSegments.length - 2]]);
  }
}
