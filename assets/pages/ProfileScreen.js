import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Button,
  Image,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Modal,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import {
  doc,
  getDocs,
  collection,
  query,
  where,
  updateDoc,
  getDoc,
  setDoc,
} from 'firebase/firestore';
import { db, auth } from '../../firebase.js';
import { FontAwesome } from '@expo/vector-icons'; // Icon for button
import PinCard from '../components/PinCard';
import styles from '../../stylesheets/profileStyles';
import Badges from '../components/Badges';
import { colors } from '../utils/variables.js';
import * as ImagePicker from 'expo-image-picker';
import uploadImage from '../utils/uploadImage.js';
import CustomButton from '../components/CustomButton.js';

import ColorPicker, {
  Panel1,
  Swatches,
  Preview,
  OpacitySlider,
  HueSlider,
} from 'reanimated-color-picker';

const DEFAULT_USER = {
  profile_picture:
    'https://firebasestorage.googleapis.com/v0/b/locale-c7626.firebasestorage.app/o/default-pfp.jpg?alt=media&token=be04cb73-02bd-4a27-b2c0-db648e3cfdb8',
  username: 'Unknown',
  bio: 'Travel enthusiast | Map lover | Explorer of new places',
  follower_count: 0,
  following_count: 0,
  post_count: 0,
  header_background_color: colors.background,
};

const ProfileScreen = () => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(DEFAULT_USER);
  const [modalVisible, setModalVisible] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [userPins, setUserPins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileImage, setProfileImage] = useState(null);
  const [showColorModal, setShowColorModal] = useState(false);
  const [selectedColor, setSelectedColor] = useState(DEFAULT_USER.header_background_color);
  const [pinCount, setPinCount] = useState(0);
  const [userVotes, setUserVotes] = React.useState({});
  const userId = auth.currentUser?.uid;

  /**
   * Fetches user votes from the database and sets them in state
   * @returns {Promise<void>}
   */
  const fetchUserVotes = async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      const userVotesRef = doc(db, 'userVotes', userId);
      const userVotesDoc = await getDoc(userVotesRef);

      if (userVotesDoc.exists()) {
        const votes = userVotesDoc.data().votes || {};
        setUserVotes(votes);
        console.log('User votes:', votes);
      }
    } catch (error) {
      console.error('Error fetching user votes:', error);
    }
  };

  /**
   * Handles voting on a marker
   * @param {string} markerId - ID of the marker
   * @param {number} voteType - Type of vote (1 for upvote, -1 for downvote)
   * @returns {Promise<void>}
   */
  const handleVote = async (markerId, voteType) => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        Alert.alert('Error', 'You must be logged in to vote');
        return;
      }

      // Get previous vote
      const previousVote = userVotes[markerId];

      // Update local state immediately for better UI responsiveness
      let newScore;
      if (previousVote === voteType) {
        // Remove vote if clicking the same button
        newScore = (userPins.find(m => m.id === markerId)?.score || 0) - voteType;
        setUserVotes(prev => {
          const newVotes = { ...prev };
          delete newVotes[markerId];
          return newVotes;
        });
      } else {
        // Calculate new score based on previous vote
        newScore = userPins.find(m => m.id === markerId)?.score || 0;
        if (previousVote) {
          newScore -= previousVote; // Remove previous vote
        }
        newScore += voteType; // Add new vote
        setUserVotes(prev => ({
          ...prev,
          [markerId]: voteType,
        }));
      }

      // Update UI immediately
      setUserPins(prevMarkers =>
        prevMarkers.map(m => (m.id === markerId ? { ...m, score: newScore } : m))
      );

      // Update Firestore
      const markerRef = doc(db, 'pins', markerId);
      await updateDoc(markerRef, {
        score: newScore,
      });

      // Update user's vote record
      const userVotesRef = doc(db, 'userVotes', userId);

      const newUserVotes =
        previousVote === voteType
          ? // Remove vote if clicking the same button
            Object.fromEntries(Object.entries(userVotes).filter(([key]) => key !== markerId))
          : {
              ...userVotes,
              [markerId]: voteType,
            };

      try {
        await updateDoc(userVotesRef, {
          votes: newUserVotes,
        });
      } catch (error) {
        await setDoc(userVotesRef, {
          votes: newUserVotes,
        });
      }
    } catch (error) {
      console.error('Error updating vote:', error);
      Alert.alert('Error', 'Failed to update vote');

      // Revert local state on error
      loadUserData();
    }
  };

  const handleUpload = async () => {
    try {
      const imageUrl = await uploadImage();
      if (imageUrl && editedData.id) {
        setProfileImage(imageUrl);

        const userRef = doc(db, 'users', editedData.id);
        await updateDoc(userRef, { profile_picture: imageUrl });

        setEditedData({ ...editedData, profile_picture: imageUrl });
        setUserData({ ...userData, profile_picture: imageUrl });
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const loadUserData = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'users'), where('email', '==', user.email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const data = userDoc.data();

        const mergedData = { ...DEFAULT_USER, ...data };

        setUserData(mergedData);
        setEditedData({ ...data, id: userDoc.id });
        setProfileImage(data.profile_picture || DEFAULT_USER.profile_picture);
        setSelectedColor(data.header_background_color || DEFAULT_USER.header_background_color);

        const userPinsQuery = query(collection(db, 'pins'), where('user_id', '==', userDoc.id));
        const userPinsSnapshot = await getDocs(userPinsQuery);

        const numberOfPins = userPinsSnapshot.size;

        const userPinsList = userPinsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setUserPins(userPinsList);
        setPinCount(userPinsSnapshot.size);
      } else {
        console.warn('No user data found!');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!editedData.id) {
      console.error('User document ID is missing.');
      return;
    }

    try {
      const userRef = doc(db, 'users', editedData.id);
      await updateDoc(userRef, {
        profile_picture: editedData.profile_picture,
        username: editedData.username,
        bio: editedData.bio,
        header_background_color: selectedColor,
      });

      setUserData({ ...editedData, header_background_color: selectedColor });
      setModalVisible(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setUser(user);
    });
    fetchUserVotes();
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  return (
    <View style={styles.safeArea}>
      {loading ? (
        <ActivityIndicator style={{ flex: 1 }} size="large" color={colors.background} />
      ) : (
        <>
          <View
            style={[
              styles.headerBackground,
              { backgroundColor: userData.header_background_color || '#1ABB11' },
            ]}
          />

          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.curvedContainer}>
              <View style={styles.insideCurvedContainer}>
                <View style={styles.profileImageContainer}>
                  <Image
                    source={
                      profileImage ? { uri: profileImage } : require('../images/default-pfp.jpg')
                    } // Fallback image
                    style={styles.profileImage}
                  />
                </View>

                {/* Circular Edit Profile Button */}
                <TouchableOpacity
                  style={styles.editProfileButton}
                  onPress={() => setModalVisible(true)}
                >
                  <FontAwesome name="pencil" size={20} color="rgb(209, 207, 202)" />
                </TouchableOpacity>

                {/* Username */}
                <View styles={styles.usernameContainer}>
                  <Text style={styles.username}>{userData.username}</Text>
                </View>
                {/* Location */}

                <View style={styles.locationContainer}>
                  <View>
                    <Image source={require('../images/pin-logo.png')} style={styles.pinLogo} />
                  </View>
                  <Text style={styles.location}>Santa Cruz, CA</Text>
                </View>
                {/* Bio */}
                <Text style={styles.bio}>{userData.bio}</Text>

                {/* Profile Stats */}
                <View style={styles.profileStatsContainer}>
                  <TouchableOpacity
                    style={styles.follower_count}
                    onPress={() => setModalVisible(true)}
                  >
                    <StatBlock label="Followers" value={userData.follower_count} />
                  </TouchableOpacity>

                  <View style={styles.verticalLine} />

                  <View style={styles.follower_count}>
                    <StatBlock label="Following" value={userData.following_count} />
                  </View>

                  <View style={styles.verticalLine} />
                  <View style={styles.follower_count}>
                    <StatBlock label="Pins" value={pinCount} />
                  </View>
                </View>

                {/* Modal for Editing Profile */}
                <Modal animationType="slide" transparent={true} visible={modalVisible}>
                  <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                      <Text style={styles.modalTitle}>Edit Profile</Text>

                      {/* Profile Picture Input */}
                      <View style={styles.modalItem}>
                        <Text style={styles.modalSubtitle}>Update Profile Picture</Text>
                        <TouchableOpacity style={styles.customizeButton} onPress={handleUpload}>
                          <Text style={styles.customizeButtonText}>Upload Image</Text>
                        </TouchableOpacity>
                      </View>

                      {/* color picker */}
                      <View style={styles.colorModalContainer}>
                        <View style={styles.modalItem}>
                          <Text style={styles.modalSubtitle}>Update Header Color</Text>
                          <TouchableOpacity
                            style={styles.customizeButton}
                            onPress={() => setShowColorModal(true)}
                          >
                            <Text style={styles.customizeButtonText}>Change Color</Text>
                          </TouchableOpacity>
                        </View>

                        <Modal transparent={true} visible={showColorModal} animationType="fade">
                          <View style={styles.modalOverlay}>
                            <View style={styles.colorModal}>
                              <ColorPicker
                                value={selectedColor}
                                onComplete={color => setSelectedColor(color.hex)}
                              >
                                <Panel1 />
                                <HueSlider style={{ margin: 20 }} />
                                <Swatches />
                              </ColorPicker>
                              <CustomButton
                                style={{ width: 280 }}
                                title="Save"
                                onPress={() => setShowColorModal(false)}
                              />
                            </View>
                          </View>
                        </Modal>
                      </View>

                      {/* Username Input */}
                      <View style={styles.modalItem}>
                        <Text style={styles.modalSubtitle}>Username:</Text>
                        <View style={styles.inputBox}>
                          <TextInput
                            placeholder="Enter username"
                            value={editedData.username}
                            onChangeText={text => setEditedData({ ...editedData, username: text })}
                          />
                        </View>
                      </View>

                      {/* Bio Input */}
                      <View style={styles.modalItem}>
                        <Text style={styles.modalSubtitle}>Bio:</Text>
                        <View style={styles.inputBox}>
                          <TextInput
                            placeholder="Enter bio"
                            multiline
                            value={editedData.bio}
                            maxLength={150}
                            onChangeText={text => setEditedData({ ...editedData, bio: text })}
                          />
                        </View>
                      </View>

                      {/* Action Buttons */}
                      <View style={styles.buttonRow}>
                        <CustomButton
                          style={{ width: '45%', borderRadius: 20 }}
                          onPress={handleSave}
                          title="Save"
                        ></CustomButton>

                        <CustomButton
                          style={{
                            width: '45%',
                            borderRadius: 20,
                            backgroundColor: colors.offWhiteYellow,
                          }}
                          onPress={() => setModalVisible(false)}
                          title="Cancel"
                        ></CustomButton>
                      </View>
                    </View>
                  </View>
                </Modal>
              </View>
              <View style={styles.greyBackground}>
                <Badges userId={userId}></Badges>

                <Text style={styles.heading}>My Pins</Text>
                {userPins.length > 0 ? (
                  userPins.map(pin => (
                    <PinCard
                      key={pin.id}
                      username={userData.username}
                      title={pin.title}
                      description={pin.description}
                      score={pin.score}
                      timestamp={pin.timestamp}
                      onClickUpvote={() => handleVote(pin.id, 1)}
                      onClickDownvote={() => handleVote(pin.id, -1)}
                      isUpvoted={userVotes[pin.id] === 1}
                      isDownvoted={userVotes[pin.id] === -1}
                    />
                  ))
                ) : (
                  <Text
                    style={{
                      fontFamily: 'SourceSerif4-Regular',
                      textAlign: 'center',
                      marginVertical: 10,
                    }}
                  >
                    No pins yet.
                  </Text>
                )}
              </View>
            </View>
          </ScrollView>
        </>
      )}
    </View>
  );
};

const StatBlock = ({ label, value }) => (
  <View style={styles.statBlock}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

export default ProfileScreen;
