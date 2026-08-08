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
    </Stack>
  );
}
