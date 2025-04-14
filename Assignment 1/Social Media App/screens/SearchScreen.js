import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  Keyboard
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// Mock data for trending topics
const TRENDING_TOPICS = [
  { id: '1', name: 'technology', posts: 1423 },
  { id: '2', name: 'travel', posts: 982 },
  { id: '3', name: 'photography', posts: 876 },
  { id: '4', name: 'food', posts: 754 },
  { id: '5', name: 'fitness', posts: 621 },
  { id: '6', name: 'music', posts: 519 },
];

// Mock data for suggested users
const SUGGESTED_USERS = [
  { 
    id: '101', 
    username: 'sarah_johnson', 
    name: 'Sarah Johnson', 
    avatar: 'https://randomuser.me/api/portraits/women/12.jpg',
    isVerified: true
  },
  { 
    id: '102', 
    username: 'mike_rover', 
    name: 'Mike Rover', 
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    isVerified: false
  },
  { 
    id: '103', 
    username: 'alex_designer', 
    name: 'Alex Chen', 
    avatar: 'https://randomuser.me/api/portraits/women/45.jpg',
    isVerified: true
  },
  { 
    id: '104', 
    username: 'travel_tom', 
    name: 'Tom Wilson', 
    avatar: 'https://randomuser.me/api/portraits/men/67.jpg',
    isVerified: false
  },
];

// Mock search results
const MOCK_SEARCH_RESULTS = {
  users: [
    { 
      id: '201', 
      username: 'tech_jane', 
      name: 'Jane Smith', 
      avatar: 'https://randomuser.me/api/portraits/women/22.jpg',
      isVerified: false,
      followers: 1502
    },
    { 
      id: '202', 
      username: 'travel_adventures', 
      name: 'Travel Adventures', 
      avatar: 'https://randomuser.me/api/portraits/men/43.jpg',
      isVerified: true,
      followers: 24300
    },
  ],
  hashtags: [
    { id: '301', name: 'technology', posts: 1423 },
    { id: '302', name: 'techtrends', posts: 892 },
    { id: '303', name: 'techtips', posts: 654 },
  ],
  locations: [
    { id: '401', name: 'Tech Hub, San Francisco', posts: 3421 },
    { id: '402', name: 'Tech Conference Center', posts: 982 },
  ]
};

const SearchScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [recentSearches, setRecentSearches] = useState(['photography', 'travel', 'food']);
  const [activeTab, setActiveTab] = useState('trending');

  useEffect(() => {
    // Clear search results when query is empty
    if (searchQuery.trim() === '') {
      setSearchResults(null);
      setSearching(false);
    }
  }, [searchQuery]);

  const handleSearch = () => {
    if (searchQuery.trim() === '') return;
    
    Keyboard.dismiss();
    setSearching(true);
    
    // Simulate API search
    setTimeout(() => {
      // Store in recent searches if not already there
      if (!recentSearches.includes(searchQuery.toLowerCase())) {
        setRecentSearches(prev => [searchQuery.toLowerCase(), ...prev].slice(0, 5));
      }
      
      // Filter mock results based on query (in real app, this would be a backend search)
      const filteredResults = {
        users: MOCK_SEARCH_RESULTS.users.filter(user => 
          user.username.includes(searchQuery.toLowerCase()) || 
          user.name.toLowerCase().includes(searchQuery.toLowerCase())
        ),
        hashtags: MOCK_SEARCH_RESULTS.hashtags.filter(hashtag => 
          hashtag.name.includes(searchQuery.toLowerCase())
        ),
        locations: MOCK_SEARCH_RESULTS.locations.filter(location => 
          location.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      };
      
      setSearchResults(filteredResults);
      setSearching(false);
    }, 1000);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults(null);
  };

  const removeRecentSearch = (search) => {
    setRecentSearches(prev => prev.filter(item => item !== search));
  };

  const navigateToProfile = (userId) => {
    navigation.navigate('Profile', { userId });
  };

  const navigateToHashtag = (hashtag) => {
    // Navigate to hashtag page
    console.log(`Navigate to hashtag: ${hashtag}`);
  };

  const navigateToLocation = (location) => {
    // Navigate to location page
    console.log(`Navigate to location: ${location}`);
  };

  const renderTrendingTopic = ({ item }) => (
    <TouchableOpacity 
      style={styles.trendingItem}
      onPress={() => navigateToHashtag(item.name)}
    >
      <View style={styles.trendingIcon}>
        <Ionicons name="trending-up" size={20} color="#6200ee" />
      </View>
      <View style={styles.trendingContent}>
        <Text style={styles.trendingName}>#{item.name}</Text>
        <Text style={styles.trendingPosts}>{item.posts} posts</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color="#ccc" />
    </TouchableOpacity>
  );

  const renderSuggestedUser = ({ item }) => (
    <TouchableOpacity 
      style={styles.userItem}
      onPress={() => navigateToProfile(item.id)}
    >
      <Image source={{ uri: item.avatar }} style={styles.userAvatar} />
      <View style={styles.userInfo}>
        <View style={styles.nameContainer}>
          <Text style={styles.userName}>{item.name}</Text>
          {item.isVerified && (
            <Ionicons name="checkmark-circle" size={14} color="#6200ee" style={styles.verifiedBadge} />
          )}
        </View>
        <Text style={styles.userUsername}>@{item.username}</Text>
      </View>
      <TouchableOpacity style={styles.followButton}>
        <Text style={styles.followButtonText}>Follow</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderSearchResultUser = ({ item }) => (
    <TouchableOpacity 
      style={styles.userItem}
      onPress={() => navigateToProfile(item.id)}
    >
      <Image source={{ uri: item.avatar }} style={styles.userAvatar} />
      <View style={styles.userInfo}>
        <View style={styles.nameContainer}>
          <Text style={styles.userName}>{item.name}</Text>
          {item.isVerified && (
            <Ionicons name="checkmark-circle" size={14} color="#6200ee" style={styles.verifiedBadge} />
          )}
        </View>
        <Text style={styles.userUsername}>@{item.username}</Text>
      </View>
      <Text style={styles.followersCount}>{item.followers} followers</Text>
    </TouchableOpacity>
  );

  const renderRecentSearch = ({ item }) => (
    <View style={styles.recentSearchItem}>
      <TouchableOpacity 
        style={styles.recentSearchContent}
        onPress={() => {
          setSearchQuery(item);
          handleSearch();
        }}
      >
        <Ionicons name="time-outline" size={18} color="#666" />
        <Text style={styles.recentSearchText}>{item}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => removeRecentSearch(item)}>
        <Ionicons name="close" size={18} color="#666" />
      </TouchableOpacity>
    </View>
  );

  const renderHashtagResult = ({ item }) => (
    <TouchableOpacity 
      style={styles.resultItem}
      onPress={() => navigateToHashtag(item.name)}
    >
      <View style={styles.resultIcon}>
        <Ionicons name="pricetag-outline" size={20} color="#6200ee" />
      </View>
      <View style={styles.resultContent}>
        <Text style={styles.resultName}>#{item.name}</Text>
        <Text style={styles.resultDetails}>{item.posts} posts</Text>
      </View>
    </TouchableOpacity>
  );

  const renderLocationResult = ({ item }) => (
    <TouchableOpacity 
      style={styles.resultItem}
      onPress={() => navigateToLocation(item.name)}
    >
      <View style={styles.resultIcon}>
        <Ionicons name="location-outline" size={20} color="#6200ee" />
      </View>
      <View style={styles.resultContent}>
        <Text style={styles.resultName}>{item.name}</Text>
        <Text style={styles.resultDetails}>{item.posts} posts</Text>
      </View>
    </TouchableOpacity>
  );

  const renderSearchResults = () => {
    if (searching) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6200ee" />
        </View>
      );
    }

    if (!searchResults) {
      return (
        <>
          {recentSearches.length > 0 && (
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recent Searches</Text>
                <TouchableOpacity onPress={() => setRecentSearches([])}>
                  <Text style={styles.clearText}>Clear All</Text>
                </TouchableOpacity>
              </View>
              <FlatList
                data={recentSearches}
                renderItem={renderRecentSearch}
                keyExtractor={(item) => item}
                scrollEnabled={false}
              />
            </View>
          )}

          <View style={styles.tabsContainer}>
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'trending' && styles.activeTab]}
              onPress={() => setActiveTab('trending')}
            >
              <Text style={[styles.tabText, activeTab === 'trending' && styles.activeTabText]}>
                Trending
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'accounts' && styles.activeTab]}
              onPress={() => setActiveTab('accounts')}
            >
              <Text style={[styles.tabText, activeTab === 'accounts' && styles.activeTabText]}>
                Accounts
              </Text>
            </TouchableOpacity>
          </View>

          {activeTab === 'trending' && (
            <FlatList
              data={TRENDING_TOPICS}
              renderItem={renderTrendingTopic}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          )}

          {activeTab === 'accounts' && (
            <View style={styles.suggestedContainer}>
              <Text style={styles.suggestedTitle}>Suggested for you</Text>
              <FlatList
                data={SUGGESTED_USERS}
                renderItem={renderSuggestedUser}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
              />
            </View>
          )}
        </>
      );
    }

    return (
      <View style={styles.searchResultsContainer}>
        {searchResults.users.length > 0 && (
          <View style={styles.resultSection}>
            <Text style={styles.resultSectionTitle}>Users</Text>
            <FlatList
              data={searchResults.users}
              renderItem={renderSearchResultUser}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          </View>
        )}

        {searchResults.hashtags.length > 0 && (
          <View style={styles.resultSection}>
            <Text style={styles.resultSectionTitle}>Hashtags</Text>
            <FlatList
              data={searchResults.hashtags}
              renderItem={renderHashtagResult}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          </View>
        )}

        {searchResults.locations.length > 0 && (
          <View style={styles.resultSection}>
            <Text style={styles.resultSectionTitle}>Places</Text>
            <FlatList
              data={searchResults.locations}
              renderItem={renderLocationResult}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          </View>
        )}

        {searchResults.users.length === 0 && 
         searchResults.hashtags.length === 0 && 
         searchResults.locations.length === 0 && (
          <View style={styles.noResultsContainer}>
            <Ionicons name="search-outline" size={48} color="#ccc" />
            <Text style={styles.noResultsText}>No results found</Text>
            <Text style={styles.noResultsSubtext}>
              Try searching for a different term or check your spelling
            </Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchHeader}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search users, hashtags, places..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
            autoCapitalize="none"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <Ionicons name="close-circle" size={18} color="#666" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        data={[]}
        renderItem={null}
        ListHeaderComponent={renderSearchResults}
        keyboardShouldPersistTaps="handled"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  clearButton: {
    padding: 4,
  },
  loadingContainer: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  sectionContainer: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  clearText: {
    color: '#6200ee',
    fontSize: 14,
  },
  recentSearchItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  recentSearchContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recentSearchText: {
    marginLeft: 12,
    fontSize: 16,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 8,
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
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: '#6200ee',
    fontWeight: 'bold',
  },
  trendingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  trendingIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f0e5ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  trendingContent: {
    flex: 1,
  },
  trendingName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  trendingPosts: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  suggestedContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  suggestedTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  userAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  verifiedBadge: {
    marginLeft: 4,
  },
  userUsername: {
    fontSize: 14,
    color: '#666',
  },
  followButton: {
    backgroundColor: '#6200ee',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 4,
  },
  followButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  followersCount: {
    fontSize: 12,
    color: '#666',
  },
  searchResultsContainer: {
    paddingTop: 8,
  },
  resultSection: {
    marginBottom: 16,
  },
  resultSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  resultIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f0e5ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  resultContent: {
    flex: 1,
  },
  resultName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultDetails: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  noResultsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  noResultsSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  }
});

export default SearchScreen;