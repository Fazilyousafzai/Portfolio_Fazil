import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, FlatList, TouchableOpacity, 
  Image, ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Sample data for orders
const SAMPLE_ORDERS = [
  {
    id: 'o1',
    restaurant: 'Burger House',
    date: '10 Mar 2025',
    items: ['Signature Burger', 'Fries', 'Coke'],
    total: 18.99,
    status: 'Delivered',
    image: 'https://images.pexels.com/photos/1199957/pexels-photo-1199957.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  },
  {
    id: 'o2',
    restaurant: 'Pizza Palace',
    date: '08 Mar 2025',
    items: ['Margherita Pizza', 'Garlic Bread'],
    total: 22.50,
    status: 'Delivered',
    image: 'https://images.pexels.com/photos/1566837/pexels-photo-1566837.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  },
  {
    id: 'o3',
    restaurant: 'Thai Delight',
    date: '05 Mar 2025',
    items: ['Pad Thai', 'Spring Rolls', 'Thai Iced Tea'],
    total: 27.99,
    status: 'Delivered',
    image: 'https://images.pexels.com/photos/262897/pexels-photo-262897.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  },
  {
    id: 'o4',
    restaurant: 'Sushi Master',
    date: '02 Mar 2025',
    items: ['California Roll', 'Miso Soup', 'Edamame'],
    total: 31.50,
    status: 'Delivered',
    image: 'https://images.pexels.com/photos/2098085/pexels-photo-2098085.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  },
];

const OrdersScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('Past');

  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      setOrders(SAMPLE_ORDERS);
      setIsLoading(false);
    }, 800);
  }, []);

  const renderOrderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.orderCard}
      onPress={() => navigation.navigate('OrderDetails', { order: item })}
    >
      <View style={styles.orderHeader}>
        <Image source={{ uri: item.image }} style={styles.restaurantImage} />
        <View style={styles.orderHeaderInfo}>
          <Text style={styles.restaurantName}>{item.restaurant}</Text>
          <Text style={styles.orderDate}>{item.date}</Text>
        </View>
        <View style={[
          styles.statusBadge, 
          { backgroundColor: item.status === 'Delivered' ? '#E8F5E9' : '#FFF3E0' }
        ]}>
          <Text style={[
            styles.statusText, 
            { color: item.status === 'Delivered' ? '#2E7D32' : '#FF6D00' }
          ]}>
            {item.status}
          </Text>
        </View>
      </View>
      
      <View style={styles.orderContent}>
        <Text style={styles.itemsText}>
          {item.items.join(', ')}
        </Text>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalAmount}>${item.total.toFixed(2)}</Text>
        </View>
      </View>
      
      <View style={styles.orderActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="repeat" size={16} color="#FF6347" />
          <Text style={styles.actionText}>Reorder</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="receipt-outline" size={16} color="#666" />
          <Text style={styles.actionText}>Receipt</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="help-circle-outline" size={16} color="#666" />
          <Text style={styles.actionText}>Help</Text>
        </TouchableOpacity>
      </View>
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
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Orders</Text>
      </View>
      
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'Upcoming' && styles.activeTab]}
          onPress={() => setActiveTab('Upcoming')}
        >
          <Text style={[styles.tabText, activeTab === 'Upcoming' && styles.activeTabText]}>
            Upcoming
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'Past' && styles.activeTab]}
          onPress={() => setActiveTab('Past')}
        >
          <Text style={[styles.tabText, activeTab === 'Past' && styles.activeTabText]}>
            Past Orders
          </Text>
        </TouchableOpacity>
      </View>
      
      {activeTab === 'Upcoming' && (
        <View style={styles.emptyStateContainer}>
          <Ionicons name="bicycle" size={60} color="#CCCCCC" />
          <Text style={styles.emptyStateText}>No upcoming orders</Text>
          <TouchableOpacity 
            style={styles.orderNowButton}
            onPress={() => navigation.navigate('FoodOrderingStack')}
          >
            <Text style={styles.orderNowText}>Order Now</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {activeTab === 'Past' && (
        <FlatList
          data={orders}
          renderItem={renderOrderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.ordersList}
          showsVerticalScrollIndicator={false}
        />
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
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  tab: {
    paddingVertical: 15,
    marginRight: 20,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#FF6347',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#999',
  },
  activeTabText: {
    color: '#333',
  },
  ordersList: {
    padding: 20,
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    marginBottom: 15,
    padding: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  orderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  restaurantImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  orderHeaderInfo: {
    flex: 1,
    marginLeft: 12,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  orderDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  orderContent: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemsText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  totalLabel: {
    fontSize: 14,
    color: '#999',
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  orderActions: {
    flexDirection: 'row',
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  actionText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#666',
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#999',
    marginTop: 15,
    marginBottom: 20,
  },
  orderNowButton: {
    backgroundColor: '#FF6347',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 25,
  },
  orderNowText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default OrdersScreen;