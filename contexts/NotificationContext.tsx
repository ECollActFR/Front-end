/**
 * Global notification context for displaying app-wide messages
 */

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Text, View, StyleSheet, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type NotificationType = 'error' | 'warning' | 'success' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number;
}

interface NotificationContextType {
  showNotification: (notification: Omit<Notification, 'id'>) => void;
  hideNotification: (id: string) => void;
  clearAllNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType>({
  showNotification: () => {},
  hideNotification: () => {},
  clearAllNotifications: () => {},
});

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const insets = useSafeAreaInsets();

  const showNotification = (notification: Omit<Notification, 'id'>) => {
    // Éviter les doublons exacts (même titre + message)
    const isDuplicate = notifications.some(
      n => n.title === notification.title && n.message === notification.message
    );
    
    if (isDuplicate) {
      console.log('Duplicate notification skipped:', notification.title);
      return;
    }
    
    // Limiter à 3 notifications maximum
    if (notifications.length >= 3) {
      setNotifications(prev => prev.slice(1)); // Supprimer la plus ancienne
    }
    
    const id = Date.now().toString();
    const newNotification: Notification = {
      ...notification,
      id,
      duration: notification.duration || 5000, // 5 seconds by default
    };
    
    setNotifications(prev => [...prev, newNotification]);

    // Auto-hide after duration
    setTimeout(() => {
      hideNotification(id);
    }, newNotification.duration);
  };

  const hideNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider value={{ showNotification, hideNotification, clearAllNotifications }}>
      {children}
      <NotificationContainer notifications={notifications} insets={insets} />
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);

/**
 * Notification container component
 */
const NotificationContainer = ({ notifications, insets }: { notifications: Notification[]; insets: any }) => {
  if (notifications.length === 0) return null;

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
      {notifications.map((notification) => (
        <NotificationItem key={notification.id} notification={notification} />
      ))}
    </View>
  );
};

/**
 * Individual notification item
 */
const NotificationItem = ({ notification }: { notification: Notification }) => {
  const isSessionExpired = notification.title === 'Session expirée';
  
  const getBackgroundColor = () => {
    if (isSessionExpired) {
      return '#DC2626'; // rouge plus vif pour session expirée
    }
    switch (notification.type) {
      case 'error':
        return '#DC2626'; // red
      case 'warning':
        return '#F59E0B'; // yellow
      case 'success':
        return '#10B981'; // green
      case 'info':
        return '#3B82F6'; // blue
      default:
        return '#6B7280'; // gray
    }
  };

  const getIcon = () => {
    switch (notification.type) {
      case 'error':
        return '⚠️';
      case 'warning':
        return '⚡';
      case 'success':
        return '✅';
      case 'info':
        return 'ℹ️';
      default:
        return '📢';
    }
  };

  return (
    <Animated.View style={[
      styles.notification, 
      { backgroundColor: getBackgroundColor() },
      isSessionExpired && styles.sessionExpiredNotification
    ]}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{getIcon()}</Text>
        {isSessionExpired && (
          <Text style={styles.logoutIndicator}>⏳</Text>
        )}
      </View>
      <View style={styles.content}>
        <Text style={[styles.title, isSessionExpired && styles.sessionExpiredTitle]}>
          {notification.title}
        </Text>
        {notification.message && (
          <Text style={styles.message}>{notification.message}</Text>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    alignItems: 'center',
  },
  notification: {
    marginHorizontal: 20,
    marginBottom: 10,
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  iconContainer: {
    marginRight: 12,
  },
  icon: {
    fontSize: 20,
  },
  content: {
    flex: 1,
  },
  title: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  message: {
    color: 'white',
    fontSize: 14,
    opacity: 0.9,
  },
  sessionExpiredNotification: {
    borderLeftWidth: 4,
    borderLeftColor: '#991B1B',
  },
  logoutIndicator: {
    fontSize: 16,
    marginLeft: 8,
  },
  sessionExpiredTitle: {
    fontWeight: '700',
  },
});