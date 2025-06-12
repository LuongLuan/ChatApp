import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Button, Text, View } from 'react-native';
import { TokenStorage } from '../src/infrastructure/storage/TokenStorage';

export default function Index() {
  const router = useRouter();

  // Kiểm tra token khi vào màn hình
  useEffect(() => {
    const checkAuth = async () => {
      const token = await TokenStorage.getAccessToken();
      if (!token) {
        router.replace('/login');
      }
    };

    checkAuth();
  }, []);

  const handleLogout = async () => {
    await TokenStorage.clearTokens();
    router.replace('/login');
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Home Screen</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
}
