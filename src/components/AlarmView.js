/* eslint-disable prettier/prettier */
import React from 'react';
import { StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../global';
import { addingZero, timeTo12 } from '../utils/convertTime';
import { isTimeType } from '../utils/convertTime';
import ScalableText from 'react-native-text';

export default function ({
  uid,
  title,
  hour,
  minutes,
  days,
  onPress,
  isActive,
  onChange,
  dummytimezoneName, 
}) {
  return (
    <TouchableOpacity onPress={() => onPress(uid)} style={styles.container}>
      <View style={styles.leftInnerContainer}>
        <ScalableText style={styles.clock}>
          {timeTo12(hour)}:
          {addingZero(minutes)}
          <Text style={styles.type}> {isTimeType(hour)}</Text>
          <Text style={styles.timezone}>  {dummytimezoneName}</Text>
        </ScalableText>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.descContainer}>
          <ScalableText>{getAlphabeticalDays(days)}</ScalableText>
        </View>
      </View> 
      <View style={styles.rightInnerContainer}>
        <Switch
          thumbColor={colors.BLUE}
          ios_backgroundColor={'black'}
          trackColor={{ false: colors.GREY, true: "#4978a4" }}
          value={isActive}
          onValueChange={onChange}
        />
      </View>
    </TouchableOpacity>
  );
}

function getAlphabeticalDays(days) {
  let weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  let activeDays = [];
  for (let i = 0; i < days.length; i++) {
    activeDays.push(weekdays[parseInt(days[i])] + ' ');
  }
  return activeDays;
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: "white", 
    borderBottomColor: 'gray',
    borderBottomWidth: .8,
    paddingBottom: 5,
    paddingTop:8,
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
  },
  leftInnerContainer: {
    flex: 1,   
    paddingRight: 10,
    paddingRight: 10, 
    alignItems: 'flex-start', 
  },
  rightInnerContainer: {
    margin: 5,
    marginRight: 0,
    flex: 0, 
    alignItems: 'flex-end',
  },
  descContainer: {
    flexDirection: 'row',
    color: 'grey',
  },
  clock: {
    color: 'black',
    fontSize: 25,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 10,
  },
  type: {
    // display: "flex",
    // justifyContent: "center",
    fontSize: 15

  },
  timezone: { 
    fontSize: 20,
    paddingLeft:22,
    color: colors.BLUE, 
  },
  title: {
    fontWeight: 'bold',
    marginTop:2,
    marginBottom:2,
    fontSize: 17,
    color: colors.black,
  },
});
