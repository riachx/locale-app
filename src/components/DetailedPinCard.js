import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import pinCardStyles from '../styles/pinCardStyles.js';

/**
 * Heres the structure of the pin object
{
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
}
 */
/**
 * Rendered detailed pin card
 * @param {Object} props - Component properties
 * @param {Object} props.pin - Pin object
 * @param {Function} props.onClickUpvote - Upvote button click handler
 * @param {Function} props.onClickDownvote - Downvote button click handler
 * @param {boolean} props.isUpvoted - Upvote status
 * @param {boolean} props.isDownvoted - Downvote status
 * @returns {JSX.Element} Rendered detailed pin card
 */
const DetailedPinCard = props => {
  const { pin, onClickUpvote, onClickDownvote, isUpvoted, isDownvoted } = props;

  const [isVoted, setIsVoted] = React.useState(isUpvoted ? 1 : isDownvoted ? -1 : 0);
  const [score, setScore] = React.useState(pin.score);

  /**
   * Calculate the new score based on the vote type
   * @param {number} score - Current score
   * @param {number} voteType - Vote type (1 for upvote, -1 for downvote)
   * @param {number} isVoted - Current vote status (0 for no vote, 1 for upvote, -1 for downvote)
   * @returns {number} New score
   */
  const calcScore = (score, voteType, isVoted) => {
    if (isVoted === 0) {
      return score + voteType;
    } else if (isVoted === voteType) {
      return score - voteType;
    } else {
      return score + 2 * voteType;
    }
  };

  const handleUpvote = () => {
    setScore(calcScore(score, 1, isVoted));
    setIsVoted(isVoted === 1 ? 0 : 1);
    onClickUpvote();
  };

  const handleDownvote = () => {
    setScore(calcScore(score, -1, isVoted));
    setIsVoted(isVoted === -1 ? 0 : -1);
    onClickDownvote();
  };

  /**
   * Format the date to a readable format with time
   * HH:MM AM/PM, Month DD, YYYY
   * @param {Date} date - Date object
   * @returns {string} Formatted date
   */
  const formatDate = date => {
    const formattedDate = date.toDate().toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });
    return formattedDate;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={pinCardStyles.innerContainer}>
          <View style={pinCardStyles.textContainer}>
            <Text style={pinCardStyles.username}>{pin.username}</Text>
            <Text style={pinCardStyles.title}>{pin.title}</Text>
            <Text style={pinCardStyles.description}>{pin.description}</Text>
            <Text style={pinCardStyles.timestamp}>{formatDate(pin.timestamp)}</Text>
          </View>
          <View style={[pinCardStyles.voteContainer, { alignSelf: 'flex-start' }]}>
            <TouchableOpacity
              onPress={handleUpvote}
              style={[pinCardStyles.voteButton, isVoted === 1 && pinCardStyles.voteButtonActive]}
            >
              <Text
                style={[
                  pinCardStyles.voteButtonText,
                  isVoted === 1 && pinCardStyles.voteButtonTextActive,
                ]}
              >
                ▲
              </Text>
            </TouchableOpacity>
            <Text style={pinCardStyles.score}>{score}</Text>
            <TouchableOpacity
              onPress={handleDownvote}
              style={[pinCardStyles.voteButton, isVoted === -1 && pinCardStyles.voteButtonActive]}
            >
              <Text
                style={[
                  pinCardStyles.voteButtonText,
                  isVoted === -1 && pinCardStyles.voteButtonTextActive,
                ]}
              >
                ▼
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={pinCardStyles.innerContainer}>
          {/* Placeholder for comments section */}
          <Text style={pinCardStyles.description}>Feels empty here...</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});

export default DetailedPinCard;
