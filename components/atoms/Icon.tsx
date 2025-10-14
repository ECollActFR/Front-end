import React from 'react';
import { Feather } from '@expo/vector-icons';
import { StyleProp, ViewStyle } from 'react-native';

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

export default function Icon({ name, size = 20, color = '#000', style }: IconProps) {
  return <Feather name={name} size={size} color={color} style={style} />;
}
