import { StyleSheet } from 'react-native';

const commentstyles = StyleSheet.create({
  commentButton: {
    backgroundColor: '#007AFF',
    borderRadius: 5,
    marginTop: 10,
  },
  commentButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    padding: 10,
    textAlign: 'center',
  },
  commentItem: {
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    flexDirection: 'row',
  },
  commentUsername: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  commentDescription: {
    marginTop: 5,
    fontSize: 14,
  },
  commentTimestamp: {
    fontSize: 12,
    color: 'gray',
    marginTop: 5,
  },
  commentView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '80%',
    height: '60%',
  },
  commentTextArea: {
    height: 50,
    textAlignVertical: 'top',
    width: '100%',
  },
  noCommentsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginVertical: 20,
  },
  innerContainer: {
    padding: 0,
    paddingTop: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  container: {
    flex: 1,
  },
  commentPinTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  commentPinDescription: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 10,
    textAlign: 'center',
  },
  commentVoteContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    marginRight: 5,
  },
  commentTextContainer: {
    flex: 1,
    paddingLeft: 5,
  },
  deleteButton: {
    color: 'red',
  },
});

export default commentstyles;
