import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import ScalableText from 'react-native-text';

export default function ({ selectedValue, onValueChange, description, timezoneList }) {
  return (
    <View style={styles.container}>
      <View style={styles.descriptionContainer}>
        <ScalableText style={styles.descriptionText}>{description}</ScalableText>
      </View>
      <Picker
        selectedValue={selectedValue}
        onValueChange={onValueChange}
        style={styles.selectBox}
      >
        {timezoneList.map((option) => (
          <Picker.Item label={option.label} value={option.value} key={option.value} />
        ))}
      </Picker>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 2,
    marginBottom: 5,
    flexDirection: 'row', // Align description and select box side by side
    alignItems: 'center', // Center align the description and select box
  },
  descriptionContainer: {
    margin: 0, 
  },
  descriptionText: {
    fontWeight: 'bold',
  },
  selectBox: {
    flex: 1, // Adjust to fit the available space
  },
});
