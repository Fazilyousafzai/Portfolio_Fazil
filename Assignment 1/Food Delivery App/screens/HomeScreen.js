import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, FlatList, Image, 
  TextInput, TouchableOpacity, ScrollView, ActivityIndicator 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SAMPLE_DATA = {
  featured: [
    { id: 'f1', name: 'Signature Burger', restaurant: 'Burger House', image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', price: 12.99 },
    { id: 'f2', name: 'Margherita Pizza', restaurant: 'Pizza Palace', image: 'https://images.pexels.com/photos/825661/pexels-photo-825661.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', price: 14.99 },
    { id: 'f3', name: 'Pad Thai', restaurant: 'Thai Delight', image: 'https://images.pexels.com/photos/31029750/pexels-photo-31029750/free-photo-of-delicious-thai-shrimp-pad-thai-with-fresh-ingredients.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', price: 11.99 },
  ],
  restaurants: [
    { id: '1', name: 'Burger House', cuisine: 'American', rating: 4.7, deliveryTime: '25-35 min', image: 'https://images.pexels.com/photos/1199957/pexels-photo-1199957.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
    { id: '2', name: 'Pizza Palace', cuisine: 'Italian', rating: 4.5, deliveryTime: '30-40 min', image: 'https://images.pexels.com/photos/1566837/pexels-photo-1566837.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
    { id: '3', name: 'Thai Delight', cuisine: 'Thai', rating: 4.8, deliveryTime: '20-30 min', image: 'https://images.pexels.com/photos/262897/pexels-photo-262897.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
    { id: '4', name: 'Sushi Master', cuisine: 'Japanese', rating: 4.6, deliveryTime: '25-35 min', image: 'https://images.pexels.com/photos/2098085/pexels-photo-2098085.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
    { id: '5', name: 'Taco Time', cuisine: 'Mexican', rating: 4.4, deliveryTime: '15-25 min', image: 'https://images.pexels.com/photos/4958641/pexels-photo-4958641.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
  ]
};

const HomeScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [restaurants, setRestaurants] = useState([]);
  const [featuredItems, setFeaturedItems] = useState([]);

  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      setRestaurants(SAMPLE_DATA.restaurants);
      setFeaturedItems(SAMPLE_DATA.featured);
      setIsLoading(false);
    }, 1000);
  }, []);

  const filteredRestaurants = restaurants.filter(
    restaurant => restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                 restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderRestaurantItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.restaurantCard}
      onPress={() => navigation.navigate('RestaurantDetails', { restaurant: item })}
    >
      <Image source={{ uri: item.image }} style={styles.restaurantImage} />
      <View style={styles.restaurantInfo}>
        <Text style={styles.restaurantName}>{item.name}</Text>
        <Text style={styles.cuisineText}>{item.cuisine}</Text>
        <View style={styles.restaurantMeta}>
          <Ionicons name="star" size={16} color="#FFD700" />
          <Text style={styles.rating}>{item.rating}</Text>
          <Text style={styles.deliveryTime}>{item.deliveryTime}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderFeaturedItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.featuredCard}
      onPress={() => {
        const restaurant = restaurants.find(r => r.name === item.restaurant);
        navigation.navigate('RestaurantDetails', { 
          restaurant, 
          highlightedItem: item 
        });
      }}
    >
      <Image source={{ uri: item.image }} style={styles.featuredImage} />
      <Text style={styles.featuredName}>{item.name}</Text>
      <Text style={styles.featuredRestaurant}>{item.restaurant}</Text>
      <Text style={styles.featuredPrice}>${item.price}</Text>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6347" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.locationContainer}>
          <Ionicons name="location-outline" size={20} color="#333" />
          <Text style={styles.locationText}>Delivery to Home</Text>
          <Ionicons name="chevron-down" size={16} color="#333" />
        </View>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for restaurants or cuisines"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <Text style={styles.sectionTitle}>Featured Items</Text>
      <FlatList
        data={featuredItems}
        renderItem={renderFeaturedItem}
        keyExtractor={item => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.featuredList}
      />

      <View style={styles.restaurantsHeader}>
        <Text style={styles.sectionTitle}>Restaurants Near You</Text>
        <TouchableOpacity>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredRestaurants}
        renderItem={renderRestaurantItem}
        keyExtractor={item => item.id}
        scrollEnabled={false}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 5,
    marginRight: 5,
  },
  searchContainer: {
    marginHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 20,
    marginBottom: 15,
  },
  featuredList: {
    paddingLeft: 20,
    paddingRight: 10,
  },
  featuredCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    marginRight: 15,
    padding: 10,
    width: 150,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  featuredImage: {
    height: 100,
    width: 130,
    borderRadius: 10,
    marginBottom: 8,
  },
  featuredName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  featuredRestaurant: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  featuredPrice: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: '700',
    color: '#FF6347',
  },
  restaurantsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginRight: 20,
    marginBottom: 5,
  },
  seeAllText: {
    color: '#FF6347',
    fontSize: 14,
    fontWeight: '500',
  },
  restaurantCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    marginHorizontal: 20,
    marginBottom: 15,
    flexDirection: 'row',
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  restaurantImage: {
    width: 100,
    height: 100,
  },
  restaurantInfo: {
    flex: 1,
    padding: 12,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cuisineText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  restaurantMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    marginLeft: 5,
    fontSize: 14,
    fontWeight: '500',
  },
  deliveryTime: {
    marginLeft: 10,
    fontSize: 14,
    color: '#666',
  },
});

export default HomeScreen;