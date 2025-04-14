import React, { useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

const products = [
  { id: '1', name: 'Stylish Jacket', price: 'PKR 5,000', category: 'Men', image: require('./assets/jacket.jpg') },
  { id: '2', name: 'Leather Bag', price: 'PKR 7,500', category: 'Women', image: require('./assets/bag.jpg') },
];

const categories = ['All', 'Men', 'Women'];

const HomeScreen = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredProducts =
    selectedCategory === 'All' ? products : products.filter((p) => p.category === selectedCategory);

  return (
    <View style={styles.container}>
      <View style={styles.bannerContainer}>
        <Image source={require('./assets/banner.jpg')} style={styles.banner} />
        <Image source={require('./assets/fazil.png')} style={styles.logo} />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryContainer}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[styles.categoryTab, selectedCategory === category && styles.activeCategory]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text style={[styles.categoryText, selectedCategory === category && styles.activeCategoryText]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.productCard}>
            <Image source={item.image} style={styles.image} />
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.price}>{item.price}</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('ProductDetail', { product: item })}
            >
              <Text style={styles.buttonText}>BUY NOW</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const ProductDetailScreen = ({ route, navigation }) => {
  const { product } = route.params;
  return (
    <View style={styles.container}>
      <Image source={product.image} style={styles.imageLarge} />
      <Text style={styles.name}>{product.name}</Text>
      <Text style={styles.price}>{product.price}</Text>
      <Text style={styles.description}>This is a high-quality product made for comfort and style.</Text>
      
      {/* Wrapping button inside View for centering */}
      <View style={{ alignItems: 'center', width: '100%' }}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Cart', { product })}
        >
          <Text style={styles.buttonText}>ADD TO CART</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const CartScreen = ({ route }) => {
  const [cartItems, setCartItems] = useState(route.params ? [route.params.product] : []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Cart</Text>
      {cartItems.length === 0 ? (
        <Text style={styles.emptyCart}>Your cart is empty.</Text>
      ) : (
        cartItems.map((item, index) => (
          <View key={index} style={styles.cartItem}>
            <Image source={item.image} style={styles.imageSmall} />
            <View>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.price}>{item.price}</Text>
            </View>
          </View>
        ))
      )}
      {cartItems.length > 0 && (
        <TouchableOpacity style={styles.button} onPress={() => alert('Proceeding to checkout!')}>
          <Text style={styles.buttonText}>CHECKOUT</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
        <Stack.Screen name="Cart" component={CartScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 150, paddingHorizontal: 20 },

  bannerContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },

  banner: {
    width: '110%',
    height: 150,
    borderRadius: 10,
    marginTop: 50,
    marginBottom: 20,
  },

  logo: {
    position: 'absolute',
    top: -20,
    left: 100,
    width: 150,
    height: 80,
    resizeMode: 'contain',
  },

  categoryContainer: { flexDirection: 'row', marginBottom: 20, justifyContent: 'center' },
  categoryTab: { paddingVertical: 8, paddingHorizontal: 15, borderRadius: 20, marginHorizontal: 5, backgroundColor: '#f0f0f0' },
  activeCategory: { backgroundColor: 'black' },
  categoryText: { fontSize: 16, color: 'black' },
  activeCategoryText: { color: 'white', fontWeight: 'bold' },

  productCard: { width: 170, alignItems: 'center', marginRight: 20, paddingBottom: 10 },
  image: { width: 160, height: 200, borderRadius: 10 },
  name: { fontSize: 16, fontWeight: 'bold', marginVertical: 5, textAlign: 'center' },
  price: { fontSize: 14, color: 'blue', textAlign: 'center' },

  button: {
    backgroundColor: 'limegreen',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    width: '80%',
    alignItems: 'center',
    alignSelf: 'center',
  },

  buttonText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },

  imageLarge: {
    width: '100%',
    height: 400,
    resizeMode: 'contain',
    borderRadius: 10,
    marginBottom: 20,
  },

  description: { fontSize: 14, textAlign: 'center', marginVertical: 10 },

  title: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  emptyCart: { fontSize: 16, textAlign: 'center', marginTop: 20 },
  cartItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  imageSmall: { width: 50, height: 50, borderRadius: 5, marginRight: 10 },
});
