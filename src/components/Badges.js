import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  ActivityIndicator,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import styles from '../styles/profileStyles.js';
import { db } from '../services/firebase.js';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import CustomButton from './CustomButton.js';

const Badge = ({ imageURL, title, onPress }) => {
  return (
    <TouchableOpacity style={styles.badgeWrapper} onPress={onPress}>
      <Image source={{ uri: imageURL }} style={styles.badgeImage} />
    </TouchableOpacity>
  );
};

export default function Badges({ userId }) {
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedBadge, setSelectedBadge] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchUserBadges = async () => {
      if (!userId) {
        console.error('User not found.');
        return;
      }
      const userRef = doc(db, `users/${userId}`);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        if (userData.badges && Array.isArray(userData.badges)) {
          fetchBadgeDetails(userData.badges);
        } else {
          setLoading(false);
        }
      } else {
        console.error("User doesn't exist!");
      }
    };

    const fetchBadgeDetails = async badgeIds => {
      const badgeData = [];
      for (const badgeId of badgeIds) {
        const badgeRef = doc(db, `badges/${badgeId}`);
        const badgeSnap = await getDoc(badgeRef);

        if (badgeSnap.exists()) {
          badgeData.push(badgeSnap.data());
        }
      }
      setBadges(badgeData);
      console.log('badges length: ', badges.length);
      setLoading(false);
    };

    fetchUserBadges();
  }, [userId]);

  // Handle badge click
  const handleBadgePress = badge => {
    setSelectedBadge(badge);
    setModalVisible(true);
  };

  return (
    <View style={styles.badgeContainer}>
      <Text style={styles.heading}>Badges</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#fff" />
      ) : badges.length > 0 ? (
        <View style={styles.badges}>
          {badges.map((badge, index) => (
            <Badge
              key={index}
              imageURL={badge.imageURL}
              title={badge.title}
              onPress={() => handleBadgePress(badge)}
            />
          ))}
        </View>
      ) : (
        <Text style={styles.noBadgesText}>No badges earned yet</Text>
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainerBadge}>
            {selectedBadge && (
              <>
                <Image source={{ uri: selectedBadge.imageURL }} style={styles.badgeImageBadge} />
                <Text style={styles.modalSubtitleBadge}>{selectedBadge.title}</Text>
                <CustomButton
                  style={styles.customButtonSmaller}
                  onPress={() => setModalVisible(false)}
                  title="Close"
                />
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}
