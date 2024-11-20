import React from 'react';
import { View, StyleSheet } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { colors } from '../global';
import ScalableText from 'react-native-text';

export default function ({ checked, onCheckChange, description }) {
  return (
    <View style={styles.container}>
      <CheckBox
        value={checked}
        onValueChange={onCheckChange}
        style={styles.checkbox}
        tintColors={{ true: colors.BLUE, false: colors.GREY }}
      />
      <View style={styles.descriptionContainer}>
        <ScalableText style={styles.descriptionText}>{description}</ScalableText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 5,
    marginBottom: 5,
    flexDirection: 'row', // Align description and checkbox side by side
    alignItems: 'center', // Center align the description and checkbox
  },
  descriptionContainer: {
    margin: 0,
    marginLeft: 8,
  },
  descriptionText: {
    fontWeight: 'bold',
  },
  checkbox: {
    marginLeft: 1,
  },
});
