import { StyleSheet } from 'react-native';
import { colors } from '../assets/utils/variables.js';

export const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: colors.whiteBackground, // fefefe
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    paddingLeft: 40,
    paddingRight: 40,
    marginTop: '60%',
  },
  background: {
    flex: 1,
    height: '100%',
    width: '100%',
    marginTop: 0,
  },
  signupbackground: {
    flex: 1,
    height: '100%',
    width: '100%',
    marginTop: 0,
  },
  signUpContainer: {
    padding: 20,
    flex: 1,
    backgroundColor: colors.whiteBackground, // fefefe
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    paddingLeft: 40,
    paddingRight: 40,
    marginTop: '30%',
  },
  header: {
    marginVertical: 25,
  },
  headerImg: {
    width: 80,
    height: 80,
    alignSelf: 'center',
    marginBottom: 36,
  },
  title: {
    fontSize: 50,
    fontWeight: '700',
    color: '#1e1e1e',
    marginBottom: 6,
    textAlign: 'left',
    fontFamily: 'AveriaSerifLibre-Regular',
    letterSpacing: -3,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#929292',
    textAlign: 'center',
    fontFamily: 'SourceSerif4',
  },
  input: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
    marginBottom: 15,
    marginLeft: 10,
  },
  line: {
    height: 3,
    backgroundColor: colors.offWhiteYellow,
    marginVertical: 10,
    width: '20%',
    margin: 0,
    padding: 0,
    marginBottom: 0,
  },
  inputControl: {
    height: 66,
    backgroundColor: colors.offWhiteYellow,
    paddingHorizontal: 16,
    fontSize: 14,
    fontWeight: '500',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: colors.greyGreen,
  },
  signupInputControl: {
    height: 55,
    backgroundColor: colors.offWhiteYellow,
    paddingHorizontal: 16,
    fontSize: 14,
    fontWeight: '500',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: colors.greyGreen,
  },

  form: {
    marginBottom: 24,
    flex: 1,
  },
  formAction: {
    marginVertical: 20,
  },
  formFooter: {
    fontSize: 15,
    fontWeight: '600',
    color: '#222',
    textAlign: 'right',
    letterSpacing: 0.1,
    paddingBottom: 20,
  },
  formFooterPassword: {
    fontSize: 15,
    fontWeight: '600',
    color: '#222',
    textAlign: 'right',
    letterSpacing: 0.1,
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default styles;
