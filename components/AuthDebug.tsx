/**
 * Debug component to show auth state
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';

export default function AuthDebug() {
  const auth = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Auth Debug Info</Text>
      <Text>Token: {auth.token ? 'EXISTS' : 'NULL'}</Text>
      <Text>User: {auth.user ? auth.user.username : 'NULL'}</Text>
      <Text>Authenticated: {auth.isAuthenticated ? 'YES' : 'NO'}</Text>
      <Text>Loading: {auth.isLoading ? 'YES' : 'NO'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: 10,
    borderRadius: 5,
    zIndex: 9999,
  },
  title: {
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 5,
  },
});