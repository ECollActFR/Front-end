/**
 * Error Boundary component for catching React errors
 */

import React, { Component, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';
import { logger } from '@/utils/logger';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

class ErrorBoundaryClass extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ error, errorInfo });
    
    // Log the error
    logger.error('React Error Boundary caught an error', error, {
      componentStack: errorInfo.componentStack,
      errorBoundary: 'ErrorBoundaryClass',
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return <ErrorFallback error={this.state.error} onRetry={this.handleRetry} />;
    }

    return this.props.children;
  }
}

// Functional component wrapper for hooks usage
function ErrorFallback({ error, onRetry }: { error?: Error; onRetry: () => void }) {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({}, 'border');

  return (
    <View style={[styles.container, { backgroundColor, borderColor }]}>
      <Text style={[styles.title, { color: textColor }]}>
        Oops! Something went wrong
      </Text>
      
      <Text style={[styles.message, { color: textColor }]}>
        {error?.message || 'An unexpected error occurred'}
      </Text>
      
      <TouchableOpacity 
        style={[styles.button, { backgroundColor: textColor }]} 
        onPress={onRetry}
      >
        <Text style={[styles.buttonText, { color: backgroundColor }]}>
          Try Again
        </Text>
      </TouchableOpacity>
      
      {__DEV__ && error && (
        <View style={styles.debugInfo}>
          <Text style={[styles.debugTitle, { color: textColor }]}>
            Debug Information:
          </Text>
          <Text style={[styles.debugText, { color: textColor }]}>
            {error.stack}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    borderWidth: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
    opacity: 0.8,
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  debugInfo: {
    marginTop: 20,
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 8,
    width: '100%',
  },
  debugTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  debugText: {
    fontSize: 12,
    fontFamily: 'monospace',
  },
});

// Export the class component with a functional wrapper
export function ErrorBoundary(props: Props) {
  return <ErrorBoundaryClass {...props} />;
}

// Specialized error boundaries for different contexts
export function AuthErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      fallback={
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Text style={{ fontSize: 18, marginBottom: 16 }}>
            Authentication Error
          </Text>
          <Text style={{ textAlign: 'center', opacity: 0.8 }}>
            There was a problem with authentication. Please try logging in again.
          </Text>
        </View>
      }
      onError={(error) => {
        logger.error('Authentication error caught by boundary', error, {
          context: 'AuthErrorBoundary',
        });
      }}
    >
      {children}
    </ErrorBoundary>
  );
}

export function NetworkErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      fallback={
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Text style={{ fontSize: 18, marginBottom: 16 }}>
            Network Error
          </Text>
          <Text style={{ textAlign: 'center', opacity: 0.8 }}>
            Unable to connect to the server. Please check your connection and try again.
          </Text>
        </View>
      }
      onError={(error) => {
        logger.error('Network error caught by boundary', error, {
          context: 'NetworkErrorBoundary',
        });
      }}
    >
      {children}
    </ErrorBoundary>
  );
}

export function FormErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      fallback={
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Text style={{ fontSize: 18, marginBottom: 16 }}>
            Form Error
          </Text>
          <Text style={{ textAlign: 'center', opacity: 0.8 }}>
            There was a problem with this form. Please try again or contact support.
          </Text>
        </View>
      }
      onError={(error) => {
        logger.error('Form error caught by boundary', error, {
          context: 'FormErrorBoundary',
        });
      }}
    >
      {children}
    </ErrorBoundary>
  );
}