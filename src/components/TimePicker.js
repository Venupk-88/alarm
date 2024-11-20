/* eslint-disable prettier/prettier */
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import React, { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment'
import ScalableText from 'react-native-text';

import { addingZero, timeTo12, isTimeType } from '../utils/convertTime'; 
export default function ({ timezone,hour, minutes, onChange = () => null }) {
  const [showPicker, setShowPicker] = useState(false);

  return (
    <View>
      <TouchableOpacity
        style={styles.container}
        onPress={() => setShowPicker(true)}>
        <ScalableText style={styles.clockText}>
          {timeTo12(hour)}:
          {addingZero(minutes)}
          {isTimeType(hour)}

        </ScalableText>
      </TouchableOpacity>
      {showPicker && (
        <DateTimePicker
          testID="dateTimePicker"
          // timeZoneOffsetInMinutes={timezone} 
          value={getDate(hour, minutes)}
          mode={'time'}
          is24Hour={false}
          display="default"
          onChange={(e, date) => { 
            // console.warn("data", moment(date).format("h"))
            // console.warn("new Date(date)",date.getHours())
            setShowPicker(false);
            onChange(date.getHours(), date.getMinutes());
          }}
        />
      )}
    </View>
  );
}

function getDate(hour, minutes) {
  const date = new Date();
  date.setHours(hour);
  date.setMinutes(minutes);
  return date;
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  clockText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 70,
  },
});
