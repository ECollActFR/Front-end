import React, { PropsWithChildren, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';

interface ConfigSectionProps extends PropsWithChildren {
  title: string;
  defaultOpen?: boolean;
  icon?: string; // IconSymbol name
}

export default function ConfigSection({
  title,
  children,
  defaultOpen = false,
  icon,
}: ConfigSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const cardBlue = useThemeColor({}, 'cardBlue');
  const textColor = useThemeColor({}, 'text');
  const secondaryTextColor = useThemeColor({}, 'icon');

  return (
    <View style={[styles.container, { backgroundColor: cardBlue }]}>
      <TouchableOpacity
        style={styles.header}
        onPress={() => setIsOpen(!isOpen)}
        activeOpacity={0.7}
      >
        <View style={styles.headerLeft}>
          {icon && (
            <IconSymbol
              name={icon}
              size={20}
              color={secondaryTextColor}
              style={styles.headerIcon}
            />
          )}
          <Text style={[styles.title, { color: textColor }]}>{title}</Text>
        </View>
        <IconSymbol
          name="chevron.right"
          size={18}
          color={secondaryTextColor}
          style={{
            transform: [{ rotate: isOpen ? '90deg' : '0deg' }],
          }}
        />
      </TouchableOpacity>
      {isOpen && <View style={styles.content}>{children}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 10,
  },
  headerIcon: {
    flexShrink: 0,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
});
