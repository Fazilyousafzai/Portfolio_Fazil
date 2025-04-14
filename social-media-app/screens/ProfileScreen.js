import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// Mock user data
const MOCK_USER = {
  id: '101',
  username: 'Fazilyy',
  name: 'Fazil Yousafzai',
  avatar: 'https://randomuser.me/api/portraits/men/12.jpg',
  bio: 'Travel enthusiast | Photographer | Nature lover\nExploring the world one step at a time ✈️',
  followers: 1254,
  following: 843,
  postsCount: 86,
  isVerified: true,
  website: 'fiverr.com/fazilyy'
};

// Mock posts for the grid
const MOCK_POSTS = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1472396961693-142e6e269027',
    likes: 243
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338',
    likes: 421
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1514890547357-a9ee288728e0',
    likes: 732
  },
  {
    id: '4',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    likes: 192
  },
  {
    id: '5',
    image: 'https://images.unsplash.com/photo-1543096222-72de739f7917',
    likes: 305
  },
  {
    id: '6',
    image: 'https://images.unsplash.com/photo-1515592614568-7b3357c051cd',
    likes: 528
  },
  {
    id: '7',
    image: 'https://images.unsplash.com/photo-1518098268026-4e89f1a2cd8e',
    likes: 147
  },
  {
    id: '8',
    image: 'https://images.unsplash.com/photo-1429087969512-1e85aab2683d',
    likes: 389
  },
  {
    id: '9',
    image: 'https://images.unsplash.com/photo-1505015390928-f9e55218544f',
    likes: 261
  }
];

const ProfileScreen = ({ route, navigation }) => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('grid');
  const [isFollowing, setIsFollowing] = useState(false);
  
  // Get window width for calculating grid dimensions
  const { width } = Dimensions.get('window');
  const imageSize = width / 3 - 2;

  useEffect(() => {
    // In a real app, you would fetch user data and posts based on userId from route.params
    // For now, we'll use mock data
    fetchUserData();
  }, []);

  const fetchUserData = () => {
    // Simulate API request
    setTimeout(() => {
      setUser(MOCK_USER);
      setPosts(MOCK_POSTS);
      setLoading(false);
    }, 1000);
  };

  const handleFollowToggle = () => {
    setIsFollowing(!isFollowing);
    // In a real app, you would call an API to follow/unfollow the user
  };

  const navigateToEditProfile = () => {
    // Navigate to edit profile screen
    // navigation.navigate('EditProfile');
    console.log('Navigate to Edit Profile');
  };

  const renderPostItem = ({ item }) => (
    <TouchableOpacity 
      style={[styles.postItem, { width: imageSize, height: imageSize }]}
      onPress={() => console.log(`View post ${item.id}`)}
    >
      <Image 
        source={{ uri: item.image }} 
        style={styles.postImage} 
        resizeMode="cover"
      />
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{user.username}</Text>
        <TouchableOpacity>
          <Ionicons name="ellipsis-horizontal" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileHeader}>
          <View style={styles.profileInfo}>
            <Image source={{ uri: user.avatar }} style={styles.profileImage} />
            
            <View style={styles.stats}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{user.postsCount}</Text>
                <Text style={styles.statLabel}>Posts</Text>
              </View>
              
              <TouchableOpacity style={styles.statItem}>
                <Text style={styles.statNumber}>{user.followers}</Text>
                <Text style={styles.statLabel}>Followers</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.statItem}>
                <Text style={styles.statNumber}>{user.following}</Text>
                <Text style={styles.statLabel}>Following</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.bioSection}>
            <View style={styles.nameRow}>
              <Text style={styles.userName}>{user.name}</Text>
              {user.isVerified && (
                <Ionicons name="checkmark-circle" size={16} color="#6200ee" style={styles.verifiedBadge} />
              )}
            </View>
            <Text style={styles.bioText}>{user.bio}</Text>
            {user.website && (
              <TouchableOpacity>
                <Text style={styles.websiteLink}>{user.website}</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.actionButtons}>
            {isFollowing ? (
              <TouchableOpacity style={styles.followingButton} onPress={handleFollowToggle}>
                <Text style={styles.followingButtonText}>Following</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.followButton} onPress={handleFollowToggle}>
                <Text style={styles.followButtonText}>Follow</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity style={styles.messageButton} onPress={() => console.log('Message')}>
              <Text style={styles.messageButtonText}>Message</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.editButton} onPress={navigateToEditProfile}>
              <Ionicons name="settings-outline" size={20} color="#666" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.tabsContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'grid' && styles.activeTab]} 
            onPress={() => setActiveTab('grid')}
          >
            <Ionicons 
              name="grid-outline" 
              size={24} 
              color={activeTab === 'grid' ? '#6200ee' : '#999'} 
            />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'list' && styles.activeTab]} 
            onPress={() => setActiveTab('list')}
          >
            <Ionicons 
              name="list-outline" 
              size={24} 
              color={activeTab === 'list' ? '#6200ee' : '#999'} 
            />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'tagged' && styles.activeTab]} 
            onPress={() => setActiveTab('tagged')}
          >
            <Ionicons 
              name="pricetag-outline" 
              size={24} 
              color={activeTab === 'tagged' ? '#6200ee' : '#999'} 
            />
          </TouchableOpacity>
        </View>

        {activeTab === 'grid' && (
          <FlatList
            data={posts}
            renderItem={renderPostItem}
            keyExtractor={item => item.id}
            numColumns={3}
            scrollEnabled={false}
            contentContainerStyle={styles.postsGrid}
          />
        )}

        {activeTab === 'list' && (
          <View style={styles.emptyStateContainer}>
            <Ionicons name="list-outline" size={48} color="#ccc" />
            <Text style={styles.emptyStateText}>No posts to show in list view</Text>
          </View>
        )}

        {activeTab === 'tagged' && (
          <View style={styles.emptyStateContainer}>
            <Ionicons name="pricetag-outline" size={48} color="#ccc" />
            <Text style={styles.emptyStateText}>No tagged posts</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  profileHeader: {
    padding: 16,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  stats: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginLeft: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  bioSection: {
    marginBottom: 16,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  verifiedBadge: {
    marginLeft: 4,
  },
  bioText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  websiteLink: {
    color: '#3897f0',
    fontSize: 14,
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: 8,
  },
  followButton: {
    flex: 1,
    backgroundColor: '#6200ee',
    paddingVertical: 8,
    borderRadius: 4,
    marginRight: 8,
    alignItems: 'center',
  },
  followButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  followingButton: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    paddingVertical: 8,
    borderRadius: 4,
    marginRight: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  followingButtonText: {
    fontWeight: 'bold',
  },
  messageButton: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    paddingVertical: 8,
    borderRadius: 4,
    marginRight: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  messageButtonText: {
    fontWeight: 'bold',
  },
  editButton: {
    width: 40,
    height: 36,
    backgroundColor: '#f2f2f2',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  tabsContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#6200ee',
  },
  postsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  postItem: {
    margin: 1,
  },
  postImage: {
    width: '100%',
    height: '100%',
  },
  emptyStateContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    marginTop: 12,
    fontSize: 16,
    color: '#999',
  },
});

export default ProfileScreen;