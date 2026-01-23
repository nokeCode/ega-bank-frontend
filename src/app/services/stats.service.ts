// src/app/services/stats.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { WeeklyStats, DailyStats } from '../models/stats.model';

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  private apiUrl = 'http://localhost:8085/api/stats';
  private statsUpdated = new BehaviorSubject<boolean>(false);
  
  statsUpdated$ = this.statsUpdated.asObservable();

  constructor(private http: HttpClient) {}

  // Récupérer les statistiques de la semaine actuellement en cours
  getWeeklyStats(): Observable<WeeklyStats> {
    return this.http.get<WeeklyStats>(`${this.apiUrl}/weekly`);
  }

  // Récupérer les statistiques de toutes les semaines
  getAllWeeklyStats(): Observable<WeeklyStats[]> {
    return this.http.get<WeeklyStats[]>(`${this.apiUrl}/all-weeks`);
  }

  // Enregistrer les statistiques du jour à minuit
  recordDailyStats(stats: DailyStats): Observable<DailyStats> {
    return this.http.post<DailyStats>(`${this.apiUrl}/record`, stats);
  }

  // Vérifier et réinitialiser si c'est une nouvelle semaine
  checkAndResetWeek(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/check-week`);
  }

  // Charger les données fictives pour une semaine
  loadMockWeekData(): Observable<WeeklyStats> {
    return this.http.post<WeeklyStats>(`${this.apiUrl}/load-mock-data`, {});
  }

  // Émettre un signal de mise à jour des stats
  notifyStatsUpdated(): void {
    this.statsUpdated.next(true);
  }
}