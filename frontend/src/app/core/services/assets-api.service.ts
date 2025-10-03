import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Asset, AssetStatusLabel, AssetType, Paginated } from '../../shared/models';
@Injectable({ providedIn: 'root' })
export class AssetsApiService {
  constructor(private http: HttpClient) {}
  list(
    page = 1,
    limit = 10,
    type?: AssetType,
    status?: AssetStatusLabel,
  ): Observable<Paginated<Asset>> {
    const q = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (type) q.set('type', type);
    if (status) q.set('status', status);
    return this.http.get<Paginated<Asset>>(`/assets?${q.toString()}`);
  }
  assign(assetId: string, employeeId: string): Observable<Asset> {
    return this.http.post<Asset>(`/assets/${assetId}/assign`, { employeeId });
  }
  unassign(assetId: string): Observable<Asset> {
    return this.http.post<Asset>(`/assets/${assetId}/unassign`, {});
  }
}
