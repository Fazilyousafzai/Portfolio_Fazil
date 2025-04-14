import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const OrderTrackingScreen = ({ route, navigation }) => {
  const { orderId } = route.params || { orderId: '12345' };
  const [orderStatus, setOrderStatus] = useState('preparing');
  const [estimatedDelivery, setEstimatedDelivery] = useState('');
  const [deliveryPerson, setDeliveryPerson] = useState({
    name: 'Fazil Yousafzai',
    rating: 4.8,
    image: 'https://via.placeholder.com/150',
    phone: '+1 (555) 123-4567'
  });

  // Simulating order status updates
  useEffect(() => {
    // Get current time
    const now = new Date();
    // Set estimated delivery time (30 minutes from now)
    const deliveryTime = new Date(now.getTime() + 30 * 60000);
    setEstimatedDelivery(deliveryTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

    // Simulate status updates
    const statusUpdates = [
      { status: 'preparing', delay: 3000 },
      { status: 'ready', delay: 8000 },
      { status: 'picked_up', delay: 12000 },
      { status: 'on_the_way', delay: 15000 },
      { status: 'nearby', delay: 20000 },
      { status: 'delivered', delay: 25000 }
    ];

    statusUpdates.forEach(update => {
      setTimeout(() => {
        setOrderStatus(update.status);
      }, update.delay);
    });

    return () => {
      // Clean up timeouts if component unmounts
    };
  }, []);

  const getStatusText = (status) => {
    switch (status) {
      case 'preparing': return 'Restaurant is preparing your food';
      case 'ready': return 'Your order is ready for pickup';
      case 'picked_up': return 'Driver has picked up your order';
      case 'on_the_way': return 'Driver is on the way to your location';
      case 'nearby': return 'Driver is nearby your location';
      case 'delivered': return 'Your order has been delivered';
      default: return 'Processing your order';
    }
  };

  const renderStatusStep = (step, isCompleted, isActive) => {
    let iconColor = '#dddddd'; // default gray
    if (isCompleted) iconColor = '#4CAF50'; // green for completed
    else if (isActive) iconColor = '#FF9800'; // orange for active

    return (
      <View style={styles.statusStep} key={step}>
        <MaterialIcons name={isCompleted || isActive ? "check-circle" : "radio-button-unchecked"} 
          size={24} color={iconColor} />
        <Text style={[styles.statusText, { color: iconColor }]}>
          {getStatusText(step)}
        </Text>
      </View>
    );
  };

  const statuses = ['preparing', 'ready', 'picked_up', 'on_the_way', 'nearby', 'delivered'];
  const currentStatusIndex = statuses.indexOf(orderStatus);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Track Order #{orderId}</Text>
        <View style={{ width: 24 }} />
      </View>
      
      <View style={styles.mapContainer}>
        {/* Placeholder for map - in a real app, you would use a mapping library */}
        <View style={styles.mapPlaceholder}>
          <Text style={styles.mapPlaceholderText}>Map View</Text>
          <MaterialIcons name="map" size={48} color="#999" />
        </View>
      </View>
      
      <View style={styles.infoCard}>
        <Text style={styles.estimatedTime}>
          Estimated Delivery: {estimatedDelivery}
        </Text>
        
        <View style={styles.statusTracker}>
          {statuses.map((status, index) => 
            renderStatusStep(
              status, 
              index < currentStatusIndex, 
              index === currentStatusIndex
            )
          )}
        </View>
      </View>
      
      <View style={styles.deliveryPersonCard}>
        <Text style={styles.sectionTitle}>Your Delivery Person</Text>
        <View style={styles.deliveryPersonInfo}>
          <Image 
            source={{ uri: deliveryPerson.image }} 
            style={styles.deliveryPersonImage} 
          />
          <View style={styles.deliveryPersonDetails}>
            <Text style={styles.deliveryPersonName}>{deliveryPerson.name}</Text>
            <View style={styles.ratingContainer}>
              <MaterialIcons name="star" size={16} color="#FF9800" />
              <Text style={styles.deliveryPersonRating}>{deliveryPerson.rating}</Text>
            </View>
          </View>
          <View style={styles.contactButtons}>
            <TouchableOpacity style={styles.contactButton}>
              <MaterialIcons name="message" size={20} color="#FF5722" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.contactButton}>
              <MaterialIcons name="phone" size={20} color="#4CAF50" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      
      <View style={styles.orderSummaryCard}>
        <Text style={styles.sectionTitle}>Order Summary</Text>
        <View style={styles.orderItem}>
          <Text style={styles.orderItemName}>Chicken Burger</Text>
          <Text style={styles.orderItemQuantity}>x1</Text>
          <Text style={styles.orderItemPrice}>$12.99</Text>
        </View>
        <View style={styles.orderItem}>
          <Text style={styles.orderItemName}>French Fries (Large)</Text>
          <Text style={styles.orderItemQuantity}>x1</Text>
          <Text style={styles.orderItemPrice}>$4.99</Text>
        </View>
        <View style={styles.orderItem}>
          <Text style={styles.orderItemName}>Soft Drink (Medium)</Text>
          <Text style={styles.orderItemQuantity}>x1</Text>
          <Text style={styles.orderItemPrice}>$2.49</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.orderTotal}>
          <Text style={styles.orderTotalLabel}>Total</Text>
          <Text style={styles.orderTotalAmount}>$20.47</Text>
        </View>
      </View>
      
      <View style={styles.actions}>
        <TouchableOpacity style={styles.supportButton}>
          <MaterialIcons name="headset-mic" size={16} color="#fff" />
          <Text style={styles.supportButtonText}>Support</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    elevation: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  mapContainer: {
    width: '100%',
    height: 200,
    backgroundColor: '#e1e1e1',
    marginBottom: 16,
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapPlaceholderText: {
    fontSize: 16,
    marginBottom: 8,
    color: '#999',
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 2,
  },
  estimatedTime: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  statusTracker: {
    marginTop: 8,
  },
  statusStep: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusText: {
    marginLeft: 12,
    fontSize: 14,
  },
  deliveryPersonCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  deliveryPersonInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deliveryPersonImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  deliveryPersonDetails: {
    flex: 1,
    marginLeft: 12,
  },
  deliveryPersonName: {
    fontSize: 16,
    fontWeight: '500',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  deliveryPersonRating: {
    marginLeft: 4,
    color: '#666',
  },
  contactButtons: {
    flexDirection: 'row',
  },
  contactButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  orderSummaryCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 2,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  orderItemName: {
    flex: 1,
    fontSize: 14,
  },
  orderItemQuantity: {
    width: 30,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  orderItemPrice: {
    width: 60,
    fontSize: 14,
    textAlign: 'right',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 12,
  },
  orderTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  orderTotalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  orderTotalAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  actions: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  supportButton: {
    backgroundColor: '#FF5722',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
  },
  supportButtonText: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: '500',
  },
});

export default OrderTrackingScreen;