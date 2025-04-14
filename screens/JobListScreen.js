// screens/JobListScreen.js
import React, { useEffect, useState } from 'react';
import { FlatList, Text, TouchableOpacity, StyleSheet, View, RefreshControl, Image, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuth, signOut } from 'firebase/auth';

export default function JobListScreen({ navigation, route }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const user = route.params?.user || { name: 'Guest', photoUrl: null }; // Fallback if no user data

  const fetchJobs = async () => {
    try {
      const storedJobs = await AsyncStorage.getItem('jobs');
      if (storedJobs) {
        console.log('Loaded from AsyncStorage:', storedJobs);
        setJobs(JSON.parse(storedJobs));
      }

      const url = 'http://192.168.18.31:3000/api/jobs';
      console.log('Fetching from:', url);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Fetched data:', data);
      setJobs(data);

      await AsyncStorage.setItem('jobs', JSON.stringify(data));
    } catch (err) {
      console.error('Fetch error:', err.message);
      setError(err.message);
      const storedJobs = await AsyncStorage.getItem('jobs');
      if (storedJobs) {
        setJobs(JSON.parse(storedJobs));
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchJobs();
  };

  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      await AsyncStorage.removeItem('jobs'); // Clear stored jobs
      navigation.navigate('Login'); // Navigate back to LoginScreen
    } catch (error) {
      Alert.alert('Logout Error', error.message);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading jobs...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* User Profile Section */}
      <View style={styles.profileContainer}>
        {user.photoUrl ? (
          <Image source={{ uri: user.photoUrl }} style={styles.profilePicture} />
        ) : (
          <View style={[styles.profilePicture, styles.placeholderPicture]}>
            <Text style={styles.placeholderText}>{user.name.charAt(0)}</Text>
          </View>
        )}
        <Text style={styles.userName}>Welcome, {user.name}!</Text>
        <Button title="Logout" onPress={handleLogout} color="#ff4444" />
      </View>

      {/* Job Listings */}
      <FlatList
        data={jobs}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.jobItem}
            onPress={() => navigation.navigate('JobDetails', { job: item })}
          >
            <Text style={styles.title}>{item.title}</Text>
            <Text>{item.company}</Text>
            <Text>{item.location}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={item => item.id}
        ListEmptyComponent={<Text>No jobs available</Text>}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  placeholderPicture: {
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  userName: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
  },
  jobItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: '100%',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});