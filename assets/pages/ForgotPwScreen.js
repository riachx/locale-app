import { useState, useRef, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ImageBackground,
  Animated,
  Text,
  TextInput,
  View,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { styles } from '../../stylesheets/styles.js';
import { db, auth } from '../../firebase.js';
import { sendPasswordResetEmail } from 'firebase/auth';
import { colors } from '../utils/variables.js';
import CustomButton from '../components/CustomButton.js';

/**
 * Forgot password page for users to reset their password
 * @param {Object} navigation - Navigation object to navigate between screens
 */
export function ForgotPwScreen({ navigation }) {
  const [email, setEmail] = useState('');

  const handleChange = value => {
    setEmail(value);
  };

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500, // Adjust the duration as needed
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  /**
   * Sends a recovery email to the user's email address
   */
  async function sendRecoveryEmail() {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        Alert.alert('Recovery email sent', 'Please check your email to reset your password');
        navigation.navigate('Login');
      })
      .catch(_ => {
        Alert.alert('Error');
      });
  }

  return (
    <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
      <ImageBackground
        source={require('../images/signup-background.png')} // Adjust the path to your image
        style={styles.signupbackground}
      >
        <View style={styles.signUpContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Forgot Password?</Text>
          </View>
          <View style={styles.form}>
            <View style={styles.input}>
              <Text style={styles.inputLabel}>Email address</Text>
              <TextInput
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.signupInputControl}
                placeholder="john@example.com"
                placeholderTextColor={colors.greyGreen}
                value={email}
                onChangeText={handleChange}
              />
            </View>

            <View style={styles.formAction}>
              <CustomButton
                title="Send recovery email"
                onPress={sendRecoveryEmail}
                style={{ width: '100%' }}
              />
            </View>

            <TouchableOpacity
              style={{ marginTop: 'auto' }}
              onPress={() => {
                navigation.navigate('Login');
              }}
            >
              <Text style={styles.formFooter}>
                {'Remember your account? '}
                <Text style={{ textDecorationLine: 'underline' }}>{'Log in'}</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </Animated.View>
  );
}
