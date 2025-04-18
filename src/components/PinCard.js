import { SafeAreaView, Image, View, Text, TouchableOpacity } from 'react-native';
import pinCardStyles from '../styles/pinCardStyles.js';
import * as React from 'react';

const MAX_DESCRIPTION_LENGTH = 150;
const MAX_TITLE_LENGTH = 30;
const MAX_USERNAME_LENGTH = 20;

/**
 * Pin Card component
 * @param {Object} props - Component properties
 * @param {string} props.username - Username of the user
 * @param {string} props.title - Title of the pin
 * @param {string} props.description - Description of the pin
 * @param {Integer} props.score - Score of the pin
 * @param {Date} props.timestamp - Timestamp of the pin
 * @param {Function} props.onClickUpvote - Upvote button click handler
 * @param {Function} props.onClickDownvote - Downvote button click handler
 * @returns {JSX.Element} Rendered pin card component
 */
const PinCard = props => {
  const {
    username,
    profile_picture,
    title,
    description,
    score,
    timestamp,
    onClickUpvote,
    onClickDownvote,
    isUpvoted,
    isDownvoted,
  } = props;

  // State to store the vote status:
  // 0 for no vote, 1 for upvote, -1 for downvote
  const [isVoted, setIsVoted] = React.useState(isUpvoted ? 1 : isDownvoted ? -1 : 0);

  // Rerender the component when the vote status changes
  React.useEffect(() => {
    setIsVoted(isUpvoted ? 1 : isDownvoted ? -1 : 0);
  }, [isUpvoted, isDownvoted]);

  const handleUpvote = () => {
    setIsVoted(isVoted === 1 ? 0 : 1);
    onClickUpvote();
  };

  const handleDownvote = () => {
    setIsVoted(isVoted === -1 ? 0 : -1);
    onClickDownvote();
  };

  /**
   * Format the date to a readable format
   * @param {Date} date - Date object
   * @returns {string} Formatted date
   */
  const formatDate = date => {
    const now = new Date();
    const diff = now - date.toDate(); // Difference in milliseconds
    const diffInSeconds = Math.floor(diff / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInMonths = Math.floor(diffInDays / 30);
    const diffInYears = Math.floor(diffInMonths / 12);

    if (diffInYears > 0) {
      return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
    } else if (diffInMonths > 0) {
      return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
    } else if (diffInDays > 0) {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    } else if (diffInHours > 0) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else if (diffInMinutes > 0) {
      return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    } else {
      return `${diffInSeconds} second${diffInSeconds > 1 ? 's' : ''} ago`;
    }
  };

  /**
   * Limit the description length
   * @param {string} description - Description to be limited
   * @returns {string} Limited description
   */
  const limitDescription = description => {
    if (description.length > MAX_DESCRIPTION_LENGTH) {
      return description.slice(0, MAX_DESCRIPTION_LENGTH) + '...';
    }
    return description;
  };

  /**
   * Limit the title length
   * @param {string} title - Title to be limited
   * @returns {string} Limited title
   */
  const limitTitle = title => {
    if (title.length > MAX_TITLE_LENGTH) {
      return title.slice(0, MAX_TITLE_LENGTH) + '...';
    }
    return title;
  };

  /**
   * Limit the username length
   * @param {string} username - Username to be limited
   * @returns {string} Limited username
   */
  const limitUsername = username => {
    if (username.length > MAX_USERNAME_LENGTH) {
      return username.slice(0, MAX_USERNAME_LENGTH) + '...';
    }
    return username;
  };

  return (
    <SafeAreaView style={pinCardStyles.container}>
      <View style={pinCardStyles.innerContainer}>
        <View style={pinCardStyles.textContainer}>
          <View style={pinCardStyles.username_picture_row}>
            <Image
              style={pinCardStyles.profileImage}
              source={
                profile_picture ? { uri: profile_picture } : require('../assets/images/default-pfp.jpg')
              }
            ></Image>

            <Text style={pinCardStyles.username}>{limitUsername(username)}</Text>
          </View>

          <Text style={pinCardStyles.title}>{limitTitle(title)}</Text>
          <Text style={pinCardStyles.description}>{limitDescription(description)}</Text>
          <Text style={pinCardStyles.timestamp}>{formatDate(timestamp)}</Text>
        </View>
        <View style={pinCardStyles.voteContainer}>
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
    </SafeAreaView>
  );
};

export default PinCard;
