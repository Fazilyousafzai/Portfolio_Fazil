import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, 
  FlatList, ActivityIndicator 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Sample menu data - in a real app this would come from an API
const SAMPLE_MENU = {
  popular: [
    { id: 'p1', name: 'Signature Burger', description: 'Beef patty with cheese, lettuce, tomato, and special sauce', price: 12.99, image: 'https://via.placeholder.com/150' },
    { id: 'p2', name: 'Classic Fries', description: 'Crispy golden fries with sea salt', price: 4.99, image: 'https://via.placeholder.com/150' },
    { id: 'p3', name: 'Chicken Wings', description: 'Spicy buffalo wings with blue cheese dip', price: 9.99, image: 'https://via.placeholder.com/150' },
  ],
  categories: [
    { id: 'c1', name: 'Burgers', items: [
      { id: 'm1', name: 'Signature Burger', description: 'Beef patty with cheese, lettuce, tomato, and special sauce', price: 12.99, image: 'https://via.placeholder.com/150' },
      { id: 'm2', name: 'Cheeseburger', description: 'Classic beef patty with American cheese', price: 10.99, image: 'https://via.placeholder.com/150' },
      { id: 'm3', name: 'Veggie Burger', description: 'Plant-based patty with avocado and sprouts', price: 11.99, image: 'https://via.placeholder.com/150' },
    ]},
    { id: 'c2', name: 'Sides', items: [
      { id: 'm4', name: 'Classic Fries', description: 'Crispy golden fries with sea salt', price: 4.99, image: 'https://via.placeholder.com/150' },
      { id: 'm5', name: 'Onion Rings', description: 'Crispy battered onion rings', price: 5.99, image: 'https://via.placeholder.com/150' },
      { id: 'm6', name: 'Sweet Potato Fries', description: 'Crispy sweet potato fries with aioli', price: 5.99, image: 'https://via.placeholder.com/150' },
    ]},
    { id: 'c3', name: 'Drinks', items: [
      { id: 'm7', name: 'Soda', description: 'Choice of Coke, Sprite, or Fanta', price: 2.99, image: 'https://via.placeholder.com/150' },
      { id: 'm8', name: 'Milkshake', description: 'Creamy vanilla, chocolate, or strawberry', price: 5.99, image: 'https://via.placeholder.com/150' },
      { id: 'm9', name: 'Lemonade', description: 'Freshly squeezed lemonade', price: 3.99, image: 'https://via.placeholder.com/150' },
    ]},
  ]
};

const RestaurantDetailsScreen = ({ route, navigation }) => {
  const { restaurant, highlightedItem } = route.params;
  const [isLoading, setIsLoading] = useState(true);
  const [menuData, setMenuData] = useState(null);
  const [activeCategory, setActiveCategory] = useState('popular');
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);

  useEffect(() => {
    // Simulate API fetch for menu data
    setTimeout(() => {
      setMenuData(SAMPLE_MENU);
      setIsLoading(false);
      
      // If there's a highlighted item, show it in cart
      if (highlightedItem) {
        handleAddToCart(highlightedItem);
      }
    }, 800);
  }, [highlightedItem]);

  // Calculate cart total whenever cartItems changes
  useEffect(() => {
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setCartTotal(total);
  }, [cartItems]);

  const handleAddToCart = (item) => {
    // Check if item is already in cart
    const existingItemIndex = cartItems.findIndex(cartItem => cartItem.id === item.id);
    
    if (existingItemIndex >= 0) {
      // Item exists in cart, update quantity
      const updatedCartItems = [...cartItems];
      updatedCartItems[existingItemIndex].quantity += 1;
      setCartItems(updatedCartItems);
    } else {
      // Add new item to cart
      setCartItems([...cartItems, { ...item, quantity: 1 }]);
    }
  };

  const renderCategoryButton = (category) => (
    <TouchableOpacity
      key={category.id || category}
      style={[
        styles.categoryButton,
        activeCategory === (category.id || category) && styles.activeCategoryButton
      ]}
      onPress={() => setActiveCategory(category.id || category)}
    >
      <Text style={[
        styles.categoryButtonText,
        activeCategory === (category.id || category) && styles.activeCategoryButtonText
      ]}>
        {category.name || category}
      </Text>
    </TouchableOpacity>
  );

  const renderMenuItem = ({ item }) => (
    <TouchableOpacity style={styles.menuItem} onPress={() => handleAddToCart(item)}>
      <View style={styles.menuItemInfo}>
        <Text style={styles.menuItemName}>{item.name}</Text>
        <Text style={styles.menuItemDescription} numberOfLines={2}>{item.description}</Text>
        <Text style={styles.menuItemPrice}>${item.price.toFixed(2)}</Text>
      </View>
      <Image source={{ uri: item.image }} style={styles.menuItemImage} />
    </TouchableOpacity>
  );

  // Show loading indicator while data is being fetched
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6347" />
      </View>
    );
  }

  // Determine which menu items to display based on activeCategory
  let displayedItems = [];
  if (activeCategory === 'popular') {
    displayedItems = menuData.popular;
  } else {
    const category = menuData.categories.find(cat => cat.id === activeCategory);
    if (category) {
      displayedItems = category.items;
    }
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{restaurant.name}</Text>
        <TouchableOpacity style={styles.searchButton}>
          <Ionicons name="search" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Restaurant Info */}
      <View style={styles.restaurantInfo}>
        <Image source={{ uri: restaurant.image }} style={styles.restaurantImage} />
        <View style={styles.restaurantDetails}>
          <Text style={styles.restaurantName}>{restaurant.name}</Text>
          <Text style={styles.cuisineText}>{restaurant.cuisine}</Text>
          <View style={styles.restaurantMeta}>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color="#FFD700" />
              <Text style={styles.ratingText}>{restaurant.rating}</Text>
            </View>
            <View style={styles.deliveryContainer}>
              <Ionicons name="time-outline" size={16} color="#666" />
              <Text style={styles.deliveryText}>{restaurant.deliveryTime}</Text>
            </View>
          </View>
        </View>
      </View>
      
      {/* Menu Categories */}
      <View style={styles.categoryContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {renderCategoryButton('popular')}
          {menuData.categories.map(category => renderCategoryButton(category))}
        </ScrollView>
      </View>

      {/* Menu Items */}
      <FlatList
        data={displayedItems}
        renderItem={renderMenuItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.menuList}
      />

      {/* Cart Button */}
      {cartItems.length > 0 && (
        <TouchableOpacity
          style={styles.cartButton}
          onPress={() => navigation.navigate('Cart', { items: cartItems, restaurant })}
        >
          <View style={styles.cartBadge}>
            <Text style={styles.cartBadgeText}>
              {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
            </Text>
          </View>
          <Text style={styles.cartButtonText}>View Cart</Text>
          <Text style={styles.cartTotalText}>${cartTotal.toFixed(2)}</Text>
        </TouchableOpacity>
      )}
    </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: 'white',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  searchButton: {
    padding: 5,
  },
  restaurantInfo: {
    backgroundColor: 'white',
    padding: 20,
    flexDirection: 'row',
    borderBottomColor: '#f0f0f0',
    borderBottomWidth: 1,
  },
  restaurantImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  restaurantDetails: {
    marginLeft: 15,
    flex: 1,
  },
  restaurantName: {
    fontSize: 20,
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
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  ratingText: {
    marginLeft: 5,
    fontSize: 14,
    fontWeight: '500',
  },
  deliveryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deliveryText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#666',
  },
  categoryContainer: {
    backgroundColor: 'white',
    paddingTop: 15,
    paddingBottom: 10,
    borderBottomColor: '#f0f0f0',
    borderBottomWidth: 1,
  },
  categoryScroll: {
    paddingHorizontal: 20,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 10,
  },
  activeCategoryButton: {
    backgroundColor: '#FF6347',
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  activeCategoryButtonText: {
    color: 'white',
  },
  menuList: {
    padding: 20,
  },
  menuItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 15,
    padding: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  menuItemInfo: {
    flex: 1,
    marginRight: 10,
  },
  menuItemName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  menuItemDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  menuItemPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF6347',
  },
  menuItemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  cartButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#FF6347',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  cartBadge: {
    backgroundColor: 'white',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadgeText: {
    color: '#FF6347',
    fontWeight: 'bold',
    fontSize: 12,
  },
  cartButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cartTotalText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RestaurantDetailsScreen;