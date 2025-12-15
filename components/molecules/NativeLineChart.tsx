/**
 * Pure React Native line chart - fixed version
 */

import { useState } from 'react';
import { View, Text, Dimensions, StyleSheet, LayoutChangeEvent } from 'react-native';
import { ChartDataPoint } from '@/types/chart';
import { useThemeColor } from '@/hooks/use-theme-color';

interface NativeLineChartProps {
  data: ChartDataPoint[];
  height?: number;
  width?: number;
  lineColor?: string;
  pointColor?: string;
}

const { width: screenWidth } = Dimensions.get('window');

export function NativeLineChart({
  data,
  height = 250,
  width: propWidth = screenWidth - 40,
  lineColor,
  pointColor,
}: NativeLineChartProps) {
  const textColor = useThemeColor({}, 'text');
  const defaultLineColor = useThemeColor({}, 'tint');
  const [dimensions, setDimensions] = useState({ width: propWidth, height });

  if (!data || data.length === 0) {
    return (
      <View style={[styles.container, { height }]}>
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: textColor }]}>
            Aucune donnée à afficher
          </Text>
        </View>
      </View>
    );
  }

  const padding = 40;
  const chartWidth = dimensions.width - padding * 2;
  const chartHeight = dimensions.height - padding * 2;

  // Calculate min and max values
  const values = data.map(d => d.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const valueRange = maxValue - minValue || 1;

  // Calculate point positions with proper bounds
  const points = data.map((point, index) => {
    // X position: distribute evenly across chart width
    const x = padding + (index / (data.length - 1)) * chartWidth;
    
    // Y position: normalize value to chart height
    const normalizedValue = (point.value - minValue) / valueRange;
    const y = padding + chartHeight - (normalizedValue * chartHeight);
    
    return { x, y, value: point.value };
  });

  return (
    <View 
      style={[styles.container, { height, width: propWidth }]}
      onLayout={(e: LayoutChangeEvent) => {
        const { width, height } = e.nativeEvent.layout;
        setDimensions({ width, height });
      }}
    >
      {/* Chart area with proper bounds */}
      <View style={[styles.chartArea, { 
        width: dimensions.width, 
        height: dimensions.height 
      }]}>
        {/* Grid lines */}
        {Array.from({ length: 5 }).map((_, i) => {
          const y = padding + (i * chartHeight) / 4;
          return (
            <View
              key={`h-${i}`}
              style={[
                styles.gridLine,
                {
                  left: padding,
                  top: y,
                  width: chartWidth,
                },
              ]}
            />
          );
        })}

        {/* Vertical grid lines */}
        {Array.from({ length: 6 }).map((_, i) => {
          const x = padding + (i * chartWidth) / 5;
          return (
            <View
              key={`v-${i}`}
              style={[
                styles.gridLine,
                {
                  left: x,
                top: padding,
                height: chartHeight,
                width: 1,
              },
              ]}
            />
          );
        })}

        {/* Axes */}
        <View style={[styles.axis, styles.verticalAxis, { 
          left: padding, 
          top: padding, 
          height: chartHeight 
        }]} />
        <View style={[styles.axis, styles.horizontalAxis, { 
          left: padding, 
          top: padding + chartHeight, 
          width: chartWidth 
        }]} />

        {/* Simple approach: connect dots with a path using absolute positioning */}
        {points.length > 1 && (
          <View style={styles.lineContainer}>
            {points.map((point, index) => {
              if (index === 0) return null;
              
              const prevPoint = points[index - 1];
              if (!prevPoint) return null;
              
              // Calculate line segment properties
              const dx = point.x - prevPoint.x;
              const dy = point.y - prevPoint.y;
              const length = Math.sqrt(dx * dx + dy * dy);
              const angle = Math.atan2(dy, dx) * (180 / Math.PI);
              
              return (
                <View
                  key={`line-${index}`}
                  style={[
                    styles.lineSegment,
                    {
                      position: 'absolute',
                      left: prevPoint.x,
                      top: prevPoint.y,
                      width: length,
                      height: 2,
                      backgroundColor: lineColor || defaultLineColor,
                      transformOrigin: 'left center',
                      transform: [{ rotate: `${angle}deg` }],
                    },
                  ]}
                />
              );
            })}
          </View>
        )}

        {/* Data points */}
        {points.map((point, index) => (
          <View
            key={index}
            style={[
              styles.dataPoint,
              {
                position: 'absolute',
                left: point.x - 4,
                top: point.y - 4,
                backgroundColor: pointColor || lineColor || defaultLineColor,
              },
            ]}
          >
            <View style={styles.dataPointInner} />
          </View>
        ))}

        {/* Y-axis labels */}
        <View style={styles.yAxisLabels}>
          {Array.from({ length: 5 }).map((_, i) => {
            const value = maxValue - (i * valueRange) / 4;
            const y = padding + (i * chartHeight) / 4;
            return (
              <Text 
                key={i} 
                style={[
                  styles.axisLabel, 
                  { 
                    color: textColor, 
                    position: 'absolute',
                    top: y - 8,
                    right: chartWidth + padding + 5,
                  }
                ]}
              >
                {value.toFixed(1)}
              </Text>
            );
          })}
        </View>

        {/* X-axis labels */}
        <View style={[
          styles.xAxisLabels, 
          { 
            position: 'absolute',
            left: padding,
            bottom: 5,
            width: chartWidth,
          }
        ]}>
          <Text style={[styles.axisLabel, { color: textColor }]}>
            Début
          </Text>
          <Text style={[styles.axisLabel, { color: textColor }]}>
            {data.length} points
          </Text>
          <Text style={[styles.axisLabel, { color: textColor }]}>
            Fin
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    opacity: 0.6,
  },
  chartArea: {
    position: 'relative',
  },
  gridLine: {
    position: 'absolute',
    backgroundColor: '#e0e0e0',
    opacity: 0.3,
  },
  axis: {
    position: 'absolute',
    backgroundColor: '#666',
  },
  verticalAxis: {
    width: 1,
  },
  horizontalAxis: {
    height: 1,
  },
  lineContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  lineSegment: {
    // Will be positioned absolutely
  },
  dataPoint: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dataPointInner: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#fff',
  },
  yAxisLabels: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 40,
  },
  xAxisLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  axisLabel: {
    fontSize: 10,
  },
});