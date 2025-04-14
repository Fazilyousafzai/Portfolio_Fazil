// screens/LoginScreen.js
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, Image } from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { getAuth, signInWithCredential, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../firebase'; // Import Firebase auth

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: '497112784383-40ictpdeb1bmtd7kd2b8pbrhdpdvkril.apps.googleusercontent.com', // Get this from Firebase Authentication -> Google -> Web client ID
  });

  React.useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then(async (userCredential) => {
          const user = userCredential.user;
          const userData = {
            name: user.displayName,
            email: user.email,
            photoUrl: user.photoURL,
          };

          // Send user data to the server to store in MongoDB
          try {
            const response = await fetch('http://192.168.0.108:3000/api/users', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(userData),
            });
            if (!response.ok) {
              throw new Error('Failed to store user data');
            }
            // Navigate to JobListScreen with user data
            navigation.navigate('JobList', { user: userData });
          } catch (error) {
            Alert.alert('Error', 'Failed to store user data: ' + error.message);
          }
        })
        .catch((error) => {
          Alert.alert('Login Error', error.message);
        });
    }
  }, [response]);

  const handleGoogleLogin = () => {
    promptAsync();
  };

  const handleManualLogin = () => {
    if (username && password) {
      const userData = {
        name: username,
        email: `${username}@example.com`,
        photoUrl: null,
      };
      navigation.navigate('JobList', { user: userData });
    } else {
      Alert.alert('Please enter username and password');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Login Manually" onPress={handleManualLogin} />
      <View style={styles.googleButton}>
        <Button
          title="Login with Google"
          onPress={handleGoogleLogin}
          disabled={!request}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
  googleButton: {
    marginTop: 20,
  },
});