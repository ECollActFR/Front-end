# Usage Example: Capture Types

Here's how to use the new capture types functionality in your components:

## Using the Hook

```typescript
import { useCaptureTypes } from '@/hooks/useCaptureTypes';

function MyComponent() {
  const { 
    captureTypes, 
    loading, 
    error, 
    getCaptureTypeName,
    getCaptureTypeDescription 
  } = useCaptureTypes();

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  // Example: Display sensor information
  const sensor = {
    id: 1,
    captureType: 21, // This is now a numeric ID
    sensorType: 'DHT22',
    enabled: true,
    readIntervalMs: 5000
  };

  return (
    <View>
      <Text>Sensor Type: {getCaptureTypeName(sensor.captureType)}</Text>
      <Text>Description: {getCaptureTypeDescription(sensor.captureType)}</Text>
    </View>
  );
}
```

## Direct Service Usage

```typescript
import { acquisitionSystemService } from '@/services/acquisitionSystemService';

async function loadCaptureTypes() {
  try {
    const captureTypes = await acquisitionSystemService.getCaptureTypes();
    console.log('Available capture types:', captureTypes);
    // Output: [
    //   { id: 21, name: "Temperature", description: "Mesure température en °C", ... },
    //   { id: 22, name: "Humidité", description: "Mesure humidité en %", ... },
    //   ...
    // ]
  } catch (error) {
    console.error('Failed to load capture types:', error);
  }
}
```

## Key Changes

1. **ApiSensor.captureType** is now a `number` instead of a string IRI
2. **New CaptureType interface** with fields: id, name, description, createdAt
3. **useCaptureTypes hook** provides easy access to capture type data
4. **Helper functions** to get name and description by ID

The API response from `/capture_types` is now properly typed and the numeric `id` field is used throughout the application instead of the `@id` IRI.