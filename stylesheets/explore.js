import { StyleSheet } from 'react-native';
import { colors } from '../assets/utils/variables.js';

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 75,
    paddingBottom: 10,
    backgroundColor: '#f1edeb',
    backgroundColor: colors.lightGreen,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    letterSpacing: -1.5,
    fontSize: 30,
    fontFamily: 'SourceSerif4-Bold',
    color: colors.black,
  },
  sortButton: {
    backgroundColor: colors.whiteBackground,
    borderRadius: 5,

    shadowColor: colors.black,
    shadowRadius: 0,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1, // Add shadowOpacity for iOS
    elevation: 5,
    borderColor: colors.black,
    border: colors.darkGreen,
    elevation: 5,
    marginRight: 15,
  },
  sortButtonText: {
    color: colors.black,
    fontSize: 15,
    padding: 5,
    paddingHorizontal: 10,
    fontFamily: 'SourceSerif4-Regular',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  modalContent: {
    backgroundColor: colors.whiteBackground,
    padding: 20,
    borderRadius: 10,
    width: '60%',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'SourceSerif4-Bold',
    marginBottom: 10,
  },
  modalLabel: {
    fontSize: 15,
    fontFamily: 'SourceSerif4-Bold',
  },
  modalOption: {
    fontSize: 15,
    fontFamily: 'SourceSerif4-Regular',
  },
});

export default styles;
