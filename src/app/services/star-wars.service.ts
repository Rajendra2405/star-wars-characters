import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Character {
  id: number;
  name: string;
  height: string;
  mass: string;
  hair_color: string;
  skin_color: string;
  eye_color: string;
  birth_year: string;
  gender: string;
  homeworld: string;
  films: string[];
}

interface ApiResponse {
  count: number;
  results: Character[];
}

@Injectable({
  providedIn: 'root',
})
export class StarWarsService {
  private apiUrl = 'https://swapi.dev/api/people/';
  selectedCharacter: Character | null = null;

  constructor(private http: HttpClient) {}

  getCharacters(page=1): Observable<ApiResponse> {
    let url = `${this.apiUrl}?page=${page}`;
    // if (search) {
    //   url += `&search=${search}`;
    // }
    return this.http.get<ApiResponse>(url);
  }

  getCharacter(id: number): Observable<Character> {
    return this.http.get<Character>(`${this.apiUrl}${id}/`);
  }
  getHomeworld(url: string): Observable<string> {
    return this.http.get<any>(url).pipe(map((res) => res.name));
  }

  getFilm(url: string): Observable<any> {
    return this.http.get<any>(url);
  }
  
}
