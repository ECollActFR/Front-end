/**
 * Chart data type definitions
 */

import { CaptureType, Capture } from './room';

// Individual chart data point
export interface ChartDataPoint {
  timestamp: string;        // ISO timestamp
  value: number;           // Parsed numeric value
  unit: string;           // Unit (°C, %, etc.)
  sensorType: string;     // Type of sensor
  originalValue: string;  // Original string value ("22°C")
  captureId?: number;     // Original capture ID
}

// Response for historical data request
export interface ChartDataResponse {
  day: string;            // YYYY-MM-DD format
  dataPoints: ChartDataPoint[];
  totalCount: number;
  hasMoreDays: boolean;
  dateRange: {
    start: string;
    end: string;
  };
  sensorType: string;
}

// Progressive chart state
export interface ProgressiveChartState {
  data: ChartDataPoint[];
  loadedDays: number;
  isFetchingNextDay: boolean;
  hasNextDay: boolean;
  totalPoints: number;
  dateRange: { start: Date | null; end: Date | null };
}

// Options for progressive data loading
export interface UseChartDataProgressiveOptions {
  roomId: number;
  sensorType: string;
  startDate?: Date;
  endDate?: Date;
  initialDays?: number;        // Days to load initially (default: 7)
  daysPerLoad?: number;        // Days to load per request (default: 3)
}

// Chart rendering options
export interface ChartRenderOptions {
  height?: number;
  pointSize?: (dataPoint: ChartDataPoint) => number;
  pointColor?: (dataPoint: ChartDataPoint) => string;
  animate?: boolean;
  showGrid?: boolean;
  showAxis?: boolean;
}

// Sensor color mapping
export interface SensorColorConfig {
  [sensorType: string]: string;
}

// Chart aggregation options
export interface ChartAggregationOptions {
  interval: 'minute' | 'hour' | 'day';
  aggregationType: 'average' | 'min' | 'max' | 'sum' | 'count';
}

// Aggregated data point
export interface AggregatedDataPoint extends Omit<ChartDataPoint, 'captureId'> {
  aggregatedCount: number;  // Number of original points aggregated
}

// Chart legend item
export interface ChartLegendItem {
  sensorType: string;
  color: string;
  count: number;
  unit: string;
  range: { min: number; max: number };
}

// Capture Last 7 Days DTO (New API Response)
export interface CaptureLast7DaysDto {
  '@context': string;
  '@id': string;
  '@type': string;
  roomId: number;
  roomName: string;
  roomDescription?: string;
  dataByType: CaptureTypeData[];
  startDate: string;
  endDate: string;
  totalCount: number;
  typeCount: number;
}

export interface CaptureTypeData {
  type: CaptureType;
  captures: Capture[];
  count: number;
  stats: {
    min: number;
    max: number;
    avg: number;
    latest: Capture;
  };
}

// Transform function type
export type ChartDataByType = {
  type: CaptureType;
  data: ChartDataPoint[];
  stats: {
    min: number;
    max: number;
    avg: number;
    count: number;
  };
};

// Export for backward compatibility
export type { CaptureType };