import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StarWarsService } from '../../services/star-wars.service';
import { Observable, forkJoin, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

@Component({
  selector: 'app-character-detail',
  templateUrl: './character-detail.component.html',
  styleUrls: ['./character-detail.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CharacterDetailComponent implements OnInit {
  character: any;
  homeworld: any;
  films: any;
  tableColumns = [
    'title',
    'episode_id',
    'release_date',
    'director',
    'producer',
  ];

  constructor(
    private route: ActivatedRoute,
    private starWarsService: StarWarsService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;

    this.starWarsService.getCharacter(id).subscribe((character) => {
      this.character = character;

      // Fetch homeworld
      this.starWarsService
        .getHomeworld(character.homeworld)
        .subscribe((homeworld) => {
          this.homeworld = homeworld;
        });

      // Fetch films
      const filmObservables = character.films.map((filmUrl) =>
        this.starWarsService.getFilm(filmUrl)
      );

      forkJoin(filmObservables).subscribe((filmsData) => {
        this.films = filmsData;
        console.log(this.films);
         this.cdRef.detectChanges();
      });
     
    });
  }
  ngAfterViewInit(): void {}
}
