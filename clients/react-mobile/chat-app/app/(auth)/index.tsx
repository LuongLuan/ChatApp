import AsyncStorage from '@react-native-async-storage/async-storage'; // Để lưu trữ token
import * as AuthSession from 'expo-auth-session';
import { useRouter } from 'expo-router'; // Nếu bạn đang dùng Expo Router
import * as WebBrowser from 'expo-web-browser';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Button, StyleSheet, Text, View } from 'react-native';

// Đảm bảo trình duyệt web được đóng khi hoàn tất phiên xác thực
WebBrowser.maybeCompleteAuthSession();

// Cấu hình Duende IdentityServer của bạn
const discovery = {
  authorizationEndpoint: 'http://localhost:5077/connect/authorize',
  tokenEndpoint: 'http://localhost:5077/connect/token',
  revocationEndpoint: 'http://localhost:5077/connect/revocation',
  userinfoEndpoint: 'http://localhost:5077/connect/userinfo',
};

const clientId = 'expo-mobile-app'; // ClientId phải khớp với cấu hình trong Duende IdentityServer

// Tạo URI chuyển hướng tự động, phù hợp với Expo Go và build app
const redirectUri = AuthSession.makeRedirectUri({
  scheme: 'chatapp',
  path: '(tabs)',
});

console.log('Redirect URI cho ứng dụng của bạn:', redirectUri); // In ra để kiểm tra

export default function AuthScreen() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [idToken, setIdToken] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  // Sử dụng useAuthRequest hook từ expo-auth-session
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: clientId,
      redirectUri: redirectUri,
      scopes: ['openid', 'profile', 'email', 'roles', 'userAPI', 'chatAPI', 'offline_access'],
      usePKCE: true, // Mặc định là true cho luồng code, nhưng nên đặt rõ ràng
    },
    discovery
  );

  // Hàm để lấy thông tin người dùng từ userinfo endpoint
  const fetchUserInfo = useCallback(async (token: string) => {
    if (!discovery.userinfoEndpoint) {
      console.warn('userinfoEndpoint không được định nghĩa trong cấu hình.');
      return;
    }
    try {
      const userInfoResponse = await fetch(discovery.userinfoEndpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await userInfoResponse.json();
      setUserInfo(data);
      console.log('Thông tin người dùng:', data);
    } catch (error) {
      console.error('Lỗi khi lấy thông tin người dùng:', error);
      Alert.alert('Lỗi', 'Không thể lấy thông tin người dùng.');
    }
  }, []); // Không cần discovery.userinfoEndpoint trong dependency vì nó là hằng số

  // Xử lý phản hồi xác thực khi nhận được
  useEffect(() => {
    const handleAuthResponse = async () => {
      if (response?.type === 'success') {
        setIsLoading(true);
        const { code } = response.params;
        console.log('Mã ủy quyền nhận được:', code);

        try {
          // Đổi mã ủy quyền lấy token (access token, id token, refresh token)
          const tokenResponse = await AuthSession.exchangeCodeAsync(
            {
              clientId: clientId,
              code: code,
              redirectUri: redirectUri,
              extraParams: {
                code_verifier: request?.codeVerifier || '', // Rất quan trọng cho PKCE
              },
            },
            discovery
          );

          setAccessToken(tokenResponse.accessToken);
          setIdToken(tokenResponse.idToken || null);
          setRefreshToken(tokenResponse.refreshToken || null);

          // Lưu token vào AsyncStorage (sử dụng giải pháp an toàn hơn cho production)
          await AsyncStorage.setItem('accessToken', tokenResponse.accessToken);
          if (tokenResponse.idToken) await AsyncStorage.setItem('idToken', tokenResponse.idToken);
          if (tokenResponse.refreshToken) await AsyncStorage.setItem('refreshToken', tokenResponse.refreshToken);

          Alert.alert('Thành công', 'Đăng nhập thành công!');
          if (tokenResponse.accessToken) {
            await fetchUserInfo(tokenResponse.accessToken);
          }
          router.replace('/'); 
        } catch (error: any) {
          console.error('Lỗi khi đổi mã lấy token:', error);
          Alert.alert('Lỗi', `Không thể lấy token: ${error.message || 'Lỗi không xác định'}`);
        } finally {
          setIsLoading(false);
        }
      } else if (response?.type === 'error') {
        console.error('Lỗi xác thực:', response.error);
        Alert.alert('Lỗi xác thực', response.error?.message || 'Đã xảy ra lỗi trong quá trình xác thực.');
      } else if (response?.type === 'cancel') {
        console.log('Người dùng đã hủy đăng nhập.');
        Alert.alert('Thông báo', 'Bạn đã hủy đăng nhập.');
      }
    };

    handleAuthResponse();
  }, [response, request, fetchUserInfo]); 

  // Hàm để làm mới token
  const handleRefresh = useCallback(async () => {
    if (!refreshToken) {
      Alert.alert('Lỗi', 'Không có refresh token để làm mới.');
      return;
    }
    setIsLoading(true);
    try {
      const tokenResponse = await AuthSession.refreshAsync(
        {
          clientId: clientId,
          refreshToken: refreshToken,
          scopes: ['openid', 'profile', 'api1', 'offline_access'], // Yêu cầu lại các scope
        },
        discovery
      );

      setAccessToken(tokenResponse.accessToken);
      setIdToken(tokenResponse.idToken || null);
      setRefreshToken(tokenResponse.refreshToken || null); // Quan trọng: có thể nhận được refresh token mới

      await AsyncStorage.setItem('accessToken', tokenResponse.accessToken);
      if (tokenResponse.idToken) await AsyncStorage.setItem('idToken', tokenResponse.idToken);
      if (tokenResponse.refreshToken) await AsyncStorage.setItem('refreshToken', tokenResponse.refreshToken);

      Alert.alert('Thành công', 'Token đã được làm mới!');
      if (tokenResponse.accessToken) {
        await fetchUserInfo(tokenResponse.accessToken);
      }
    } catch (error: any) {
      console.error('Lỗi khi làm mới token:', error);
      Alert.alert('Lỗi', `Không thể làm mới token: ${error.message || 'Lỗi không xác định'}`);
    } finally {
      setIsLoading(false);
    }
  }, [refreshToken, fetchUserInfo]);

  // Hàm để đăng xuất
  const handleLogout = useCallback(async () => {
    if (!accessToken) {
      Alert.alert('Thông báo', 'Bạn chưa đăng nhập.');
      return;
    }
    setIsLoading(true);
    try {
      
      if (discovery.revocationEndpoint) {
        await AuthSession.revokeAsync(
          {
            token: accessToken,
            clientId: clientId,
          },
          discovery
        );
        if (refreshToken) {
          await AuthSession.revokeAsync(
            {
              token: refreshToken,
              clientId: clientId,
              tokenTypeHint: AuthSession.TokenTypeHint.RefreshToken,
            },
            discovery
          );
        }
      }

      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('refreshToken');
      await AsyncStorage.removeItem('idToken');

      setAccessToken(null);
      setRefreshToken(null);
      setIdToken(null);
      setUserInfo(null);

      Alert.alert('Thành công', 'Bạn đã đăng xuất.');
      router.replace('/'); 
    } catch (error: any) {
      console.error('Lỗi khi đăng xuất:', error);
      Alert.alert('Lỗi', `Không thể đăng xuất: ${error.message || 'Lỗi không xác định'}`);
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, refreshToken]);


  useEffect(() => {
    const loadStoredTokens = async () => {
      setIsLoading(true);
      const storedAccessToken = await AsyncStorage.getItem('accessToken');
      const storedRefreshToken = await AsyncStorage.getItem('refreshToken');
      const storedIdToken = await AsyncStorage.getItem('idToken');

      if (storedAccessToken) {
        setAccessToken(storedAccessToken);
        setRefreshToken(storedRefreshToken);
        setIdToken(storedIdToken);
        await fetchUserInfo(storedAccessToken); 
        Alert.alert('Thông báo', 'Đã tìm thấy phiên đăng nhập. Chuyển hướng đến màn hình chính.');
        router.replace('/'); 
      }
      setIsLoading(false);
    };

    loadStoredTokens();
  }, [fetchUserInfo]); 
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Xác thực với Duende IdentityServer</Text>

      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          {!accessToken ? (
            <Button
              title="Đăng nhập qua Duende IdentityServer"
              disabled={!request} 
              onPress={() => {
                promptAsync(); 
              }}
            />
          ) : (
            <View style={styles.loggedInContainer}>
              <Text style={styles.statusText}>Bạn đã đăng nhập thành công!</Text>
              <Text>Access Token: {accessToken ? 'Có sẵn' : 'Không có'}</Text>
              <Text>Refresh Token: {refreshToken ? 'Có sẵn' : 'Không có'}</Text>
              <Text>ID Token: {idToken ? 'Có sẵn' : 'Không có'}</Text>
              {userInfo && (
                <View style={styles.userInfoContainer}>
                  <Text style={styles.userInfoTitle}>Thông tin người dùng:</Text>
                  {Object.entries(userInfo).map(([key, value]) => (
                    <Text key={key}>{key}: {JSON.stringify(value)}</Text>
                  ))}
                </View>
              )}
              <Button title="Làm mới Access Token" onPress={handleRefresh} />
              <Button title="Đăng xuất" onPress={handleLogout} color="red" />
            </View>
          )}
        </>
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
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  loggedInContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  statusText: {
    fontSize: 18,
    marginVertical: 10,
    fontWeight: '600',
    color: 'green',
  },
  userInfoContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    width: '100%',
    alignSelf: 'flex-start', 
  },
  userInfoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});