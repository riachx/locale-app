import React from 'react';
import { View, Image, SafeAreaView, Text } from 'react-native';

import CustomButton from '../components/CustomButton';
import styles from '../styles/welcomeStyles';

const WelcomeScreen2 = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={styles.titlePins}>
            <Text style={styles.bold}>Pin and share</Text> {'\n'}
            your stories.
          </Text>
        </View>
        <View style={styles.imageContainer}>
          <Image
            source={require('../assets/images/example-post.png')}
            style={styles.imagePost}
            resizeMode="contain"
          />
        </View>
        <View style={styles.next}>
          <Text style={styles.body}>
            Post location based pins with stories to share with the world.
          </Text>

          <CustomButton
            title="Get Started >"
            onPress={() => {
              navigation.navigate('Login');
            }}
            style={{ width: '100%' }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};
export default WelcomeScreen2;
