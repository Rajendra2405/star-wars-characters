import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-films-list',
  templateUrl: './films-list.component.html',
  styleUrls: ['./films-list.component.scss'],
})
export class FilmsListComponent implements OnInit {
  @Input() films: any[];
  subscription: Subscription;
  tableColumns = [
    'title',
    'episode_id',
    'release_date',
    'director',
    'producer',
  ];

  constructor() {}

  ngOnInit() {
  }

}
