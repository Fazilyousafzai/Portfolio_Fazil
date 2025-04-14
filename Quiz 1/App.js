// App.js
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StatusBar,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Replace with your actual API key from OpenWeatherMap
const API_KEY = '5f5eb1b5a1011ab6e193a28dbdff7cfb';

export default function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchWeatherData = async (cityName) => {
    if (!cityName.trim()) {
      setError('Please enter a city name');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      // Fetch current weather
      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${API_KEY}`
      );
      
      if (!weatherResponse.ok) {
        throw new Error('City not found');
      }
      
      const weatherData = await weatherResponse.json();
      
      // Fetch 5-day forecast
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=metric&appid=${API_KEY}`
      );
      
      if (!forecastResponse.ok) {
        throw new Error('Forecast data not available');
      }
      
      const forecastData = await forecastResponse.json();
      
      // Process forecast data to get one forecast per day
      const dailyForecasts = processForecastData(forecastData.list);
      
      setWeather(weatherData);
      setForecast(dailyForecasts);
      setCity('');
    } catch (err) {
      setError(err.message);
      setWeather(null);
      setForecast([]);
    } finally {
      setLoading(false);
    }
  };

  // Process forecast data to get one forecast per day
  const processForecastData = (forecastList) => {
    const dailyData = {};
    
    forecastList.forEach(item => {
      const date = new Date(item.dt * 1000).toDateString();
      
      if (!dailyData[date]) {
        dailyData[date] = item;
      }
    });
    
    return Object.values(dailyData).slice(0, 5); // Return next 5 days
  };

  // Get appropriate weather icon
  const getWeatherIcon = (iconCode) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  // Format date
  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}`;
  };

  // Get time from timestamp
  const getTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    hours = hours % 12;
    hours = hours ? hours : 12;
    
    return `${hours}:${minutes < 10 ? '0' + minutes : minutes} ${ampm}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      
      <View style={styles.header}>
        <Text style={styles.title}>Weather Forecast</Text>
      </View>
      
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter city name"
          value={city}
          onChangeText={setCity}
          placeholderTextColor="#6c757d"
        />
        <TouchableOpacity 
          style={styles.searchButton}
          onPress={() => fetchWeatherData(city)}
        >
          <Ionicons name="search" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      
      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0066cc" />
          <Text style={styles.loadingText}>Fetching weather data...</Text>
        </View>
      ) : null}
      
      {weather && !loading ? (
        <ScrollView 
          style={styles.weatherContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.currentWeather}>
            <Text style={styles.cityName}>{weather.name}, {weather.sys.country}</Text>
            <Text style={styles.currentDate}>{formatDate(weather.dt)}</Text>
            
            <View style={styles.weatherMain}>
              <Image 
                source={{ uri: getWeatherIcon(weather.weather[0].icon) }} 
                style={styles.weatherIcon}
              />
              <Text style={styles.temperature}>
                {Math.round(weather.main.temp)}°C
              </Text>
            </View>
            
            <Text style={styles.weatherDescription}>
              {weather.weather[0].description.charAt(0).toUpperCase() + 
               weather.weather[0].description.slice(1)}
            </Text>
            
            <View style={styles.weatherDetails}>
              <View style={styles.weatherDetail}>
                <Ionicons name="thermometer-outline" size={22} color="#0066cc" />
                <Text style={styles.detailText}>
                  Feels like: {Math.round(weather.main.feels_like)}°C
                </Text>
              </View>
              
              <View style={styles.weatherDetail}>
                <Ionicons name="water-outline" size={22} color="#0066cc" />
                <Text style={styles.detailText}>
                  Humidity: {weather.main.humidity}%
                </Text>
              </View>
              
              <View style={styles.weatherDetail}>
                <Ionicons name="speedometer-outline" size={22} color="#0066cc" />
                <Text style={styles.detailText}>
                  Pressure: {weather.main.pressure} hPa
                </Text>
              </View>
              
              <View style={styles.weatherDetail}>
                <Ionicons name="compass-outline" size={22} color="#0066cc" />
                <Text style={styles.detailText}>
                  Wind: {Math.round(weather.wind.speed * 3.6)} km/h
                </Text>
              </View>
              
              <View style={styles.weatherDetail}>
                <Ionicons name="sunny-outline" size={22} color="#0066cc" />
                <Text style={styles.detailText}>
                  Sunrise: {getTime(weather.sys.sunrise)}
                </Text>
              </View>
              
              <View style={styles.weatherDetail}>
                <Ionicons name="moon-outline" size={22} color="#0066cc" />
                <Text style={styles.detailText}>
                  Sunset: {getTime(weather.sys.sunset)}
                </Text>
              </View>
            </View>
          </View>
          
          <View style={styles.forecastContainer}>
            <Text style={styles.forecastTitle}>5-Day Forecast</Text>
            <View style={styles.forecastList}>
              {forecast.map((item, index) => (
                <View key={index} style={styles.forecastItem}>
                  <Text style={styles.forecastDay}>{formatDate(item.dt)}</Text>
                  <Image 
                    source={{ uri: getWeatherIcon(item.weather[0].icon) }} 
                    style={styles.forecastIcon}
                  />
                  <Text style={styles.forecastTemp}>
                    {Math.round(item.main.temp)}°C
                  </Text>
                  <Text style={styles.forecastDescription}>
                    {item.weather[0].main}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      ) : null}
      
      {!weather && !loading && !error ? (
        <View style={styles.initialContainer}>
          <Ionicons name="cloudy" size={100} color="#0066cc" />
          <Text style={styles.initialText}>
            Search for a city to get weather information
          </Text>
        </View>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 15,
    backgroundColor: '#0066cc',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    margin: 15,
  },
  input: {
    flex: 1,
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  searchButton: {
    width: 50,
    height: 50,
    backgroundColor: '#0066cc',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  errorContainer: {
    margin: 15,
    padding: 10,
    backgroundColor: '#ffebee',
    borderRadius: 5,
  },
  errorText: {
    color: '#c62828',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
  initialContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  initialText: {
    marginTop: 20,
    fontSize: 18,
    color: '#6c757d',
    textAlign: 'center',
  },
  weatherContainer: {
    flex: 1,
  },
  currentWeather: {
    margin: 15,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  cityName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  currentDate: {
    fontSize: 16,
    color: '#6c757d',
    marginTop: 5,
  },
  weatherMain: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  weatherIcon: {
    width: 100,
    height: 100,
  },
  temperature: {
    fontSize: 50,
    fontWeight: 'bold',
    color: '#333',
  },
  weatherDescription: {
    fontSize: 20,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  weatherDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  weatherDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    marginBottom: 15,
  },
  detailText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
  },
  forecastContainer: {
    margin: 15,
    marginTop: 0,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  forecastTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  forecastList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  forecastItem: {
    width: '19%',
    alignItems: 'center',
    padding: 10,
  },
  forecastDay: {
    fontSize: 12,
    color: '#333',
  },
  forecastIcon: {
    width: 40,
    height: 40,
  },
  forecastTemp: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  forecastDescription: {
    fontSize: 10,
    color: '#6c757d',
    textAlign: 'center',
  },
});