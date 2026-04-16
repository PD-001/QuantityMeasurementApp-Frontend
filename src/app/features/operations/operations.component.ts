import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { MeasurementService } from '../../core/services/measurement.service';
import { UNIT_GROUPS, Quantity } from '../../shared/models/measurement.model';

type TabName = 'compare' | 'convert' | 'add' | 'subtract' | 'divide';

interface OperationState {
  val1: number | null;
  unit1: string;
  val2: number | null;
  unit2: string;
  targetUnit: string;
  result: string;
  alert: string;
  alertType: 'error' | 'success' | 'info';
  loading: boolean;
  showResult: boolean;
}

function freshState(): OperationState {
  return { val1: null, unit1: '', val2: null, unit2: '', targetUnit: '', result: '', alert: '', alertType: 'error', loading: false, showResult: false };
}

@Component({
    selector: 'app-operations',
    imports: [CommonModule, FormsModule, NavbarComponent],
    templateUrl: './operations.component.html'
})
export class OperationsComponent implements OnInit {
  activeTab: TabName = 'compare';
  unitGroups = UNIT_GROUPS;
  tabs: TabName[] = ['compare', 'convert', 'add', 'subtract', 'divide'];

  compare = freshState();
  convert = freshState();
  add = freshState();
  subtract = freshState();
  divide = freshState();

  constructor(private measurementService: MeasurementService) {}

  ngOnInit(): void {}

  setTab(tab: TabName): void {
    this.activeTab = tab;
  }

  private validate(val: number | null, unit: string, label: string, state: OperationState): boolean {
    if (val === null || isNaN(val)) {
      state.alert = `${label} value is required.`;
      state.alertType = 'error';
      return false;
    }
    if (!unit) {
      state.alert = `${label} unit is required.`;
      state.alertType = 'error';
      return false;
    }
    return true;
  }

  private q(val: number | null, unit: string): Quantity {
    return { value: val as number, unit };
  }

  doCompare(): void {
    const s = this.compare;
    s.alert = ''; s.showResult = false;
    if (!this.validate(s.val1, s.unit1, 'Quantity 1', s)) return;
    if (!this.validate(s.val2, s.unit2, 'Quantity 2', s)) return;
    s.loading = true;
    this.measurementService.compareQuantities(this.q(s.val1, s.unit1), this.q(s.val2, s.unit2)).subscribe(res => {
      s.loading = false;
      if (res.ok) {
        const equal = res.data.result === true || res.data.result === 'true';
        s.result = equal ? 'Yes, they are equal' : 'No, they are not equal';
        s.showResult = true;
      } else {
        s.alert = (res.data as any)?.message || 'Operation failed.';
        s.alertType = 'error';
      }
    });
  }

  doConvert(): void {
    const s = this.convert;
    s.alert = ''; s.showResult = false;
    if (!this.validate(s.val1, s.unit1, 'Quantity', s)) return;
    if (!s.targetUnit) { s.alert = 'Target unit is required.'; s.alertType = 'error'; return; }
    s.loading = true;
    this.measurementService.convertQuantity(this.q(s.val1, s.unit1), s.targetUnit).subscribe(res => {
      s.loading = false;
      if (res.ok) {
        s.result = String(res.data.result ?? JSON.stringify(res.data));
        s.showResult = true;
      } else {
        s.alert = (res.data as any)?.message || 'Conversion failed.';
        s.alertType = 'error';
      }
    });
  }

  doAdd(): void {
    const s = this.add;
    s.alert = ''; s.showResult = false;
    if (!this.validate(s.val1, s.unit1, 'Quantity 1', s)) return;
    if (!this.validate(s.val2, s.unit2, 'Quantity 2', s)) return;
    s.loading = true;
    this.measurementService.addQuantities(this.q(s.val1, s.unit1), this.q(s.val2, s.unit2)).subscribe(res => {
      s.loading = false;
      if (res.ok) {
        s.result = String(res.data.result ?? JSON.stringify(res.data));
        s.showResult = true;
      } else {
        s.alert = (res.data as any)?.message || 'Addition failed.';
        s.alertType = 'error';
      }
    });
  }

  doSubtract(): void {
    const s = this.subtract;
    s.alert = ''; s.showResult = false;
    if (!this.validate(s.val1, s.unit1, 'Quantity 1', s)) return;
    if (!this.validate(s.val2, s.unit2, 'Quantity 2', s)) return;
    s.loading = true;
    this.measurementService.subtractQuantities(this.q(s.val1, s.unit1), this.q(s.val2, s.unit2)).subscribe(res => {
      s.loading = false;
      if (res.ok) {
        s.result = String(res.data.result ?? JSON.stringify(res.data));
        s.showResult = true;
      } else {
        s.alert = (res.data as any)?.message || 'Subtraction failed.';
        s.alertType = 'error';
      }
    });
  }

  doDivide(): void {
    const s = this.divide;
    s.alert = ''; s.showResult = false;
    if (!this.validate(s.val1, s.unit1, 'Dividend', s)) return;
    if (!this.validate(s.val2, s.unit2, 'Divisor', s)) return;
    s.loading = true;
    this.measurementService.divideQuantities(this.q(s.val1, s.unit1), this.q(s.val2, s.unit2)).subscribe(res => {
      s.loading = false;
      if (res.ok) {
        s.result = String(res.data.result ?? res.data);
        s.showResult = true;
      } else {
        s.alert = (res.data as any)?.message || 'Division failed.';
        s.alertType = 'error';
      }
    });
  }
}
