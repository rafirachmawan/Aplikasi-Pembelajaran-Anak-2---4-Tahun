import { Stack } from 'expo-router';

export default function ParentLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_bottom' }}>
      <Stack.Screen name="gate" />
      <Stack.Screen name="dashboard" />
      <Stack.Screen name="detail/[module]" />
    </Stack>
  );
}
