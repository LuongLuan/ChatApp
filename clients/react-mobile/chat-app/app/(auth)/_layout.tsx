// app/(auth)/_layout.tsx
import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      {/* Bạn có thể thêm các màn hình xác thực khác ở đây nếu có (ví dụ: ForgotPassword) */}
    </Stack>
  );
}