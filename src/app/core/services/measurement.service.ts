import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Quantity, Measurement, OperationResult } from '../../shared/models/measurement.model';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';

const API_BASE = environment.apiUrl;

export interface ApiResult<T = unknown> {
  ok: boolean;
  status: number;
  data: T;
}

@Injectable({ providedIn: 'root' })
export class MeasurementService {
  constructor(private http: HttpClient, private auth: AuthService) {}

  private get headers(): HttpHeaders {
    const token = this.auth.getToken();
    return token
      ? new HttpHeaders({ 'Content-Type': 'application/json', Authorization: `Bearer ${token}` })
      : new HttpHeaders({ 'Content-Type': 'application/json' });
  }

  private call<T>(method: string, path: string, body?: unknown): Observable<ApiResult<T>> {
    const url = `${API_BASE}${path}`;
    const options = { headers: this.headers, observe: 'response' as const };
    let req: Observable<any>;

    if (method === 'GET') req = this.http.get<T>(url, options);
    else if (method === 'POST') req = this.http.post<T>(url, body, options);
    else if (method === 'DELETE') req = this.http.delete<T>(url, options);
    else req = this.http.get<T>(url, options);

    return req.pipe(
      map(res => ({ ok: res.ok, status: res.status, data: res.body as T })),
      catchError(err => {
        if (err.status === 401) {
          this.auth.clearToken();
          window.location.href = '/login';
        }
        return of({ ok: false, status: err.status, data: err.error });
      })
    );
  }

  getAllMeasurements(): Observable<ApiResult<Measurement[]>> {
    return this.call<Measurement[]>('GET', '/api/measurements');
  }

  deleteAllMeasurements(): Observable<ApiResult<unknown>> {
    return this.call('DELETE', '/api/measurements');
  }

  compareQuantities(q1: Quantity, q2: Quantity): Observable<ApiResult<OperationResult>> {
    return this.call<OperationResult>('POST', '/api/measurements/compare', { q1, q2 });
  }

  convertQuantity(quantity: Quantity, targetUnit: string): Observable<ApiResult<OperationResult>> {
    return this.call<OperationResult>('POST', '/api/measurements/convert', { quantity, targetUnit });
  }

  addQuantities(q1: Quantity, q2: Quantity): Observable<ApiResult<OperationResult>> {
    return this.call<OperationResult>('POST', '/api/measurements/add', { q1, q2 });
  }

  subtractQuantities(q1: Quantity, q2: Quantity): Observable<ApiResult<OperationResult>> {
    return this.call<OperationResult>('POST', '/api/measurements/subtract', { q1, q2 });
  }

  divideQuantities(q1: Quantity, q2: Quantity): Observable<ApiResult<OperationResult>> {
    return this.call<OperationResult>('POST', '/api/measurements/divide', { q1, q2 });
  }
}
