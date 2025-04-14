import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// Mock data for posts
const MOCK_POSTS = [
  {
    id: '1',
    user: {
      id: '101',
      username: 'sarah_johnson',
      name: 'Sarah Johnson',
      avatar: 'https://randomuser.me/api/portraits/women/12.jpg'
    },
    content: 'Just finished hiking at Yosemite National Park! The views were absolutely breathtaking. #nature #outdoors',
    image: 'https://images.unsplash.com/photo-1472396961693-142e6e269027',
    timestamp: '2 hours ago',
    likes: 243,
    comments: 18,
    isLiked: false
  },
  {
    id: '2',
    user: {
      id: '102',
      username: 'mike_rover',
      name: 'Mike Rover',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    content: 'New project launching next week! Stay tuned for something exciting. #tech #innovation',
    image: null,
    timestamp: '5 hours ago',
    likes: 87,
    comments: 9,
    isLiked: true
  },
  {
    id: '3',
    user: {
      id: '103',
      username: 'alex_designer',
      name: 'Alex Chen',
      avatar: 'https://randomuser.me/api/portraits/women/45.jpg'
    },
    content: 'My latest design project for an eco-friendly packaging company. What do you think?',
    image: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338',
    timestamp: '1 day ago',
    likes: 421,
    comments: 56,
    isLiked: false
  },
  {
    id: '4',
    user: {
      id: '104',
      username: 'travel_tom',
      name: 'Tom Wilson',
      avatar: 'https://randomuser.me/api/portraits/men/67.jpg'
    },
    content: 'Venice, Italy - a city like no other! #travel #venice #italy',
    image: 'https://images.unsplash.com/photo-1514890547357-a9ee288728e0',
    timestamp: '2 days ago',
    likes: 732,
    comments: 41,
    isLiked: true
  }
];

const FeedScreen = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    // Simulate API call to fetch posts
    fetchPosts();
  }, []);

  const fetchPosts = () => {
    // In a real app, this would be an API call
    setTimeout(() => {
      setPosts(MOCK_POSTS);
      setLoading(false);
      setRefreshing(false);
    }, 1000);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchPosts();
  };

  const handleLikePost = (postId) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const isLiked = !post.isLiked;
        return {
          ...post,
          isLiked,
          likes: isLiked ? post.likes + 1 : post.likes - 1
        };
      }
      return post;
    }));
  };

  const navigateToProfile = (userId) => {
    navigation.navigate('Profile', { userId });
  };

  const navigateToComments = (postId) => {
    // You'll need to create a CommentsScreen component
    // navigation.navigate('Comments', { postId });
    console.log(`Navigate to comments for post ${postId}`);
  };

  const renderPostItem = ({ item }) => (
    <View style={styles.postContainer}>
      {/* Post Header */}
      <View style={styles.postHeader}>
        <TouchableOpacity onPress={() => navigateToProfile(item.user.id)} style={styles.userInfo}>
          <Image source={{ uri: item.user.avatar }} style={styles.avatar} />
          <View>
            <Text style={styles.userName}>{item.user.name}</Text>
            <Text style={styles.timestamp}>{item.timestamp}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="ellipsis-horizontal" size={20} color="#666" />
        </TouchableOpacity>
      </View>

      {/* Post Content */}
      <Text style={styles.postContent}>{item.content}</Text>
      
      {/* Post Image (if any) */}
      {item.image && (
        <Image 
          source={{ uri: item.image }} 
          style={styles.postImage}
          resizeMode="cover"
        />
      )}

      {/* Post Actions */}
      <View style={styles.postActions}>
        <View style={styles.actionStats}>
          <Text style={styles.statsText}>{item.likes} likes • {item.comments} comments</Text>
        </View>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton} onPress={() => handleLikePost(item.id)}>
            <Ionicons 
              name={item.isLiked ? "heart" : "heart-outline"} 
              size={22} 
              color={item.isLiked ? "#e74c3c" : "#666"} 
            />
            <Text style={[styles.actionText, item.isLiked && styles.likedText]}>Like</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={() => navigateToComments(item.id)}>
            <Ionicons name="chatbubble-outline" size={22} color="#666" />
            <Text style={styles.actionText}>Comment</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="share-outline" size={22} color="#666" />
            <Text style={styles.actionText}>Share</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Connect</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="chatbubble-outline" size={24} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={renderPostItem}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#6200ee']}
          />
        }
        contentContainerStyle={styles.feedContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </SafeAreaView>
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
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#6200ee',
  },
  headerIcons: {
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: 16,
  },
  feedContent: {
    paddingBottom: 20,
  },
  postContainer: {
    backgroundColor: '#fff',
    padding: 16,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  timestamp: {
    color: '#666',
    fontSize: 12,
  },
  postContent: {
    fontSize: 16,
    marginBottom: 12,
    lineHeight: 22,
  },
  postImage: {
    width: '100%',
    height: 300,
    borderRadius: 8,
    marginBottom: 12,
  },
  postActions: {
    marginTop: 4,
  },
  actionStats: {
    marginBottom: 8,
  },
  statsText: {
    color: '#666',
    fontSize: 14,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  actionText: {
    marginLeft: 6,
    color: '#666',
    fontSize: 14,
  },
  likedText: {
    color: '#e74c3c',
  },
  separator: {
    height: 10,
    backgroundColor: '#f8f8f8',
  },
});

export default FeedScreen;