/**
 * Chart data service for fetching and transforming room historical data
 */

import { 
  ChartDataPoint, 
  ChartDataResponse, 
  AggregatedDataPoint,
  ChartAggregationOptions,
  CaptureLast7DaysDto,
  ChartDataByType
} from '@/types/chart';

// Utility to parse sensor values like "22°C", "45%" to numeric and unit
export function parseSensorValue(value: string | undefined): { numericValue: number; unit: string } {
  if (!value) {
    return { numericValue: 0, unit: '' };
  }

  // Common patterns for sensor values
  const patterns = [
    { regex: /^(-?\d+\.?\d*)\s*°C$/, unit: '°C' },
    { regex: /^(-?\d+\.?\d*)\s*%$/, unit: '%' },
    { regex: /^(-?\d+\.?\d*)\s*ppm$/, unit: 'ppm' },
    { regex: /^(-?\d+\.?\d*)\s*lux$/, unit: 'lux' },
    { regex: /^(-?\d+\.?\d*)\s*Pa$/, unit: 'Pa' },
    { regex: /^(-?\d+\.?\d*)\s*V$/, unit: 'V' },
    { regex: /^(-?\d+\.?\d*)\s*A$/, unit: 'A' },
    { regex: /^(-?\d+\.?\d*)$/, unit: '' }, // Plain numbers
  ];

  for (const pattern of patterns) {
    if (!value) continue;
    const match = value.match(pattern.regex);
    if (match) {
      return {
        numericValue: parseFloat(match[1]),
        unit: pattern.unit
      };
    }
  }

  // Fallback: extract numbers and treat rest as unit
  if (!value) return { numericValue: 0, unit: '' };
  const numberMatch = value.match(/(-?\d+\.?\d*)/);
  if (numberMatch) {
    const numericValue = parseFloat(numberMatch[1]);
    const unit = value.replace(numberMatch[0], '').trim() || '';
    return { numericValue, unit };
  }

  // Final fallback
  return { numericValue: 0, unit: value || '' };
}

// Transform capture data to chart data points
export function transformCaptureToChartDataPoint(
  capture: any,
  sensorType: string
): ChartDataPoint | null {
  try {
    const timestamp = String(capture.createdAt || capture.dateCaptured || new Date().toISOString());
    const originalValue = String(capture.value || capture.description || '0');
    const { numericValue, unit } = parseSensorValue(originalValue);

    return {
      timestamp,
      value: numericValue,
      unit,
      sensorType,
      originalValue,
      captureId: capture.id
    };
  } catch (error) {
    console.warn('Error transforming capture to chart data point:', error, capture);
    return null;
  }
}

// Get sensor configuration
function getSensorConfig(sensorType: string) {
  const configs: Record<string, { min: number; max: number; unit: string }> = {
    'Température': { min: 15, max: 35, unit: '°C' },
    'Humidité': { min: 30, max: 80, unit: '%' },
    'CO2': { min: 400, max: 1200, unit: 'ppm' },
    'Lumière': { min: 0, max: 1000, unit: 'lux' },
    'Pression': { min: 980, max: 1050, unit: 'Pa' },
    default: { min: 0, max: 100, unit: '' }
  };
  
  return configs[sensorType] || configs.default;
}

// Generate realistic sensor values
function generateRealisticSensorValue(sensorType: string, hour: number): number {
  const config = getSensorConfig(sensorType);
  
  // Add some daily variation
  const dailyVariation = Math.sin((hour / 24) * Math.PI * 2) * 0.3;
  const randomVariation = (Math.random() - 0.5) * 0.2;
  
  const baseValue = (config!.min + config!.max) / 2;
  const range = config!.max - config!.min;
  
  return Math.round(
    baseValue + (range * (dailyVariation + randomVariation))
  );
}

// Mock data generator for development (since historical endpoints may not exist yet)
export function generateMockHistoricalData(
  roomId: number,
  sensorType: string,
  days: number,
  pointsPerDay: number = 24
): ChartDataResponse {
  const endDate = new Date();
  const startDate = new Date(endDate.getTime() - (days * 24 * 60 * 60 * 1000));
  
  const dataPoints: ChartDataPoint[] = [];
  const config = getSensorConfig(sensorType);
  
  // Generate data points for each day
  for (let day = 0; day < days; day++) {
    const currentDate = new Date(startDate.getTime() + (day * 24 * 60 * 60 * 1000));
    
    for (let hour = 0; hour < pointsPerDay; hour++) {
      const timestamp = new Date(
        currentDate.getTime() + (hour * 60 * 60 * 1000)
      ).toISOString();
      
      // Generate realistic sensor values based on sensor type
      const value = generateRealisticSensorValue(sensorType, hour);
      
      dataPoints.push({
        timestamp,
        value,
        unit: config!.unit,
        sensorType,
        originalValue: `${value}${config!.unit}`,
      });
    }
  }

  return {
    day: String(startDate.toISOString().split('T')[0]),
    dataPoints: dataPoints.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()),
    totalCount: dataPoints.length,
    hasMoreDays: days < 30, // Assume we can go back 30 days max
    dateRange: {
      start: startDate.toISOString(),
      end: endDate.toISOString()
    },
    sensorType
  };
}

// Aggregate chart data points
export function aggregateChartData(
  dataPoints: ChartDataPoint[],
  options: ChartAggregationOptions
): AggregatedDataPoint[] {
  if (dataPoints.length === 0) return [];

  const groupedData = new Map<string, ChartDataPoint[]>();

  // Group by time interval
  dataPoints.forEach(point => {
    const date = new Date(point.timestamp);
    let key: string;

    switch (options.interval) {
      case 'minute':
        key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${date.getHours()}-${date.getMinutes()}`;
        break;
      case 'hour':
        key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${date.getHours()}`;
        break;
      case 'day':
        key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
        break;
      default:
        key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${date.getHours()}`;
    }

    if (!groupedData.has(key)) {
      groupedData.set(key, []);
    }
    groupedData.get(key)!.push(point);
  });

  // Aggregate each group
  return Array.from(groupedData.entries()).map(([, points]) => {
    let aggregatedValue: number;

    switch (options.aggregationType) {
      case 'average':
        aggregatedValue = points.reduce((sum, p) => sum + p.value, 0) / points.length;
        break;
      case 'min':
        aggregatedValue = Math.min(...points.map(p => p.value));
        break;
      case 'max':
        aggregatedValue = Math.max(...points.map(p => p.value));
        break;
      case 'sum':
        aggregatedValue = points.reduce((sum, p) => sum + p.value, 0);
        break;
      case 'count':
        aggregatedValue = points.length;
        break;
      default:
        aggregatedValue = points.reduce((sum, p) => sum + p.value, 0) / points.length;
    }

    // Use first point's timestamp as representative
    const representativePoint = points[0];
    if (!representativePoint) {
      throw new Error('No representative point found in aggregation group');
    }

    return {
      timestamp: representativePoint.timestamp,
      value: Math.round(aggregatedValue * 100) / 100, // Round to 2 decimal places
      unit: representativePoint.unit || '',
      sensorType: representativePoint.sensorType || '',
      originalValue: representativePoint.originalValue || '',
      aggregatedCount: points.length
    };
  }).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
}

// Main chart service
export const chartService = {
  // Get historical data for a room (using mock data for now)
  async getRoomHistoricalData(
    roomId: number,
    sensorType: string,
    days: number = 7,
    offsetDays: number = 0
  ): Promise<ChartDataResponse> {
    console.log(`Generating mock data for room ${roomId}, sensor ${sensorType}, ${days} days, offset ${offsetDays}`);
    
    const mockData = generateMockHistoricalData(roomId, sensorType, days);
    
    // Adjust for offset days
    if (offsetDays > 0) {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - (days + offsetDays));
      
      return {
        ...mockData,
        day: String(startDate.toISOString().split('T')[0]),
        dateRange: {
          start: startDate.toISOString(),
          end: new Date(startDate.getTime() + (days * 24 * 60 * 60 * 1000)).toISOString()
        }
      };
    }

    return mockData;
  },

  // Transform raw capture data to chart format
  transformCapturesToChartData(
    captures: any[],
    sensorType: string
  ): ChartDataPoint[] {
    return captures
      .map(capture => transformCaptureToChartDataPoint(capture, sensorType))
      .filter((point): point is ChartDataPoint => point !== null)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  },

  // Get sensor color configuration
  getSensorColors(): Record<string, string> {
    return {
      'Température': '#ef4444',  // red
      'Humidité': '#3b82f6',    // blue
      'CO2': '#10b981',         // green
      'Lumière': '#f59e0b',     // amber
      'Pression': '#8b5cf6',    // purple
      default: '#6b7280'         // gray
    };
  },

  // Get available sensor types from room data
  extractSensorTypes(roomData: any): string[] {
    if (roomData.lastCapturesByType) {
      return roomData.lastCapturesByType.map((captureData: any) => String(captureData.type.name));
    }
    
    if (roomData.captureTypes) {
      return roomData.captureTypes.map((type: any) => String(type.name));
    }
    
    return [];
  },

  // Transform CaptureLast7DaysDto to ChartDataByType
  transformLast7DaysData(data: CaptureLast7DaysDto): ChartDataByType[] {
    return data.dataByType.map(typeData => {
      const chartData: ChartDataPoint[] = typeData.captures.map(capture => {
        const { numericValue, unit } = parseSensorValue(capture.value);
        return {
          timestamp: capture.dateCaptured || capture.createdAt || new Date().toISOString(),
          value: numericValue,
          unit: unit,
          sensorType: typeData.type.name,
          originalValue: capture.value,
          captureId: capture.id
        };
      });

      // Sort by timestamp
      chartData.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

      return {
        type: typeData.type,
        data: chartData,
        stats: {
          min: typeData.stats.min,
          max: typeData.stats.max,
          avg: typeData.stats.avg,
          count: typeData.count
        }
      };
    });
  }
};