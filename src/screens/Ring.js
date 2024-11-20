/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { getAlarm, snoozeAlarm, stopAlarm } from '../alarm';
import Button from '../components/Button';
import { colors, globalStyles } from '../global';
import { addingZero, timeTo12,isTimeType } from '../utils/convertTime';

export default function ({ route, navigation }) {
  const [alarm, setAlarm] = useState(null);

  useEffect(() => {
    const alarmUid = route.params.alarmUid;
    (async function () {
      const myAlarm = await getAlarm(alarmUid);
      setAlarm(myAlarm);
    })();
  }, []);

  if (!alarm) {
    return <View />;
  }

  return (
    <View style={globalStyles.container}>
      <View style={[globalStyles.innerContainer, styles.container]}>
        <View style={styles.textContainer}>
          <Text style={styles.clockText}>
         {timeTo12(alarm.getTimeString().hour)}:{addingZero(alarm.getTimeString().minutes)} {isTimeType(alarm.getTimeString().hour)}
          </Text>
          <Text style={styles.timezone}>{alarm.dummytimezoneName}</Text>

          <Text style={styles.title}>{alarm.title}</Text>
          <Text style={styles.description}>{alarm.description}</Text>
        </View>
        <View style={styles.buttonContainer}>
          <Button
            title={'Snooze'}
            onPress={async () => {
              await snoozeAlarm();
              navigation.goBack();
            }}
          />
          <Button
            title={'Stop'}
            onPress={async () => {
              await stopAlarm();
              navigation.goBack();
            }}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  clockText: {
    color: colors.black,
    fontWeight: 'bold',
    fontSize: 50,
  },
  timezone: {
    fontWeight: 'bold',
    marginTop:1,
    fontSize: 25,
    color: colors.BLUE,
  },
  textContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  title: {
    fontWeight: 'bold',
    marginTop:5,
    fontSize: 22,
    color: colors.black,
  },
  description: {
    fontWeight: 'bold',
    marginTop:5,
    fontSize: 18,
    color: colors.black,
  },
});
