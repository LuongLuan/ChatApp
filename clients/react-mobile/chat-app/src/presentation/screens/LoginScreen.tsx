import * as AuthSession from 'expo-auth-session';
import * as Crypto from 'expo-crypto';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Button, Text, View } from 'react-native';
import { AuthService } from '../../application/services/AuthService';
import { AuthRepositoryImpl } from '../../infrastructure/repositories/AuthRepositoryImpl';
import { TokenStorage } from '../../infrastructure/storage/TokenStorage';
import { clientId, discovery, redirectUri } from '../../shared/constants/oauthConfig';
  
WebBrowser.maybeCompleteAuthSession();

  export default function LoginScreen() {

  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const authService = new AuthService(new AuthRepositoryImpl());

  const generateCodeVerifier = () =>
    Array.from(Crypto.getRandomBytes(32)).map(b => ('0' + b.toString(16)).slice(-2)).join('');

  const generateCodeChallenge = async (codeVerifier: string) => {
    const digest = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      codeVerifier,
      { encoding: Crypto.CryptoEncoding.BASE64 }
    );

    return digest.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  };

  const handleLogin = async () => {
    try {
      setLoading(true);
      //const redirectUri = AuthSession.makeRedirectUri({scheme:'exp+chat-app'});
      console.log("Generated redirectUri:", redirectUri); 
      const codeVerifier = generateCodeVerifier();
      const codeChallenge = await generateCodeChallenge(codeVerifier);
      
      const authRequestConfig: AuthSession.AuthRequestConfig = {
        clientId,
        redirectUri,
        scopes: ['openid', 'profile', 'email', "roles","userAPI","postAPI","notificationAPI","chatAPI"],
        responseType: AuthSession.ResponseType.Code,
        usePKCE: true,
        codeChallenge,
        codeChallengeMethod: AuthSession.CodeChallengeMethod.S256, 
      };
      const request = new AuthSession.AuthRequest(authRequestConfig);

      console.log("create request:" , request);
      await request.makeAuthUrlAsync(discovery);

      const result = await request.promptAsync(discovery);

      await WebBrowser.dismissBrowser();

      console.log("get result:", result);

      if (result.type !== 'success' || !result.params.code) {
        Alert.alert('Login failed', 'No code received');
        return;
      }

      const tokens = await authService.loginWithCode(result.params.code, codeVerifier);
      console.log("get result token",tokens);

      await TokenStorage.saveTokens(tokens);

      router.replace('/');
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
