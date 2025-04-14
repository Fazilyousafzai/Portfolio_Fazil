import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  ScrollView, 
  StyleSheet, 
  Alert,
  Platform,
  ActivityIndicator 
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';

const CreatePostScreen = () => {
  const [postText, setPostText] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [isPosting, setIsPosting] = useState(false);
  const [location, setLocation] = useState('');
  const [showLocationInput, setShowLocationInput] = useState(false);
  const [postPrivacy, setPostPrivacy] = useState('public'); // 'public', 'friends', 'private'
  
  const textInputRef = useRef(null);
  const navigation = useNavigation();

  const pickImage = async () => {
    // Request permission first
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Sorry, we need camera roll permissions to make this work!');
        return;
      }
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      allowsMultipleSelection: true,
      selectionLimit: 4 - selectedImages.length, // Limit to 4 images total
    });

    if (!result.canceled) {
      // Handle multiple selection
      const newImages = result.assets ? result.assets.map(item => item.uri) : [result.uri];
      
      // Check if adding new images exceeds the limit
      if (selectedImages.length + newImages.length > 4) {
        Alert.alert('Limit Exceeded', 'You can only select up to 4 images');
        return;
      }
      
      setSelectedImages([...selectedImages, ...newImages]);
    }
  };

  const takePhoto = async () => {
    // Request permission first
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Sorry, we need camera permissions to make this work!');
        return;
      }
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const newImage = result.assets ? result.assets[0].uri : result.uri;
      
      // Check if adding new image exceeds the limit
      if (selectedImages.length >= 4) {
        Alert.alert('Limit Exceeded', 'You can only select up to 4 images');
        return;
      }
      
      setSelectedImages([...selectedImages, newImage]);
    }
  };

  const removeImage = (index) => {
    const newImages = [...selectedImages];
    newImages.splice(index, 1);
    setSelectedImages(newImages);
  };

  const handlePost = () => {
    if (postText.trim() === '' && selectedImages.length === 0) {
      Alert.alert('Empty Post', 'Please add some text or images to your post');
      return;
    }

    setIsPosting(true);
    
    // Simulate API call
    setTimeout(() => {
      // TODO: Replace with actual API call to create post
      console.log('Post Content:', postText);
      console.log('Post Images:', selectedImages);
      console.log('Location:', location);
      console.log('Privacy:', postPrivacy);
      
      setIsPosting(false);
      Alert.alert('Success', 'Your post has been published!');
      
      // Reset form
      setPostText('');
      setSelectedImages([]);
      setLocation('');
      setShowLocationInput(false);
      
      // Navigate back to feed
      navigation.goBack();
    }, 1500);
  };

  const togglePrivacy = () => {
    if (postPrivacy === 'public') {
      setPostPrivacy('friends');
    } else if (postPrivacy === 'friends') {
      setPostPrivacy('private');
    } else {
      setPostPrivacy('public');
    }
  };

  const renderPrivacyIcon = () => {
    switch (postPrivacy) {
      case 'public':
        return <Ionicons name="globe-outline" size={22} color="#333" />;
      case 'friends':
        return <Ionicons name="people-outline" size={22} color="#333" />;
      case 'private':
        return <Ionicons name="lock-closed-outline" size={22} color="#333" />;
      default:
        return <Ionicons name="globe-outline" size={22} color="#333" />;
    }
  };

  const renderPrivacyText = () => {
    switch (postPrivacy) {
      case 'public':
        return 'Public';
      case 'friends':
        return 'Friends';
      case 'private':
        return 'Only Me';
      default:
        return 'Public';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="close" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Post</Text>
        <TouchableOpacity 
          onPress={handlePost} 
          style={[styles.postButton, (!postText.trim() && selectedImages.length === 0) ? styles.postButtonDisabled : null]}
          disabled={(!postText.trim() && selectedImages.length === 0) || isPosting}
        >
          {isPosting ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={styles.postButtonText}>Post</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.contentContainer}>
        <View style={styles.userInfoContainer}>
          <Image 
            source={{ uri: 'https://randomuser.me/api/portraits/men/12.jpg' }} 
            style={styles.userAvatar} 
          />
          <View style={styles.userNamePrivacyContainer}>
            <Text style={styles.userName}>Fazil Yousafzai</Text>
            <TouchableOpacity style={styles.privacySelector} onPress={togglePrivacy}>
              <View style={styles.privacyContainer}>
                {renderPrivacyIcon()}
                <Text style={styles.privacyText}>{renderPrivacyText()}</Text>
                <Ionicons name="chevron-down" size={16} color="#666" />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <TextInput
          ref={textInputRef}
          style={styles.postInput}
          placeholder="What's on your mind?"
          multiline
          value={postText}
          onChangeText={setPostText}
          autoFocus
        />

        {selectedImages.length > 0 && (
          <View style={styles.imagePreviewContainer}>
            {selectedImages.length === 1 ? (
              <View style={styles.singleImageContainer}>
                <Image source={{ uri: selectedImages[0] }} style={styles.singleImagePreview} />
                <TouchableOpacity style={styles.removeImageButton} onPress={() => removeImage(0)}>
                  <Ionicons name="close-circle" size={24} color="white" />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.multipleImageContainer}>
                {selectedImages.map((image, index) => (
                  <View key={index} style={styles.imagePreviewWrapper}>
                    <Image source={{ uri: image }} style={styles.imagePreview} />
                    <TouchableOpacity style={styles.removeImageButton} onPress={() => removeImage(index)}>
                      <Ionicons name="close-circle" size={22} color="white" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {showLocationInput && (
          <View style={styles.locationInputContainer}>
            <Ionicons name="location-outline" size={20} color="#666" style={styles.locationIcon} />
            <TextInput
              style={styles.locationInput}
              placeholder="Add location"
              value={location}
              onChangeText={setLocation}
            />
          </View>
        )}
      </ScrollView>

      <View style={styles.actionBar}>
        <Text style={styles.addToYourPostText}>Add to your post:</Text>
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton} onPress={pickImage}>
            <Ionicons name="image-outline" size={24} color="#4CAF50" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={takePhoto}>
            <Ionicons name="camera-outline" size={24} color="#F44336" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={() => setShowLocationInput(!showLocationInput)}>
            <Ionicons name="location-outline" size={24} color="#2196F3" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <MaterialIcons name="emoji-emotions" size={24} color="#FFC107" />
          </TouchableOpacity>
        </View>
      </View>
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
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  postButton: {
    backgroundColor: '#3897f0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  postButtonDisabled: {
    backgroundColor: '#b2dffc',
  },
  postButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userNamePrivacyContainer: {
    flex: 1,
  },
  userName: {
    fontWeight: '600',
    fontSize: 16,
  },
  privacySelector: {
    marginTop: 4,
  },
  privacyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  privacyText: {
    fontSize: 12,
    color: '#333',
    marginHorizontal: 4,
  },
  postInput: {
    fontSize: 18,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  imagePreviewContainer: {
    marginTop: 16,
    marginBottom: 16,
  },
  singleImageContainer: {
    position: 'relative',
  },
  singleImagePreview: {
    width: '100%',
    height: 300,
    borderRadius: 8,
  },
  multipleImageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  imagePreviewWrapper: {
    position: 'relative',
    width: '48%',
    marginBottom: 8,
  },
  imagePreview: {
    width: '100%',
    height: 150,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 12,
  },
  locationInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 16,
  },
  locationIcon: {
    marginRight: 8,
  },
  locationInput: {
    flex: 1,
    fontSize: 16,
  },
  actionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  addToYourPostText: {
    fontSize: 14,
    color: '#666',
  },
  actionButtons: {
    flexDirection: 'row',
  },
  actionButton: {
    marginLeft: 24,
  },
});

export default CreatePostScreen;