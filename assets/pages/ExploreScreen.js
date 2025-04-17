import React from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
} from 'react-native';
import PinCard from '../components/PinCard';
import {
  collection,
  getDocs,
  query,
  doc,
  updateDoc,
  getDoc,
  setDoc,
  orderBy,
} from 'firebase/firestore';
import Animated, { SlideInRight, SlideOutRight } from 'react-native-reanimated';
import { db, auth } from '../../firebase';
import DetailedPinCard from '../components/DetailedPinCard';
import ExploreBar from '../components/ExploreBar';
import ExploreModal from '../components/ExploreModal';

/**
 * Explore screen component
 * @returns {JSX.Element} Rendered explore
 */
const ExploreScreen = () => {
  const [pins, setPins] = React.useState([]);
  const [userVotes, setUserVotes] = React.useState({});
  const [selectPin, setSelectPin] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);

  // For sorting pins
  const [sortType, setSortType] = React.useState('timestamp');
  const [sortOrder, setSortOrder] = React.useState('desc');
  const [showModal, setShowModal] = React.useState(false);

  /**
   * Fetches pins from the database and sets them in state
   * @returns {Promise<void>}
   */
  const fetchPins = async () => {
    const pinsRef = collection(db, 'pins');
    const pinQuery = query(pinsRef, orderBy(sortType, sortOrder));
    const querySnapshot = await getDocs(pinQuery);
    const allMarkers = await Promise.all(
      querySnapshot.docs.map(async pinDoc => {
        const data = pinDoc.data();
        const userId = data.user_id;
        let username = 'Unknown';
        let profilePicture =
          'https://firebasestorage.googleapis.com/v0/b/locale-c7626.firebasestorage.app/o/default-pfp.jpg?alt=media&token=be04cb73-02bd-4a27-b2c0-db648e3cfdb8';

        if (userId) {
          try {
            const userRef = doc(db, 'users', userId);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
              username = userSnap.data().username || 'Unknown';
              profilePicture = userSnap.data().profile_picture || profilePicture;
            }
          } catch (userError) {
            console.error('Error fetching username:', userError);
          }
        }

        return {
          id: pinDoc.id,
          coordinate: {
            latitude: Number(data.coordinate.latitude),
            longitude: Number(data.coordinate.longitude),
          },
          title: data.title,
          description: data.description,
          image: { uri: data.image || 'https://i.imgur.com/lqqIvIr.png' },
          score: data.score || 0,
          username: username,
          user_id: userId,
          timestamp: data.timestamp,
          profile_picture: profilePicture,
        };
      })
    );

    setPins(allMarkers);
  };

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
        newScore = (pins.find(m => m.id === markerId)?.score || 0) - voteType;
        setUserVotes(prev => {
          const newVotes = { ...prev };
          delete newVotes[markerId];
          return newVotes;
        });
      } else {
        // Calculate new score based on previous vote
        newScore = pins.find(m => m.id === markerId)?.score || 0;
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
      setPins(prevMarkers =>
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
      fetchPins();
    }
  };

  const handleLoading = async () => {
    setIsLoading(true);
    await fetchPins();
    await fetchUserVotes();
    setIsLoading(false);
  };

  // Fetch pins on component mount
  React.useEffect(() => {
    handleLoading();
  }, []);

  // Fetch pins on sort type change
  React.useEffect(() => {
    handleLoading();
  }, [sortType, sortOrder]);

  const handlePinPress = pin => {
    setSelectPin(pin);
  };

  const handleSortChange = (mode, order) => {
    setSortType(mode);
    setSortOrder(order);
  };

  return (
    <View style={styles.container}>
      <ExploreModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onSortChange={handleSortChange}
      />
      <ExploreBar
        onSortPress={() => setShowModal(true)}
        onRefresh={handleLoading}
        isSelectedPin={selectPin !== null}
        setPin={setSelectPin}
      />
      <View style={styles.loadingContainer}>{isLoading && <ActivityIndicator size="large" />}</View>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {!isLoading &&
          pins.map(pin => (
            <TouchableOpacity key={pin.id} onPress={() => handlePinPress(pin)}>
              <PinCard
                username={pin.username}
                profile_picture={pin.profile_picture}
                title={pin.title}
                description={pin.description}
                score={pin.score}
                timestamp={pin.timestamp}
                onClickUpvote={() => handleVote(pin.id, 1)}
                onClickDownvote={() => handleVote(pin.id, -1)}
                isUpvoted={userVotes[pin.id] === 1}
                isDownvoted={userVotes[pin.id] === -1}
              />
            </TouchableOpacity>
          ))}
      </ScrollView>
      {selectPin && (
        <Animated.View
          style={styles.overlay}
          entering={SlideInRight.duration(150)}
          exiting={SlideOutRight.duration(150)}
        >
          <DetailedPinCard
            pin={selectPin}
            onClickUpvote={() => handleVote(selectPin.id, 1)}
            onClickDownvote={() => handleVote(selectPin.id, -1)}
            isUpvoted={userVotes[selectPin.id] === 1}
            isDownvoted={userVotes[selectPin.id] === -1}
          />
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8ecf4',
  },
  scrollViewContent: {
    paddingBottom: 200,
  },
  overlay: {
    position: 'absolute',
    top: 132,
    left: 0,
    right: 0,
    bottom: 80,
    zIndex: 100,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
});

export default ExploreScreen;
