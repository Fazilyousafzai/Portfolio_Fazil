import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, 
  Image, ScrollView, Switch, Alert 
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

const ProfileScreen = ({ navigation }) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);

  // Sample user data
  const user = {
    name: 'Fazil Yousafzai',
    email: 'Fazilyousafzaivlogs@gmail.com',
    phone: '+923331560614',
    image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    addresses: [
      {
        id: 'a1',
        title: 'Home',
        address: '123 Main Street, Apt 4B, New York, NY 10001',
        isDefault: true,
      },
      {
        id: 'a2',
        title: 'Work',
        address: '456 Park Avenue, 8th Floor, New York, NY 10022',
        isDefault: false,
      }
    ],
    paymentMethods: [
      {
        id: 'p1',
        type: 'Visa',
        lastDigits: '4321',
        expiryDate: '05/27',
        isDefault: true,
      },
      {
        id: 'p2',
        type: 'Mastercard',
        lastDigits: '8765',
        expiryDate: '09/26',
        isDefault: false,
      }
    ]
  };

  const logOut = () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: () => {
            // Implement logout functionality
            console.log('User logged out');
          },
          style: 'destructive',
        },
      ]
    );
  };

  const renderSectionHeader = (title) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );

  const renderListItem = (icon, title, subtitle, onPress, badge) => (
    <TouchableOpacity style={styles.listItem} onPress={onPress}>
      <View style={styles.listItemIconContainer}>
        <Ionicons name={icon} size={22} color="#555" />
      </View>
      <View style={styles.listItemContent}>
        <Text style={styles.listItemTitle}>{title}</Text>
        {subtitle && <Text style={styles.listItemSubtitle}>{subtitle}</Text>}
      </View>
      {badge ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      ) : (
        <Ionicons name="chevron-forward" size={20} color="#ccc" />
      )}
    </TouchableOpacity>
  );

  const renderToggleItem = (icon, title, value, onValueChange) => (
    <View style={styles.listItem}>
      <View style={styles.listItemIconContainer}>
        <Ionicons name={icon} size={22} color="#555" />
      </View>
      <View style={styles.listItemContent}>
        <Text style={styles.listItemTitle}>{title}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#ccc', true: '#FFCCCB' }}
        thumbColor={value ? '#FF6347' : '#f4f3f4'}
      />
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>
      
      <View style={styles.profileSection}>
        <Image source={{ uri: user.image }} style={styles.profileImage} />
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{user.name}</Text>
          <Text style={styles.profileEmail}>{user.email}</Text>
          <TouchableOpacity style={styles.editProfileButton}>
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {renderSectionHeader('Account')}
      {renderListItem('person-outline', 'Personal Information', user.phone, () => {})}
      {renderListItem('location-outline', 'Addresses', `${user.addresses.length} saved addresses`, () => {})}
      {renderListItem('card-outline', 'Payment Methods', `${user.paymentMethods.length} saved cards`, () => {})}
      {renderListItem('gift-outline', 'Promotions', 'Promo codes & gift cards', () => {}, '2')}
      
      {renderSectionHeader('Preferences')}
      {renderToggleItem('notifications-outline', 'Push Notifications', notificationsEnabled, setNotificationsEnabled)}
      {renderToggleItem('navigate-outline', 'Location Services', locationEnabled, setLocationEnabled)}
      {renderListItem('moon-outline', 'Dark Mode', 'Off', () => {})}
      {renderListItem('globe-outline', 'Language', 'English', () => {})}
      
      {renderSectionHeader('Support')}
      {renderListItem('help-circle-outline', 'Help Center', null, () => {})}
      {renderListItem('chatbubble-ellipses-outline', 'Contact Support', null, () => {})}
      {renderListItem('document-text-outline', 'Terms of Service', null, () => {})}
      {renderListItem('shield-checkmark-outline', 'Privacy Policy', null, () => {})}
      
      <TouchableOpacity style={styles.logoutButton} onPress={logOut}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
      
      <View style={styles.versionContainer}>
        <Text style={styles.versionText}>Version 1.0.0</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  profileSection: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  profileInfo: {
    marginLeft: 20,
    justifyContent: 'center',
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  profileEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    marginBottom: 10,
  },
  editProfileButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#FF6347',
    alignSelf: 'flex-start',
  },
  editProfileText: {
    color: '#FF6347',
    fontSize: 14,
    fontWeight: '500',
  },
  sectionHeader: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#f8f8f8',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  listItemIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  listItemContent: {
    flex: 1,
  },
  listItemTitle: {
    fontSize: 16,
    color: '#333',
  },
  listItemSubtitle: {
    fontSize: 14,
    color: '#999',
    marginTop: 2,
  },
  badge: {
    backgroundColor: '#FF6347',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  logoutButton: {
    margin: 20,
    backgroundColor: '#f8f8f8',
    borderWidth: 1,
    borderColor: '#FF6347',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  logoutText: {
    color: '#FF6347',
    fontSize: 16,
    fontWeight: '600',
  },
  versionContainer: {
    alignItems: 'center',
    paddingBottom: 30,
  },
  versionText: {
    color: '#999',
    fontSize: 14,
  },
});

export default ProfileScreen;