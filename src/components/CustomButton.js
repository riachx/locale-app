import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { colors } from '../constants/variables.js';

const CustomButton = ({
  title,
  onPress,
  backgroundColor = '#C9E298',
  pressedColor = '#5C7F16',
  textColor = '#32440D',
  pressedTextColor = '#C9E298',
  style = {},
}) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: pressed ? pressedColor : backgroundColor },
        style,
      ]}
    >
      {({ pressed }) => (
        <Text style={[styles.text, { color: pressed ? pressedTextColor : textColor }]}>
          {title}
        </Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.lightGreen,
    paddingVertical: 20,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: colors.forestGreen,
    shadowColor: colors.darkGreen,
    shadowRadius: 0,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 1,
    elevation: 5,
    borderColor: colors.darkGreen,
    border: colors.darkGreen,
  },
  text: {
    color: '#32440D',
    fontSize: 24,
    textAlign: 'center',
    fontFamily: 'AveriaSerifLibre-Regular',
  },
});

export default CustomButton;
