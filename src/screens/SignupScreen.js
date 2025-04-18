import { useState, useRef, useEffect } from 'react';
import {
  ImageBackground,
  Animated,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native';

import { styles } from '../styles/styles.js';
import { doc, setDoc } from 'firebase/firestore';
import { db, auth } from '../services/firebase.js';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { colors } from '../constants/variables.js';
import CustomButton from '../components/CustomButton.js';

/**
 * Signup page for users to create a new account
 * @param {Object} navigation - Navigation object to navigate between screens
 */
export function SignupPage({ navigation }) {
  const [form, setForm] = useState({
    email: '',
    password: '',
    username: '',
  });

  const handleChange = (name, value) => {
    setForm(prevForm => ({
      ...prevForm,
      [name]: value,
    }));
  };

  /**
   * Create a new user document in Firestore
   * User structure: {email: string, uid: string, bio (optional): string}
   * Remember to use await before calling function.
   * @param {Object} user - User object with email, uid, and optional bio
   */
  async function createUser(user) {
    const docRef = doc(db, 'users', user.uid);

    if (!docRef) {
      throw new Error('Document reference is not available');
    }
    if (!user.email || !user.uid) {
      throw new Error('User object is missing required fields');
    }

    await setDoc(docRef, {
      bio: user.bio ? user.bio : 'Feels empty...',
      created_at: new Date(),
      email: user.email,
      follower_count: 0,
      following_count: 0,
      post_count: 0,
      user_id: user.uid,
      username: user.username ? user.username : 'Anonymous',
      profile_picture:
        'https://firebasestorage.googleapis.com/v0/b/locale-c7626.firebasestorage.app/o/default-pfp.jpg?alt=media&token=be04cb73-02bd-4a27-b2c0-db648e3cfdb8',
      header_background_color: colors.background,
    });

    return;
  }

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500, // Adjust the duration as needed
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
      <ImageBackground
        source={require('../assets/images/signup-background.png')} // Adjust the path to your image
        style={styles.signupbackground}
      >
        <View style={styles.signUpContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Create a new account.</Text>
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
                value={form.email}
                onChangeText={value => handleChange('email', value)}
              />
            </View>

            <View style={styles.input}>
              <Text style={styles.inputLabel}>Username</Text>
              <TextInput
                keyboardType="default"
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.signupInputControl}
                placeholder="Username"
                placeholderTextColor={colors.greyGreen}
                value={form.username}
                onChangeText={value => handleChange('username', value)}
              />
            </View>

            <View style={styles.input}>
              <Text style={styles.inputLabel}>Password</Text>
              <TextInput
                secureTextEntry
                style={styles.signupInputControl}
                placeholder="*********"
                placeholderTextColor={colors.greyGreen}
                value={form.password}
                onChangeText={value => handleChange('password', value)}
              />
            </View>

            <View style={styles.formAction}>
              <CustomButton
                title="Sign up"
                onPress={async () => {
                  try {
                    const userCredential = await createUserWithEmailAndPassword(
                      auth,
                      form.email,
                      form.password
                    );
                    Alert.alert('Success', `Account created!`);

                    // Create a new user document in Firestore
                    await createUser({
                      email: userCredential.user.email,
                      uid: userCredential.user.uid,
                      username: form.username,
                    });

                    navigation.navigate('Login');
                  } catch (error) {
                    // handle specific Firebase auth errors
                    switch (error.code) {
                      case 'auth/invalid-email':
                        Alert.alert('Error', 'Invalid email address format.');
                        break;
                      case 'auth/user-not-found':
                        Alert.alert('Error', 'No account exists with this email.');
                        break;
                      case 'auth/invalid-credential':
                        Alert.alert('Error', 'Incorrect password.');
                        break;
                      case 'auth/missing-password':
                        Alert.alert('Error', 'Incorrect password.');
                        break;
                      case 'auth/too-many-requests':
                        Alert.alert('Error', 'Too many failed attempts. Please try again later.');
                        break;
                      default:
                        Alert.alert('Error', error.message);
                    }
                  }
                }}
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
                {'Already have an account? '}
                <Text style={{ textDecorationLine: 'underline' }}>{'Log in'}</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </Animated.View>
  );
}
