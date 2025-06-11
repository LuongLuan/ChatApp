import React from 'react';
import { Button, Text, View } from 'react-native';
import { TokenStorage } from '../../infrastructure/storage/TokenStorage';

export default function HomeScreen({ navigation }: any) {
  const handleLogout = async () => {
    await TokenStorage.clearTokens();
    navigation.replace('Login');
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Home Screen</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
}
