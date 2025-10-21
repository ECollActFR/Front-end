import React from 'react';
import { Feather } from '@expo/vector-icons';
import { StyleProp, ViewStyle } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';

type IconName =
  | 'search'
  | 'users'
  | 'map-pin'
  | 'wifi'
  | 'monitor'
  | 'coffee'
  | 'chevron-right'
  | 'check';

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
}

export default function Icon({ name, size = 20, color, style }: IconProps) {
  const defaultColor = useThemeColor({}, 'icon');

  return <Feather name={name} size={size} color={color || defaultColor} style={style} />;
}
