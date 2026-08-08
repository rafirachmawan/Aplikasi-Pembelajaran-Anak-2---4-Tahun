import { Stack } from 'expo-router';

export default function ChildLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="colors/index" />
      <Stack.Screen name="colors/[level]" />
      <Stack.Screen name="numbers/index" />
      <Stack.Screen name="numbers/[level]" />
      <Stack.Screen name="letters/index" />
      <Stack.Screen name="letters/[level]" />
      <Stack.Screen name="shapes/index" />
      <Stack.Screen name="shapes/[level]" />
      <Stack.Screen name="animals/index" />
      <Stack.Screen name="animals/[level]" />
      <Stack.Screen name="fruits/index" />
      <Stack.Screen name="fruits/[level]" />
      <Stack.Screen name="bodyparts/index" />
      <Stack.Screen name="bodyparts/[level]" />
      <Stack.Screen name="vehicles/index" />
      <Stack.Screen name="vehicles/[level]" />
      <Stack.Screen name="jobs/index" />
      <Stack.Screen name="jobs/[level]" />
      <Stack.Screen name="balloon/index" />
      <Stack.Screen name="balloon/[category]" />
      <Stack.Screen name="sorting/index" />
      <Stack.Screen name="sorting/[level]" />
      <Stack.Screen name="tracing/index" />
      <Stack.Screen name="tracing/[char]" />
      <Stack.Screen name="soundboard/index" />
    </Stack>
  );
}
