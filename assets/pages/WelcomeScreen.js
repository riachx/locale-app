import React, { useEffect, useCallback } from 'react';
import { View, Image, StyleSheet, SafeAreaView, Text, TouchableOpacity } from 'react-native';

import CustomButton from '../components/CustomButton';
import { useNavigation } from '@react-navigation/native';
import styles from '../../stylesheets/welcomeStyles';

const WelcomeScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>
            Welcome to{'\n'}
            <Text style={styles.bold}>Locale.</Text>
          </Text>
        </View>
        <View style={styles.imageContainer}>
          <Image
            source={require('../images/map_and_images.png')}
            style={styles.image}
            resizeMode="contain"
          />
          <Image
            source={require('../images/dashed-lines.png')}
            style={styles.imageDashes}
            resizeMode="contain"
          />
        </View>
        <View style={styles.next}>
          <Text style={styles.body}>
            A map based social media designed to transform the way you visualize your life.
          </Text>

          <CustomButton
            title="Next >"
            onPress={() => {
              navigation.navigate('Welcome2');
            }}
            style={{ width: '100%' }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default WelcomeScreen;
