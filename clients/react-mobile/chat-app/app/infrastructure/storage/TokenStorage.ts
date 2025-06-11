import AsyncStorage from '@react-native-async-storage/async-storage';

const ACCESS_TOKEN_KEY = 'ACCESS_TOKEN';
const REFRESH_TOKEN_KEY = 'REFRESH_TOKEN';
const ID_TOKEN_KEY = 'ID_TOKEN';

export const TokenStorage = {
  async saveTokens(tokens: { accessToken: string; refreshToken: string; idToken: string }) {
    await AsyncStorage.multiSet([
      [ACCESS_TOKEN_KEY, tokens.accessToken],
      [REFRESH_TOKEN_KEY, tokens.refreshToken],
      [ID_TOKEN_KEY, tokens.idToken],
    ]);
  },

  async getAccessToken(): Promise<string | null> {
    return await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
  },

  async getRefreshToken(): Promise<string | null> {
    return await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
  },

  async getIdToken(): Promise<string | null> {
    return await AsyncStorage.getItem(ID_TOKEN_KEY);
  },

  async clearTokens() {
    await AsyncStorage.multiRemove([ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, ID_TOKEN_KEY]);
  },
};
