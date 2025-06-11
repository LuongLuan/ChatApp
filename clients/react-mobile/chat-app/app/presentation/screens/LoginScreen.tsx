import * as AuthSession from 'expo-auth-session';
import { generateRandom } from 'expo-auth-session';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Button, Text, View } from 'react-native';
import { AuthService } from '../../application/services/AuthService';
import { AuthRepositoryImpl } from '../../infrastructure/repositories/AuthRepositoryImpl';
import { TokenStorage } from '../../infrastructure/storage/TokenStorage';
import { clientId, discovery, redirectUri } from '../../shared/constants/oauthConfig';

export default function LoginScreen({ navigation }: any) {
  const [loading, setLoading] = useState(false);

  const authService = new AuthService(new AuthRepositoryImpl());

  const handleLogin = async () => {
    try {
      setLoading(true);

      const codeVerifier = generateRandom(128);
      const codeChallenge = await AuthSession.generateChallengeAsync(codeVerifier);

      const authUrl = `${discovery.authorizationEndpoint}?` + 
        `client_id=${clientId}&` +
        `response_type=code&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `code_challenge=${codeChallenge}&` +
        `code_challenge_method=S256&` +
        `scope=openid profile email offline_access`;

      const result = await AuthSession.startAsync({ authUrl });

      if (result.type !== 'success' || !result.params.code) {
        Alert.alert('Login failed', 'No code received');
        setLoading(false);
        return;
      }

      const tokens = await authService.loginWithCode(result.params.code, codeVerifier);

      await TokenStorage.saveTokens(tokens);

      navigation.replace('Home');

    } catch (err) {
      console.error(err);
      Alert.alert('Login Error', err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Welcome</Text>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <Button title="Login with IdentityServer" onPress={handleLogin} />
      )}
    </View>
  );
}
