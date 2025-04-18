import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0EED7',
  },

  content: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
  },
  textContainer: {
    marginBottom: 20,
    textAlign: 'left',
    width: '100%',
    paddingLeft: 40,
    paddingTop: 20,
  },
  image: {
    width: '100%',
  },
  imagePost: {
    width: '85%',
    bottom: 20,
  },
  imageContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    ZIndex: -1,
    bottom: '50%',
    top: '50%',
  },
  imageDashes: {
    position: 'absolute',
    top: 0, // Adjust this value to position the dashed-lines image
    left: 0,
    width: '100%',
    paddingBottom: 30,
  },
  text: {
    fontFamily: 'AveriaSerifLibre-Regular',
    color: 'rgb(50, 68, 13)',
    fontSize: 24,
  },
  title: {
    fontFamily: 'AveriaSerifLibre-Regular',
    fontSize: 50,
    textAlign: 'left',
    letterSpacing: -3,
  },
  titlePins: {
    fontFamily: 'AveriaSerifLibre-Regular',
    fontSize: 44,
    textAlign: 'left',
    letterSpacing: -3,
  },
  bold: {
    fontFamily: 'AveriaSerifLibre-Bold',
  },

  body: {
    fontFamily: 'SourceSerif4-Medium',
    fontSize: 18,
    paddingBottom: 20,
    paddingTop: 0,
    textAlign: 'center',
    letterSpacing: -0.8,
  },

  next: {
    position: 'absolute',
    bottom: 20,

    marginLeft: 40,
    marginRight: 40,
  },
  greenButton: {
    backgroundColor: '#C9E298',
    paddingVertical: 20,

    borderRadius: 30,
    borderWidth: 2, // Add border width
    borderColor: '#32440D', // Add border color

    shadowColor: '#536B24',
    shadowRadius: 0,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 1, // Add shadowOpacity for iOS
    elevation: 5,
    borderColor: '#536B24',
    border: '#536B24',
  },
  buttonText: {
    color: '#32440D',
    fontSize: 24,
    textAlign: 'center',
    fontFamily: 'AveriaSerifLibre-Regular',
  },
});
export default styles;
