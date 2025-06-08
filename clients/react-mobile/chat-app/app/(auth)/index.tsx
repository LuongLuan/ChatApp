// app/auth.tsx
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import { useRouter } from 'expo-router'; // Import useRouter để điều hướng
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const API_BASE_URL = 'http://localhost:6001';

const AuthScreen: React.FC = () => {
  const [isLoginMode, setIsLoginMode] = useState<boolean>(true);
  const lat : number = 10.77164210569993;
  const long : number = 106.65039878023639;
  const [password, setPassword] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false); 

  const router = useRouter(); 

  const handleAuth = async () => {
    setIsLoading(true); 
    try {
      let url: string;
      let body: {};

      if (isLoginMode) {
        url = `${API_BASE_URL}/api/user/login`; 
        body = { username, password};
      } else {
        url = `${API_BASE_URL}/api/auth/register`; // Giả sử endpoint đăng ký
        body = { username, password };
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok) {
        // Kiểm tra xem phản hồi có chứa token hay không
        if (data.token) { // Giả sử backend trả về { token: "..." }
          await AsyncStorage.setItem('userToken', data.token); // Lưu token vào AsyncStorage
          console.log('Xác thực thành công, token đã lưu:', data.token);
          // Điều hướng người dùng đến màn hình chính của ứng dụng
          router.replace('/(tabs)'); // Điều hướng thay thế, không cho quay lại màn hình auth
        } else {
          Alert.alert('Lỗi', 'Không nhận được token từ máy chủ.');
          console.error('Phản hồi từ API không chứa token:', data);
        }
      } else {
        // Xử lý lỗi từ backend (ví dụ: thông tin đăng nhập sai, email đã tồn tại)
        const errorMessage = data.message || 'Đã xảy ra lỗi trong quá trình xác thực.';
        Alert.alert('Lỗi xác thực', errorMessage);
        console.error('Lỗi API:', response.status, data);
      }
    } catch (error) {
      console.error('Lỗi khi gọi API:', error);
      Alert.alert('Lỗi kết nối', 'Không thể kết nối đến máy chủ. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false); // Kết thúc loading
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.authContainer}>
          <Text style={styles.title}>{isLoginMode ? 'Đăng nhập' : 'Đăng ký'}</Text>

          {!isLoginMode && (
            <TextInput
              style={styles.input}
              placeholder="Tên người dùng"
              placeholderTextColor="#ccc"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              editable={!isLoading} // Không cho chỉnh sửa khi đang tải
            />
          )}

          <TextInput
            style={styles.input}
            placeholder="Tên người dùng hoặc Email" // Cập nhật placeholder
            placeholderTextColor="#ccc"
            keyboardType="email-address" // Vẫn giữ keyboardType email để tiện
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            editable={!isLoading}
          />

          <TextInput
            style={styles.input}
            placeholder="Mật khẩu"
            placeholderTextColor="#ccc"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            editable={!isLoading}
          />

          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]} // Thêm style khi disabled
            onPress={handleAuth}
            disabled={isLoading} // Tắt nút khi đang tải
          >
            <Text style={styles.buttonText}>
              {isLoading ? 'Đang xử lý...' : (isLoginMode ? 'Đăng nhập' : 'Đăng ký')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.switchButton}
            onPress={() => setIsLoginMode((prevMode) => !prevMode)}
            disabled={isLoading} // Tắt nút khi đang tải
          >
            <Text style={styles.switchButtonText}>
              {isLoginMode ? 'Chưa có tài khoản? Đăng ký' : 'Đã có tài khoản? Đăng nhập'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
     paddingHorizontal: 20, 
  },
  authContainer: {
    width: '100%',     // full chiều ngang
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    alignSelf: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#1877f2',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonDisabled: { // Style cho nút khi disabled
    backgroundColor: '#a3d1f0',
  },
  switchButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  switchButtonText: {
    color: '#1877f2',
    fontSize: 16,
  },
});

export default AuthScreen;