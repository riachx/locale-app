import React from 'react';
import { SafeAreaView, View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ExploreStyle from '../styles/explore.js';

/**
 * ExploreBar component with button
 * @param {Object} props - Component props
 * @returns {JSX.Element} ExploreBar component
 */
const ExploreBar = props => {
  const { onSortPress, onRefresh, isSelectedPin, setPin } = props;

  const handleClosePin = () => {
    setPin(null);
  };

  return (
    <View>
      <View style={ExploreStyle.container}>
        <Text style={ExploreStyle.title}>Locale</Text>
        {!isSelectedPin && (
          <View style={ExploreStyle.buttonContainer}>
            <TouchableOpacity style={ExploreStyle.sortButton} onPress={onSortPress}>
              <Text style={ExploreStyle.sortButtonText}>Sort</Text>
            </TouchableOpacity>
            <Icon.Button
              name="refresh"
              size={25}
              color="black"
              backgroundColor="white"
              onPress={onRefresh}
              marginRight={-10}
            />
          </View>
        )}
        {isSelectedPin && (
          <Icon.Button
            name="close-circle-outline"
            size={25}
            color="black"
            backgroundColor="white"
            onPress={handleClosePin}
            marginRight={-10}
          />
        )}
      </View>
    </View>
  );
};

export default ExploreBar;
