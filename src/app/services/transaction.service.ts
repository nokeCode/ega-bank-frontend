import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  Transaction,
  DepotRequest,
  RetraitRequest,
  VirementRequest,
  TransactionFilter
} from '../models/transaction.model';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private apiUrl = 'http://localhost:8085/api/transactions';

  constructor(private http: HttpClient) {}

  depot(request: DepotRequest): Observable<Transaction> {
    return this.http.post<Transaction>(`${this.apiUrl}/depot`, request);
  }

  retrait(request: RetraitRequest): Observable<Transaction> {
    return this.http.post<Transaction>(`${this.apiUrl}/retrait`, request);
  }

  virement(request: VirementRequest): Observable<Transaction> {
    return this.http.post<Transaction>(`${this.apiUrl}/virement`, request);
  }

  getTransactionsByAccount(numeroCompte: string): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.apiUrl}/account/${numeroCompte}`);
  }

  getTransactionsByPeriod(filter: TransactionFilter): Observable<Transaction[]> {
    return this.http.post<Transaction[]>(`${this.apiUrl}/filter`, filter);
  }

  // ← AJOUTEZ CETTE MÉTHODE
  getAllTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(this.apiUrl).pipe(
      map(transactions => transactions.map(t => this.mapTransaction(t)))
    );
  }

  // ← AJOUTEZ CETTE MÉTHODE
  getRecentTransactions(limit: number = 5): Observable<Transaction[]> {
    return this.getAllTransactions().pipe(
      map(transactions => {
        return transactions
          .sort((a, b) => {
            const dateA = new Date(a.dateTransaction || a.date || 0).getTime();
            const dateB = new Date(b.dateTransaction || b.date || 0).getTime();
            return dateB - dateA;
          })
          .slice(0, limit);
      })
    );
  }

  // ← AJOUTEZ CETTE MÉTHODE HELPER
  private mapTransaction(t: Transaction): Transaction {
    return {
      ...t,
      type: t.typeTransaction,
      amount: t.montant,
      date: t.dateTransaction
    };
  }

  generateReleve(filter: TransactionFilter): Observable<Blob> {
    return this.http.post(`${this.apiUrl}/releve`, filter, {
      responseType: 'blob'
    });
  }
}
