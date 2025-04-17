import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
//import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from '../pages/ProfileScreen';
import FireTest from '../pages/FireTest';
import { Ionicons } from 'react-native-vector-icons';
import MapScreen from '../pages/MapScreen';
import ExploreScreen from '../pages/ExploreScreen';
import { colors } from '../utils/variables.js';

// citations: https://github.com/rhj7513/reactnativetest/blob/25ed093e08f0ed5d05b1ff3fcff27368dd198c81/Navigation/BottomNavigator.js

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let icon;

          if (route.name === 'Map') {
            icon = 'map';
          } else if (route.name === 'Profile') {
            icon = 'person';
          } else if (route.name === 'Explore') {
            icon = 'file-tray-full-outline';
          }

          return <Ionicons name={icon} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.background,
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          elevation: 0,
          borderTopWidth: 0,
          backgroundColor: 'white',
          padding: 0,
          height: 80,
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
        },
        contentStyle: {
          backgroundColor: 'white',
        },
        tabBarItemStyle: {
          padding: 5,
          margin: 0,
        },
      })}
    >
      <Tab.Screen
        name="Explore"
        component={ExploreScreen}
        options={{
          contentStyle: { padding: 0 },
        }}
      />
      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{
          contentStyle: { padding: 0 },
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          contentStyle: { padding: 0 },
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
