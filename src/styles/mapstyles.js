import { StyleSheet } from 'react-native';
import { colors } from '../constants/variables';

const mapstyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  loadingText: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    fontSize: 30,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(84, 91, 56, 0.5)',
  },
  messageView: {
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
  },
  messageTitle: {
    fontFamily: 'SourceSerif4-Regular',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    height: 40,
    width: '100%',
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  messageButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    minWidth: 100,
  },
  buttonSubmit: {
    backgroundColor: '#2196F3',
  },
  buttonCancel: {
    backgroundColor: '#FF3B30',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 90,
    right: 20,
    backgroundColor: '#ffffff',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 1000,
  },
  filterButton: {
    position: 'absolute',
    bottom: 90,
    left: 20,
    backgroundColor: '#ffffff',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 1000,
  },
  filterButtonText: {
    color: '#000',
    fontWeight: 'bold',
  },
  filterView: {
    width: 300,
    padding: 35,
    backgroundColor: 'white',
    borderRadius: 20,
    alignItems: 'center',
  },
  filterTitle: {
    fontSize: 30,
    letterSpacing: -1.5,
    fontWeight: 'bold',
    alignItems: 'center',
    fontFamily: 'AveriaSerifLibre-Bold',
  },
  filterButtons: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
  },
  buttonImage: {
    width: 30,
    height: 30,
  },
  calloutWrapper: {
    backgroundColor: 'white',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ccc',
    overflow: 'hidden',
  },
  calloutContent: {
    width: 200,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  calloutTextContainer: {
    flex: 1,
    paddingLeft: 5,
  },
  calloutTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    fontFamily: 'SourceSerif4-Bold',
  },
  calloutDescription: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'SourceSerif4-Regular',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 15,
  },
  calloutUsername: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#555',
    marginTop: 5,
  },
  voteContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    marginRight: 5,
  },
  voteButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
    width: 30,
    height: 30,
    backgroundColor: '#f0f0f0',
    marginVertical: 2,
  },
  voteButtonPressed: {
    backgroundColor: '#007AFF',
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
    marginVertical: 2,
  },
  voteButtonActive: {
    backgroundColor: '#007AFF',
  },
  voteButtonTextActive: {
    color: '#FFFFFF',
  },
  spacing: {
    margin: 0,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxLabel: {
    fontSize: 20,
    fontFamily: 'SourceSerif4-Regular',
  },
  timeFilterContainer: {
    marginVertical: 10,
    width: '100%',
    alignItems: 'center',
    paddingBottom: 20,
  },
  timeFilterLabel: {
    fontSize: 20,
    marginBottom: 10,
    fontFamily: 'SourceSerif4-Bold',
  },
  timeFilterButtonText: {
    fontFamily: 'SourceSerif4-Regular',
    fontSize: 15,
  },
  timeFilterButtonTextActive: {
    color: colors.red,
  },
  calloutUsername: {
    fontSize: 12,
    fontStyle: 'italic',
    fontFamily: 'SourceSerif4-Italic',
    color: '#555',
    marginTop: 5,
  },
});

export default mapstyles;
