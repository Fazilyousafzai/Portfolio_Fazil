import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  Image, 
  StyleSheet, 
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const NotificationScreen = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('all'); // 'all' or 'unread'
  const navigation = useNavigation();

  // Mock data for notifications
  const mockNotifications = [
    {
      id: '1',
      type: 'like',
      user: {
        id: 'user1',
        name: 'John Smith',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
      },
      content: 'liked your post',
      postImage: 'https://picsum.photos/id/1015/200',
      time: '2m',
      read: false
    },
    {
      id: '2',
      type: 'comment',
      user: {
        id: 'user2',
        name: 'Emma Johnson',
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
      },
      content: 'commented on your post: "This is amazing!"',
      postImage: null,
      time: '15m',
      read: false
    },
    {
      id: '3',
      type: 'follow',
      user: {
        id: 'user3',
        name: 'Michael Brown',
        avatar: 'https://randomuser.me/api/portraits/men/67.jpg'
      },
      content: 'started following you',
      postImage: null,
      time: '1h',
      read: true
    },
    {
      id: '4',
      type: 'mention',
      user: {
        id: 'user4',
        name: 'Olivia Davis',
        avatar: 'https://randomuser.me/api/portraits/women/17.jpg'
      },
      content: 'mentioned you in a comment: "Hey @janedoe check this out!"',
      postImage: null,
      time: '3h',
      read: true
    },
    {
      id: '5',
      type: 'like',
      user: {
        id: 'user5',
        name: 'Sophia Wilson',
        avatar: 'https://randomuser.me/api/portraits/women/63.jpg'
      },
      content: 'and 12 others liked your photo',
      postImage: 'https://picsum.photos/id/237/200',
      time: '5h',
      read: true
    },
    {
      id: '6',
      type: 'comment',
      user: {
        id: 'user6',
        name: 'William Taylor',
        avatar: 'https://randomuser.me/api/portraits/men/91.jpg'
      },
      content: 'replied to your comment: "I completely agree with you!"',
      postImage: null,
      time: '1d',
      read: true
    },
    {
      id: '7',
      type: 'follow',
      user: {
        id: 'user7',
        name: 'Ava Martinez',
        avatar: 'https://randomuser.me/api/portraits/women/28.jpg'
      },
      content: 'started following you',
      postImage: null,
      time: '2d',
      read: true
    },
    {
      id: '8',
      type: 'system',
      content: 'Welcome to Connect! Complete your profile to connect with friends.',
      time: '3d',
      read: false
    }
  ];

  // Fetch notifications using useCallback to memoize the function
  const fetchNotifications = useCallback(() => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setNotifications(mockNotifications);
      setLoading(false);
      setRefreshing(false);
    }, 1000);
  }, []);  // Empty dependency array as mockNotifications is defined inside component but doesn't change

  // Initial data fetch
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);  // Added fetchNotifications as a dependency

  // Refresh notifications
  const onRefresh = () => {
    setRefreshing(true);
    fetchNotifications();
  };

  // Mark notification as read
  const markAsRead = (notificationId) => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => 
        notification.id === notificationId ? { ...notification, read: true } : notification
      )
    );
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => ({ ...notification, read: true }))
    );
  };

  // Filter notifications based on active tab
  const filteredNotifications = activeTab === 'all' 
    ? notifications 
    : notifications.filter(notification => !notification.read);

  // Render notification icon based on type
  const renderNotificationIcon = (type) => {
    switch(type) {
      case 'like':
        return <Ionicons name="heart" size={16} color="#E91E63" style={styles.actionIcon} />;
      case 'comment':
        return <Ionicons name="chatbubble" size={16} color="#2196F3" style={styles.actionIcon} />;
      case 'follow':
        return <Ionicons name="person-add" size={16} color="#4CAF50" style={styles.actionIcon} />;
      case 'mention':
        return <Ionicons name="at" size={16} color="#FF9800" style={styles.actionIcon} />;
      case 'system':
        return <Ionicons name="information-circle" size={16} color="#607D8B" style={styles.actionIcon} />;
      default:
        return <Ionicons name="notifications" size={16} color="#9E9E9E" style={styles.actionIcon} />;
    }
  };

  // Render notification item
  const renderNotificationItem = ({ item }) => {
    return (
      <TouchableOpacity 
        style={[styles.notificationItem, !item.read && styles.unreadNotification]}
        onPress={() => {
          markAsRead(item.id);
          // Navigate to relevant screen based on notification type
          if (item.type === 'like' || item.type === 'comment' || item.type === 'mention') {
            // TODO: Navigate to post detail
            console.log('Navigate to post detail');
          } else if (item.type === 'follow') {
            // TODO: Navigate to user profile
            console.log('Navigate to user profile');
          }
        }}
      >
        <View style={styles.notificationContent}>
          {item.type !== 'system' ? (
            <Image source={{ uri: item.user.avatar }} style={styles.avatar} />
          ) : (
            <View style={styles.systemIconContainer}>
              {renderNotificationIcon(item.type)}
            </View>
          )}
          
          <View style={styles.textContainer}>
            {item.type !== 'system' && (
              <Text style={styles.userName}>
                {item.user.name}
                {renderNotificationIcon(item.type)}
              </Text>
            )}
            <Text style={[styles.notificationText, !item.read && styles.unreadText]}>
              {item.content}
            </Text>
            <Text style={styles.timeText}>{item.time}</Text>
          </View>
          
          {item.postImage && (
            <Image source={{ uri: item.postImage }} style={styles.postThumbnail} />
          )}
        </View>
        
        <TouchableOpacity style={styles.moreButton}>
          <Ionicons name="ellipsis-horizontal" size={16} color="#999" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  // Render empty state
  const renderEmptyComponent = () => {
    if (loading) return null;
    
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="notifications-off-outline" size={64} color="#ccc" />
        <Text style={styles.emptyTitle}>No notifications yet</Text>
        <Text style={styles.emptySubtitle}>
          {activeTab === 'all' 
            ? "When you receive notifications, they'll appear here" 
            : "You've read all your notifications"}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
        {notifications.some(notif => !notif.read) && (
          <TouchableOpacity style={styles.markAllReadButton} onPress={markAllAsRead}>
            <Text style={styles.markAllReadText}>Mark all as read</Text>
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'all' && styles.activeTab]}
          onPress={() => setActiveTab('all')}
        >
          <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'unread' && styles.activeTab]}
          onPress={() => setActiveTab('unread')}
        >
          <Text style={[styles.tabText, activeTab === 'unread' && styles.activeTabText]}>Unread</Text>
          {notifications.filter(n => !n.read).length > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadBadgeText}>{notifications.filter(n => !n.read).length}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3897f0" />
        </View>
      ) : (
        <FlatList
          data={filteredNotifications}
          renderItem={renderNotificationItem}
          keyExtractor={item => item.id}
          contentContainerStyle={filteredNotifications.length === 0 ? { flex: 1 } : null}
          ListEmptyComponent={renderEmptyComponent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#3897f0']}
            />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  markAllReadButton: {
    padding: 4,
  },
  markAllReadText: {
    color: '#3897f0',
    fontSize: 14,
    fontWeight: '500',
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#3897f0',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#3897f0',
    fontWeight: '600',
  },
  unreadBadge: {
    backgroundColor: '#3897f0',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 6,
  },
  unreadBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  unreadNotification: {
    backgroundColor: '#f0f8ff',
  },
  notificationContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  systemIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f2f2f2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  userName: {
    fontWeight: '600',
    fontSize: 15,
    marginBottom: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIcon: {
    marginLeft: 4,
  },
  notificationText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  unreadText: {
    color: '#333',
  },
  timeText: {
    fontSize: 12,
    color: '#999',
  },
  postThumbnail: {
    width: 60,
    height: 60,
    borderRadius: 4,
    marginLeft: 8,
  },
  moreButton: {
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
    color: '#666',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});

export default NotificationScreen;