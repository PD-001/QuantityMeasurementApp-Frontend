import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { MeasurementService } from '../../core/services/measurement.service';
import { Measurement } from '../../shared/models/measurement.model';

type FilterType = 'ALL' | 'COMPARE' | 'CONVERT' | 'ADD' | 'SUBTRACT' | 'DIVIDE';

@Component({
    selector: 'app-dashboard',
    imports: [CommonModule, NavbarComponent],
    templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  allMeasurements: Measurement[] = [];
  filteredMeasurements: Measurement[] = [];
  currentFilter: FilterType = 'ALL';

  alert = '';
  alertType: 'success' | 'error' | 'info' = 'info';
  loading = true;

  filters: FilterType[] = ['ALL', 'COMPARE', 'CONVERT', 'ADD', 'SUBTRACT', 'DIVIDE'];

  get statTotal(): number { return this.allMeasurements.length; }
  get statCompare(): number { return this.allMeasurements.filter(m => m.operationType === 'COMPARE').length; }
  get statConvert(): number { return this.allMeasurements.filter(m => m.operationType === 'CONVERT').length; }
  get statArithmetic(): number { return this.allMeasurements.filter(m => ['ADD','SUBTRACT','DIVIDE'].includes(m.operationType)).length; }

  constructor(private measurementService: MeasurementService) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.loading = true;
    this.alert = '';
    this.measurementService.getAllMeasurements().subscribe(res => {
      this.loading = false;
      if (res.ok) {
        this.allMeasurements = res.data || [];
        this.applyFilter(this.currentFilter);
      } else {
        this.alert = 'Failed to load measurements.';
        this.alertType = 'error';
      }
    });
  }

  setFilter(filter: FilterType): void {
    this.currentFilter = filter;
    this.applyFilter(filter);
  }

  private applyFilter(filter: FilterType): void {
    this.filteredMeasurements = filter === 'ALL'
      ? this.allMeasurements
      : this.allMeasurements.filter(m => m.operationType === filter);
  }

  confirmDeleteAll(): void {
    if (!confirm('Delete all measurements? This cannot be undone.')) return;
    this.measurementService.deleteAllMeasurements().subscribe(res => {
      if (res.ok) {
        this.alert = 'All measurements deleted.';
        this.alertType = 'success';
        this.allMeasurements = [];
        this.filteredMeasurements = [];
      } else {
        this.alert = 'Failed to delete measurements.';
        this.alertType = 'error';
      }
    });
  }

  emptyMessage(): string {
    return this.currentFilter === 'ALL'
      ? 'No measurements yet. Go to Operations to get started.'
      : `No ${this.currentFilter.toLowerCase()} operations yet.`;
  }
}
