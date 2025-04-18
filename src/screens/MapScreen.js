import React, { useState, useRef, useEffect } from 'react';
import {
  TouchableOpacity,
  TouchableWithoutFeedback,
  ActivityIndicator,
  StyleSheet,
  View,
  Text,
  Image,
  Animated,
  Alert,
  TextInput,
  Modal,
  Keyboard,
  FlatList,
} from 'react-native';
import MapView, { Marker, Callout, CalloutSubview } from 'react-native-maps';
import { CheckBox } from 'react-native-elements';
import mapstyles from '../styles/mapstyles.js';
import styles from '../styles/styles.js';
import commentstyles from '../styles/commentstyles.js';
import { colors } from '../constants/variables.js';
import Slider from '@react-native-community/slider';
import CustomButton from '../components/CustomButton';
import usePanResponder from '../constants/usePanResponder';

import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  getDoc,
  setDoc,
} from 'firebase/firestore';
import { db, auth } from '../services/firebase';
import {
  filterMarkersByScore,
  filterMarkersByUser,
  filterMarkersByFriends,
  filterMarkersByDate,
  filterMarkersByTime,
} from '../services/filterFunctions';

import CommentCard from '../components/CommentCard';
import {
  handleCommentSubmit,
  loadComments,
  loadCommentVotes,
  handleCommentVote,
} from '../components/CommentCard';

export default function MapScreen() {
  const [currentMarkers, setCurrentMarkers] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [draggedPosition, setDraggedPosition] = useState(null);
  const [messageVisible, setMessageVisible] = useState(false);
  const [tempMarker, setTempMarker] = useState(null); // stores marker in a temporary marker in case the user cancels their placement. saves storage.

  const [markerTitle, setMarkerTitle] = useState('');
  const [markerDescription, setMarkerDescription] = useState('');
  const [markerScore, setMarkerScore] = useState(0);
  const [markerUsername, setMarkerUsername] = useState('Unknown');

  const markerScales = React.useRef({});
  const [pressedButton, setPressedButton] = useState(null);
  const [userVotes, setUserVotes] = useState({});

  const mapRef = useRef(null);
  let panMove = false;

  const { pan, panResponder } = usePanResponder(
    mapRef,
    setDraggedPosition,
    setTempMarker,
    setMessageVisible
  );

  const [loading, setLoading] = useState(true); // helps load all the pins on startup

  // Filter pins

  const [filterVisible, setFilterVisible] = useState(false);
  const [isPopularFiltered, setisPopularFiltered] = useState(false);
  const [isUserFiltered, setIsUserFiltered] = useState(false);
  const [isFriendsFiltered, setIsFriendsFiltered] = useState(false);
  const [isFiltered, setIsFiltered] = useState(false);

  const [isRecentChecked, setIsRecentChecked] = useState(false);

  const [timeFilterValue, setTimeFilterValue] = useState(0);
  const [isTimeFilterActive, setIsTimeFilterActive] = useState(false);

  // Comments
  const [commentsVisible, setCommentsVisible] = useState(false);
  const [commentDescription, setCommentDescription] = useState('');
  const [selectedMarkerId, setSelectedMarkerId] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentVotes, setCommentVotes] = useState({});

  const [selectedTimeFilter, setSelectedTimeFilter] = useState('all'); // 'all', 'day', 'week', 'year'

  // Loads all markers
  const loadAllMarkers = async () => {
    try {
      const pinsRef = collection(db, 'pins');
      const querySnapshot = await getDocs(pinsRef);
      const userId = auth.currentUser?.uid;

      if (!querySnapshot || querySnapshot.empty) {
        setLoading(false);
        return;
      }

      const allMarkers = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          coordinate: {
            latitude: Number(data.coordinate.latitude),
            longitude: Number(data.coordinate.longitude),
          },
          title: data.title,
          description: data.description,
          image: { uri: data.image || 'https://i.imgur.com/lqqIvIr.png' },
          score: data.score || 0,
          isMine: data.user_id === userId,
          username: data.username || 'Unknown',
          user_id: data.user_id,
        };
      });

      setMarkers(allMarkers);
      setIsFiltered(false);
      setCurrentMarkers(allMarkers);

      setTimeFilterValue(0);
      setIsTimeFilterActive(false);
    } catch (error) {
      console.error('Firestore error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserVotes = async () => {
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
      console.error('Error loading user votes:', error);
    }
  };

  // create a marker if message is being written
  const handleMessageSubmit = async () => {
    let username = 'Unknown';

    const userId = auth.currentUser.uid;
    if (userId) {
      try {
        const userRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          username = userSnap.data().username || 'Unknown';
        }
      } catch (userError) {
        console.error('Error fetching username:', userError);
      }
    }

    if (tempMarker) {
      const finalMarker = {
        ...tempMarker,
        title: markerTitle || 'Unnamed Location',
        description: markerDescription || 'No description provided',
        image: 'https://i.imgur.com/lqqIvIr.png',
        score: markerScore || 0,
        username: username,
        user_id: auth.currentUser.uid,
      };

      try {
        const docRef = await addDoc(collection(db, 'pins'), {
          user_id: auth.currentUser.uid,
          timestamp: new Date(),
          coordinate: {
            latitude: finalMarker.coordinate?.latitude,
            longitude: finalMarker.coordinate?.longitude,
          },
          image: finalMarker.image,
          title: finalMarker.title,
          description: finalMarker.description,
          score: finalMarker.score,
          username: finalMarker.username,
          user_id: finalMarker.user_id,
        });

        finalMarker.id = docRef.id;

        markerScales.current[finalMarker.id] = new Animated.Value(1);

        setMarkers(prevMarkers => [...prevMarkers, finalMarker]);
        setCurrentMarkers(prevMarkers => [...prevMarkers, finalMarker]);
      } catch (error) {
        console.error('Error adding pin to Firestore:', error);
      }
    }
    setMessageVisible(false);
    setMarkerTitle('');
    setMarkerDescription('');
    setMarkerScore(0);
    setTempMarker(null);
  };

  // Update handleVote to handle vote removal and optimize UI updates
  const handleVote = async (markerId, voteType) => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        Alert.alert('Error', 'You must be logged in to vote');
        return;
      }

      // Get previous vote
      const previousVote = userVotes[markerId];

      // Calculate new score
      const currentMarker = markers.find(m => m.id === markerId);
      let newScore = currentMarker?.score || 0;

      // Update votes state based on click behavior
      if (previousVote === voteType) {
        // Clicking same button - remove vote
        newScore -= voteType;
        setUserVotes(prev => {
          const newVotes = { ...prev };
          delete newVotes[markerId];
          return newVotes;
        });
      } else {
        // New vote or changing vote
        if (previousVote) {
          newScore -= previousVote; // Remove previous vote
        }
        newScore += voteType;
        setUserVotes(prev => ({
          ...prev,
          [markerId]: voteType,
        }));
      }

      // Update UI immediately
      const updateMarkerList = prevMarkers =>
        prevMarkers.map(m => (m.id === markerId ? { ...m, score: newScore } : m));

      setMarkers(updateMarkerList);
      setCurrentMarkers(updateMarkerList);

      // Clear the pressed button state
      setPressedButton(null);

      // Update Firestore - pin score
      const markerRef = doc(db, 'pins', markerId);
      await updateDoc(markerRef, {
        score: newScore,
      });

      // Update Firestore - user votes
      const userVotesRef = doc(db, 'userVotes', userId);
      const newVoteData =
        previousVote === voteType
          ? { [markerId]: null } // Remove vote if clicking same button
          : { [markerId]: voteType }; // Set new vote

      await setDoc(
        userVotesRef,
        {
          votes: newVoteData,
        },
        { merge: true }
      );
    } catch (error) {
      console.error('Error updating vote:', error);
      Alert.alert('Error', 'Failed to update vote');
      // Revert local state on error
      await loadAllMarkers();
      await loadUserVotes();
    }
  };

  // Removing markers from the map
  const removeAllMarkers = () => {
    setMarkers([]);

    setisPopularFiltered(false);
    setIsUserFiltered(false);
    setIsFriendsFiltered(false);
  };

  // Filters
  const handleFilterByScore = () => {
    setIsUserFiltered(false);
    setIsFriendsFiltered(false);
    setMarkers(markers);
    const filteredMarkers = filterMarkersByScore(markers);
    setCurrentMarkers(filteredMarkers);
  };

  const handleFilterByUser = async () => {
    setisPopularFiltered(false);
    setIsFriendsFiltered(false);
    setMarkers(markers);
    const filteredMarkers = await filterMarkersByUser(markers);
    setCurrentMarkers(filteredMarkers);
  };

  const handleFilterByFriends = async () => {
    setisPopularFiltered(false);
    setIsUserFiltered(false);
    setMarkers(markers);
    const filteredMarkers = await filterMarkersByFriends(markers);
    setCurrentMarkers(filteredMarkers);
  };

  // Modify the handleFilterByTime function
  const handleFilterByTime = async timeFilter => {
    try {
      setSelectedTimeFilter(timeFilter);

      if (timeFilter === 'all') {
        await loadAllMarkers();
        return;
      }

      const filteredMarkers = await filterMarkersByTime(timeFilter);
      if (filteredMarkers) {
        setCurrentMarkers(filteredMarkers); // Update currentMarkers instead of markers
        setIsFiltered(true);
      }
    } catch (error) {
      console.error('Error filtering markers by time:', error);
      Alert.alert('Error', 'Failed to filter markers by time');
    }
  };

  // ensures all markers load on startup
  useEffect(() => {
    const fetchData = async () => {
      await loadAllMarkers();
      await loadUserVotes();
    };
    fetchData();
  }, []);

  useEffect(() => {
    loadCommentVotes(setCommentVotes);
  }, []);

  React.useEffect(() => {
    markers.forEach(marker => {
      if (!markerScales.current[marker.id]) {
        markerScales.current[marker.id] = new Animated.Value(1);
      }
    });
  }, [markers]); // Add markers as dependency

  return (
    <View style={mapstyles.container}>
      {loading ? (
        <ActivityIndicator style={{ flex: 1 }} size="large" color={colors.background} />
      ) : (
        <>
          <MapView
            ref={mapRef}
            style={mapstyles.map}
            initialRegion={{
              latitude: 36.974117,
              longitude: -122.030792,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            mapType="mutedStandard"
            showsTraffic={false}
            showsBuildings={true}
            showsCompass={true}
            showsScale={true}
            showsPointsOfInterest={true}
            showsUserLocation={true}
            userLocationAnnotationTitle="You are here"
            showsMyLocationButton={true}
            followsUserLocation={true}
          >
            {currentMarkers.map(marker => (
              <Marker
                key={marker.id}
                coordinate={marker.coordinate}
                title={marker.title}
                score={marker.score}
                description={marker.description}
                draggable={marker.user_id === auth.currentUser.uid} // only allow dragging if the current user owns the pin
                image={marker.image}
                onDragEnd={e => {
                  // when we finish dragging marker, update location
                  if (marker.user_id === auth.currentUser.uid) {
                    // Check if the current user owns the pin
                    const updatedMarkers = markers.map(m =>
                      m.id === marker.id ? { ...m, coordinate: e.nativeEvent.coordinate } : m
                    );
                    setMarkers(updatedMarkers);

                    if (marker.id) {
                      const markerRef = doc(db, 'pins', marker.id);
                      updateDoc(markerRef, {
                        coordinate: e.nativeEvent.coordinate,
                      }).catch(error => {
                        console.error('Error updating marker:', error);
                      });
                    } else {
                      console.error('Marker ID is undefined:', marker);
                    }
                  }
                }}
              >
                <Animated.View
                  style={{
                    padding: 10,
                    transform: markerScales.current[marker.id]
                      ? [{ scale: markerScales.current[marker.id] }]
                      : [],
                  }}
                ></Animated.View>
                <Callout tooltip>
                  <View style={mapstyles.calloutWrapper}>
                    <View style={mapstyles.calloutContent}>
                      <View style={mapstyles.calloutTextContainer}>
                        <Text style={mapstyles.calloutTitle}>{marker.title}</Text>
                        <Text style={mapstyles.calloutDescription}>{marker.description}</Text>
                        <Text style={mapstyles.calloutUsername}>{marker.username}</Text>
                        <CalloutSubview
                          style={[commentstyles.commentButton]}
                          onPress={() => {
                            setSelectedMarkerId(marker.id);
                            loadComments(marker.id, setComments);
                            setCommentsVisible(true);
                          }}
                        >
                          <Text style={commentstyles.commentButtonText}>View Comments</Text>
                        </CalloutSubview>
                      </View>
                      <View style={mapstyles.voteContainer}>
                        <CalloutSubview
                          onPress={() => {
                            setPressedButton(`${marker.id}-up`);
                            handleVote(marker.id, 1);
                          }}
                        >
                          <View
                            style={[
                              mapstyles.voteButton,
                              userVotes[marker.id] === 1 && mapstyles.voteButtonActive,
                              pressedButton === `${marker.id}-up` && mapstyles.voteButtonPressed,
                            ]}
                          >
                            <Text
                              style={[
                                mapstyles.voteButtonText,
                                userVotes[marker.id] === 1 && mapstyles.voteButtonTextActive,
                              ]}
                            >
                              ▲
                            </Text>
                          </View>
                        </CalloutSubview>

                        <Text style={mapstyles.voteScore}>{marker.score}</Text>

                        <CalloutSubview
                          onPress={() => {
                            setPressedButton(`${marker.id}-down`);
                            handleVote(marker.id, -1);
                          }}
                        >
                          <View
                            style={[
                              mapstyles.voteButton,
                              userVotes[marker.id] === -1 && mapstyles.voteButtonActive,
                              pressedButton === `${marker.id}-down` && mapstyles.voteButtonPressed,
                            ]}
                          >
                            <Text
                              style={[
                                mapstyles.voteButtonText,
                                userVotes[marker.id] === -1 && mapstyles.voteButtonTextActive,
                              ]}
                            >
                              ▼
                            </Text>
                          </View>
                        </CalloutSubview>
                      </View>
                    </View>
                  </View>
                </Callout>
              </Marker>
            ))}
          </MapView>

          <Modal
            animationType="slide"
            transparent={true}
            visible={messageVisible}
            onRequestClose={() => {
              setMessageVisible(false);
              setTempMarker(null);
            }}
          >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
              <View style={mapstyles.centeredView}>
                <View style={mapstyles.messageView}>
                  <Text style={mapstyles.messageTitle}>New Pin Details</Text>

                  <TextInput
                    style={mapstyles.input}
                    placeholder="Enter title"
                    value={markerTitle}
                    onChangeText={setMarkerTitle}
                  />

                  <TextInput
                    style={[mapstyles.input, mapstyles.textArea]}
                    placeholder="Enter description"
                    value={markerDescription}
                    onChangeText={setMarkerDescription}
                    multiline={true}
                    numberOfLines={3}
                    maxLength={350}
                  />
                  {/* Action Buttons */}
                  <View style={mapstyles.buttonRow}>
                    <CustomButton
                      style={{
                        width: '45%',
                        borderRadius: 20,
                        backgroundColor: colors.offWhiteYellow,
                      }}
                      onPress={() => {
                        setMessageVisible(false);
                        setTempMarker(null);
                      }}
                      title="Cancel"
                    ></CustomButton>

                    <CustomButton
                      style={{ width: '45%', borderRadius: 20 }}
                      onPress={handleMessageSubmit}
                      title="Save"
                    ></CustomButton>
                  </View>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>

          <Modal
            animationType="slide"
            transparent={true}
            visible={filterVisible}
            onRequestClose={() => {
              setFilterVisible(false);
            }}
          >
            <TouchableWithoutFeedback onPress={() => setFilterVisible(false)}>
              <View style={mapstyles.centeredView}>
                <TouchableWithoutFeedback>
                  <View style={mapstyles.filterView}>
                    <Text style={mapstyles.filterTitle}>Sort Pins</Text>

                    <View style={mapstyles.filterButtons}>
                      <View style={mapstyles.checkboxContainer}>
                        <Text style={mapstyles.checkboxLabel}>Popular</Text>
                        <CheckBox
                          checked={isPopularFiltered}
                          onPress={() => {
                            const newValue = !isPopularFiltered;
                            setisPopularFiltered(newValue);
                            setIsTimeFilterActive(false);
                            setTimeFilterValue(0);
                            if (newValue) {
                              handleFilterByScore();
                            } else {
                              loadAllMarkers();
                            }
                          }}
                        />
                      </View>
                      <View style={mapstyles.checkboxContainer}>
                        <Text style={mapstyles.checkboxLabel}>Mine</Text>
                        <CheckBox
                          checked={isUserFiltered}
                          onPress={() => {
                            const newValue = !isUserFiltered;
                            setIsUserFiltered(newValue);
                            if (newValue) {
                              handleFilterByUser();
                            } else {
                              loadAllMarkers();
                            }
                          }}
                        />
                      </View>
                      <View style={mapstyles.checkboxContainer}>
                        <Text style={mapstyles.checkboxLabel}>Friends</Text>
                        <CheckBox
                          checked={isFriendsFiltered}
                          onPress={() => {
                            const newValue = !isFriendsFiltered;
                            setIsFriendsFiltered(newValue);
                            if (newValue) {
                              handleFilterByFriends();
                            } else {
                              loadAllMarkers();
                            }
                          }}
                        />
                      </View>

                      <View style={mapstyles.timeFilterContainer}>
                        <Text style={mapstyles.timeFilterLabel}>Time Filter</Text>
                        <View style={mapstyles.timeFilterButtons}>
                          <TouchableOpacity
                            style={[
                              mapstyles.timeFilterButton,
                              selectedTimeFilter === 'all' && mapstyles.timeFilterButtonActive,
                            ]}
                            onPress={() => handleFilterByTime('all')}
                          >
                            <Text
                              style={[
                                mapstyles.timeFilterButtonText,
                                selectedTimeFilter === 'all' &&
                                  mapstyles.timeFilterButtonTextActive,
                              ]}
                            >
                              All Time
                            </Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            style={[
                              mapstyles.timeFilterButton,
                              selectedTimeFilter === 'day' && mapstyles.timeFilterButtonActive,
                            ]}
                            onPress={() => handleFilterByTime('day')}
                          >
                            <Text
                              style={[
                                mapstyles.timeFilterButtonText,
                                selectedTimeFilter === 'day' &&
                                  mapstyles.timeFilterButtonTextActive,
                              ]}
                            >
                              24 Hours
                            </Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            style={[
                              mapstyles.timeFilterButton,
                              selectedTimeFilter === 'week' && mapstyles.timeFilterButtonActive,
                            ]}
                            onPress={() => handleFilterByTime('week')}
                          >
                            <Text
                              style={[
                                mapstyles.timeFilterButtonText,
                                selectedTimeFilter === 'week' &&
                                  mapstyles.timeFilterButtonTextActive,
                              ]}
                            >
                              Week
                            </Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            style={[
                              mapstyles.timeFilterButton,
                              selectedTimeFilter === 'year' && mapstyles.timeFilterButtonActive,
                            ]}
                            onPress={() => handleFilterByTime('year')}
                          >
                            <Text
                              style={[
                                mapstyles.timeFilterButtonText,
                                selectedTimeFilter === 'year' &&
                                  mapstyles.timeFilterButtonTextActive,
                              ]}
                            >
                              Year
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>

                      <CustomButton
                        style={{ width: 200 }}
                        onPress={() => setFilterVisible(false)}
                        title={'Save'}
                      />
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>
          </Modal>

          <Modal
            animationType="slide"
            transparent={true}
            visible={commentsVisible}
            onRequestClose={() => {
              setCommentsVisible(false);
            }}
          >
            <TouchableWithoutFeedback onPress={() => setCommentsVisible(false)}>
              <View style={mapstyles.centeredView}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                  <View style={commentstyles.commentView}>
                    {selectedMarkerId && (
                      <>
                        <Text style={commentstyles.commentPinTitle}>
                          {markers.find(marker => marker.id === selectedMarkerId)?.title}
                        </Text>
                        <Text style={commentstyles.commentPinDescription}>
                          {markers.find(marker => marker.id === selectedMarkerId)?.description}
                        </Text>
                      </>
                    )}
                    <Text style={mapstyles.messageTitle}>Comments</Text>
                    {comments.length === 0 ? (
                      <Text style={mapstyles.noCommentsText}>No comments</Text>
                    ) : (
                      <FlatList
                        data={comments}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => (
                          <CommentCard
                            item={item}
                            selectedMarkerId={selectedMarkerId}
                            comments={comments}
                            setComments={setComments}
                            commentVotes={commentVotes}
                            setCommentVotes={setCommentVotes}
                            handleCommentVote={handleCommentVote}
                          />
                        )}
                        style={{ flex: 1 }}
                      />
                    )}

                    <TextInput
                      style={[mapstyles.input, commentstyles.commentTextArea]}
                      placeholder="Enter Comment"
                      value={commentDescription}
                      onChangeText={setCommentDescription}
                      multiline={true}
                      numberOfLines={3}
                    />

                    <View style={mapstyles.messageButtons}>
                      <TouchableOpacity
                        style={[mapstyles.button, mapstyles.buttonCancel]}
                        onPress={() => setCommentsVisible(false)}
                      >
                        <Text style={mapstyles.textStyle}>Cancel</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[mapstyles.button, mapstyles.buttonSubmit]}
                        onPress={() =>
                          handleCommentSubmit(
                            selectedMarkerId,
                            commentDescription,
                            setCommentDescription,
                            setComments
                          )
                        }
                      >
                        <Text style={mapstyles.textStyle}>Post</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>
          </Modal>

          <TouchableOpacity style={mapstyles.floatingButton} activeOpacity={0.7}>
            <Animated.View
              style={{
                transform: [{ translateX: pan.x }, { translateY: pan.y }],
              }}
              {...panResponder.panHandlers}
            >
              <Image source={require('../assets/images/marker.png')} style={mapstyles.buttonImage} />
            </Animated.View>
          </TouchableOpacity>

          <TouchableOpacity
            style={mapstyles.filterButton}
            activeOpacity={0.7}
            onPress={() => setFilterVisible(true)}
          >
            <Image source={require('../assets/images/menu.png')} style={mapstyles.buttonImage} />
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}
