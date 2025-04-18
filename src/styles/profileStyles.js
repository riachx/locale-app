import { AutourOne_400Regular } from '@expo-google-fonts/dev';
import { StyleSheet } from 'react-native';
import { colors } from '../constants/variables.js'

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    position: 'relative',
  },
  modalTitle: {
    fontWeight: 'bold',
    fontSize: 32,
    letterSpacing: -2.5,
    fontFamily: 'AveriaSerifLibre-Bold',

    paddingBottom: 15,
  },
  modalSubtitle: {
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: -1,
    fontFamily: 'SourceSerif4-Medium',
    paddingBottom: 8,
  },
  modalSubtitleBadge: {
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: -1,
    fontFamily: 'SourceSerif4-Medium',
    paddingBottom: 30,
    paddingTop: 20,
  },

  customButtonSmaller: {
    width: 180,
    borderRadius: 20,
  },

  modalItem: {
    paddingBottom: 20,
    paddingLeft: 5,
    alignItems: 'left',
  },
  customizeButton: {
    alignItems: 'left',
    backgroundColor: colors.lightGreen,
    paddingVertical: 10,
    paddingHorizontal: 10,
    width: 120,
    borderRadius: 18,
    borderWidth: 2, // Add border width

    shadowColor: colors.darkGreen,
    shadowRadius: 0,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 1, // Add shadowOpacity for iOS
    elevation: 5,
    borderColor: colors.forestGreen,
  },

  customizeButtonText: {
    color: colors.black,
    fontSize: 14,
    textAlign: 'center',
    fontFamily: 'AveriaSerifLibre-Regular',
  },

  insideCurvedContainer: {
    bottom: 50,
    alignItems: 'center',
    paddingRight: 30,
    paddingLeft: 30,
  },

  curvedContainer: {
    backgroundColor: 'rgb(255, 255, 255)',
    borderTopLeftRadius: 80,
    borderTopRightRadius: 80,
    height: '100%',
    paddingHorizontal: 0,
    marginTop: 0, // Pull container up for overlap effect
    alignItems: 'center',
  },
  scrollContainer: {
    paddingTop: 150, // Space for the profile image to overlap
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 400, // Adjust height for header
    zIndex: -2,
  },
  container: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingTop: 80,
  },

  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    zIndex: -1,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
    padding: 15,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    elevation: 5,
  },
  verticalLine: {
    width: 1,
    height: 40,
    backgroundColor: '#d3d3d3',
    marginHorizontal: 1,
  },
  profileImageContainer: {
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  username: {
    fontFamily: 'AveriaSerifLibre-Bold',
    fontSize: 32,
    letterSpacing: -1,
    fontWeight: 'bold',
    color: 'rgb(55, 41, 17)',
    marginTop: 10,
  },
  bio: {
    fontFamily: 'SourceSerif4-Regular',
    fontSize: 14,
    color: 'rgb(55, 41, 17)',
    textAlign: 'center',
    marginTop: 5,
  },

  location: {
    fontFamily: 'SourceSerif4-Medium',
    fontSize: 18,
    color: 'rgb(55, 41, 17)',
    textAlign: 'center',
  },

  profileStatsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingTop: 30,
    paddingBottom: 0,
    paddingLeft: 30,
    paddingRight: 30,
  },

  pinLogo: {
    width: '12',
    height: 18,
    marginRight: 8,
    top: 3,
  },
  locationContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: '100%',
  },

  statBlock: {
    alignItems: 'center',
  },

  statValue: {
    fontFamily: 'AveriaSerifLibre-Bold',
    fontSize: 25,
    fontWeight: 'bold',
    color: 'rgb(55, 41, 17)',
  },

  statLabel: {
    fontSize: 14,
    color: colors.black,
    fontFamily: 'SourceSerif4-Medium',
  },

  editProfileButton: {
    width: 40,
    height: 40,
    borderRadius: 25,
    backgroundColor: 'rgb(255, 255, 255)',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 80,
    right: 65,
    position: 'absolute',

    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },

  badgeContainer: {
    flex: 1,
    backgroundColor: 'white',
    width: '100%',
    marginTop: 20,
    marginBottom: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E2DFD4',
  },
  greyBackground: {
    flex: 1,
    backgroundColor: '#F1EFEB',
    width: '100%',
  },

  heading: {
    fontFamily: 'AveriaSerifLibre-Bold',
    fontSize: 20,
    letterSpacing: -1,
    fontWeight: 'bold',
    color: 'rgb(55, 41, 17)',
    paddingLeft: 20,
    paddingTop: 20,
  },
  badges: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'flex-between',
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 20,
    paddingBottom: 20,
  },

  badgeWrapper: {
    alignItems: 'center',
  },
  badgeImage: {
    width: 80,
    height: 80,
    borderRadius: 50,
    marginLeft: 10,
    marginRight: 10,
  },
  badgeTitle: {
    fontSize: 12,
    color: '#000000',
  },
  noBadgesText: {
    color: 'gray',
    fontSize: 14,
    marginTop: 10,
    marginBottom: 20,
    marginLeft: 20,
  },
  modalContainerBadge: {
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },

  closeButtonBadge: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#ff5c5c',
    borderRadius: 5,
  },
  closeButtonTextBadge: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.modalOverlay,
  },
  modalContainer: {
    width: 340,
    backgroundColor: 'white',
    padding: 25,
    borderRadius: 15,
    alignItems: 'right',
  },

  colorModalContainer: {
    alignItems: 'left',
    width: 300,
  },
  colorModal: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,

    width: 320,
    alignItems: 'center',
    elevation: 5, // Adds shadow for Android
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5, // Adds shadow for iOS
  },

  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 15,
  },
  inputBox: {
    alignItems: 'left',
    backgroundColor: colors.offWhiteYellow,
    paddingVertical: 10,
    paddingHorizontal: 10,
    width: '100%',
    borderRadius: 15,
    borderWidth: 2,
    borderColor: colors.greyGreen,
  },
});
export default styles;
