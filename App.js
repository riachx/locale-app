import { useState, useEffect, useRef } from 'react';
import {
  Animated,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  ImageBackground,
  Alert,
} from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './src/services/firebase.js';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TransitionPresets } from '@react-navigation/stack';
import { styles } from './src/styles/styles.js';
import CustomCallout from './src/components/CustomCallout.js';
import BottomTabNavigator from './src/components/BottomTabNavigator.js';
import { SignupPage } from './src/screens/SignupScreen.js';
import { colors } from './src/constants/variables.js';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import CustomButton from './src/components/CustomButton.js';
import WelcomeScreen from './src/screens/WelcomeScreen.js';
import WelcomeScreen2 from './src/screens/WelcomeScreen2.js';
import { ForgotPwScreen } from './src/screens/ForgotPwScreen.js';

SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();

// move this to a separate file
function LoginScreen({ navigation }) {
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const handleChange = (name, value) => {
    setForm(prevForm => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500, // Adjust the duration as needed
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    // safe area view automatically adds padding
    <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <ImageBackground
          source={require('./src/assets/images/login-background.png')} // Adjust the path to your image
          style={styles.background}
        >
          <View style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.title}>Log-in</Text>
              <View style={styles.line} />
            </View>
            <View style={styles.form}>
              <View style={styles.input}>
                <Text style={styles.inputLabel}>Email address</Text>

                <TextInput
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={styles.inputControl}
                  placeholder="john@example.com"
                  placeholderTextColor={colors.greyGreen}
                  value={form.email}
                  onChangeText={value => handleChange('email', value)}
                />
              </View>

              <View style={styles.input}>
                <Text style={styles.inputLabel}>Password</Text>

                <TextInput
                  secureTextEntry
                  style={styles.inputControl}
                  placeholder="*********"
                  placeholderTextColor={colors.greyGreen}
                  value={form.password}
                  onChangeText={value => handleChange('password', value)}
                />
              </View>

              <TouchableOpacity
                style={{ marginTop: 'auto' }}
                onPress={() => {
                  navigation.navigate('ForgotPw');
                }}
              >
                <Text style={styles.formFooterPassword}>
                  <Text style={{ textDecorationLine: 'underline' }}>Forgot Password?</Text>
                </Text>
              </TouchableOpacity>

              <View style={styles.formAction}>
                <CustomButton
                  title="Log-in"
                  onPress={async () => {
                    try {
                      const userCredential = await signInWithEmailAndPassword(
                        auth,
                        form.email,
                        form.password
                      );

                      navigation.navigate('MapScreen');
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
                  style={{ width: '100%', marginTop: 20 }}
                />
              </View>
              <TouchableOpacity
                style={{ marginTop: 'auto' }}
                onPress={() => {
                  navigation.navigate('Signup');
                }}
              >
                <Text style={styles.formFooter}>
                  Don't have an account?{' '}
                  <Text style={{ textDecorationLine: 'underline' }}>Sign up.</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      </View>
    </Animated.View>
  );
}

// Link Login to App
export default function App() {
  const Stack = createNativeStackNavigator();

  const [loaded, error] = useFonts({
    'AveriaSerifLibre-Bold': require('./src/assets/fonts/AveriaSerifLibre-Bold.ttf'),
    'AveriaSerifLibre-Regular': require('./src/assets/fonts/AveriaSerifLibre-Regular.ttf'),
    'SourceSerif4-Regular': require('./src/assets/fonts/SourceSerif4_18pt-Regular.ttf'),
    'SourceSerif4-Medium': require('./src/assets/fonts/SourceSerif4_18pt-Medium.ttf'),
    'SourceSerif4-Bold': require('./src/assets/fonts/SourceSerif4-Bold.ttf'),
    'SourceSerif4-SemiBold': require('./src/assets/fonts/SourceSerif4-SemiBold.ttf'),
    'SourceSerif4-Italic': require('./src/assets/fonts/SourceSerif4-Italic.ttf'),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{
          headerShown: false, // This hides the header for all screens
        }}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Welcome2" component={WelcomeScreen2} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="MapScreen" component={BottomTabNavigator} />
        <Stack.Screen name="Signup" component={SignupPage} />
        <Stack.Screen name="ForgotPw" component={ForgotPwScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
