export interface Quantity {
  value: number;
  unit: string;
}

export interface Measurement {
  id?: string;
  operationType: 'COMPARE' | 'CONVERT' | 'ADD' | 'SUBTRACT' | 'DIVIDE';
  operand1Value?: number;
  operand1Unit?: string;
  operand2Value?: number;
  operand2Unit?: string;
  resultValue?: number | string;
  resultUnit?: string;
  success: boolean;
  errorMessage?: string;
}

export interface ApiResponse<T = unknown> {
  ok: boolean;
  status: number;
  data: T;
}

export interface AuthResponse {
  token: string;
  error?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  picture?: string;
  provider?: string;
}

export interface OperationResult {
  result: string | number | boolean;
}

export const UNITS: Record<string, string[]> = {
  LENGTH: ['FEET', 'INCHES', 'YARDS', 'CENTIMETERS'],
  WEIGHT: ['KILOGRAM', 'GRAM', 'POUND'],
  VOLUME: ['LITRE', 'MILLILITRE', 'GALLON'],
  TEMPERATURE: ['CELSIUS', 'FAHRENHEIT'],
};

export const UNIT_GROUPS = Object.entries(UNITS).map(([group, units]) => ({
  group,
  units: units.map(u => ({ value: u, label: u.charAt(0) + u.slice(1).toLowerCase() }))
}));
