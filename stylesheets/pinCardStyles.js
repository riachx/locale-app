import { StyleSheet } from 'react-native';
import { colors } from '../assets/utils/variables.js';

const pinCardStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    shadowColor: '#544640',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  profileImage: {
    width: 30, // Adjust size as needed
    height: 30, // Adjust size as needed
    borderRadius: 22.5, // Ensures the image is circular
    borderWidth: 2,
    borderColor: '#ddd', // Light border for aesthetics
    marginRight: 10, // Space between image and text
  },
  username_picture_row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  innerContainer: {
    padding: 25,
    paddingTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    marginRight: 25,
  },
  title: {
    fontSize: 18,
    marginBottom: 3,
    fontFamily: 'SourceSerif4-Bold',
  },
  description: {
    fontSize: 16,
    fontFamily: 'SourceSerif4-Regular',
  },
  usernameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  username: {
    fontSize: 15,
    fontWeight: 'ultralight',
    marginBottom: 5,
    fontFamily: 'SourceSerif4-Regular',
  },

  timestamp: {
    fontSize: 12,
    fontWeight: 'ultralight',
    marginTop: 5,
    fontFamily: 'SourceSerif4-Regular',
  },
  voteContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
    alignSelf: 'center',
  },
  voteButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
    width: 33,
    height: 30,
    backgroundColor: '#f0f0f0',
  },

  score: {
    fontSize: 18,
    fontWeight: 'ultralight',
    paddingTop: 5,
    paddingBottom: 5,
    fontFamily: 'SourceSerif4-Bold',
  },
  voteButtonPressed: {
    backgroundColor: colors.background,
  },
  voteButtonText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  voteButtonTextPressed: {
    color: '#FFFFFF',
  },
  voteScore: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginHorizontal: 8,
  },
  voteButtonActive: {
    backgroundColor: colors.tealGreen,
  },
  voteButtonTextActive: {
    color: '#FFFFFF',
  },
});

export default pinCardStyles;
