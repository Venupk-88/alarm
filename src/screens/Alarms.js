/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
import { Text, View,ScrollView,StyleSheet } from 'react-native';
import { getAlarmState, getAllAlarms, disableAlarm, enableAlarm } from '../alarm';
import AlarmView from '../components/AlarmView';
import React, { act, useEffect, useState } from 'react';
import { globalStyles } from '../global';
import ScalableText from 'react-native-text';

export default function ({ navigation }) {
  const [alarms, setAlarms] = useState(null);
  const [scheduler, setScheduler] = useState(null);

  useEffect(() => {
    navigation.addListener('focus', async () => {
      setAlarms(await getAllAlarms());
      setScheduler(setInterval(fetchState, 10000));
    });
    navigation.addListener('blur', async () => {
      clearInterval(scheduler);
    });
    fetchState();
  }, []);

  async function fetchState() {
    const alarmUid = await getAlarmState();
    if (alarmUid) {
      navigation.navigate('Ring', { alarmUid });
    }
  }

  return (
    <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
    <View style={globalStyles.container}>
      <View style={[globalStyles.innerContainer,styles.listView]}> 
        {alarms && alarms.length === 0 && <ScalableText style={{marginTop:100}}>No alarms</ScalableText>}
         {alarms &&
          alarms.map(a => (
            <AlarmView
              key={a.uid}
              uid={a.uid}
              onChange={async active => {
                let alarmTemp = JSON.parse(JSON.stringify(alarms))
                alarmTemp = alarmTemp.map(item => {
                  if (item.uid == a.uid) {
                    item.active = active
                  }
                  return item
                })
                setAlarms(alarmTemp)
                try {
                  if (active) {
                    await enableAlarm(a.uid);

                    // console.log("alar", a)
                  } else {
                    await disableAlarm(a.uid);
                  }
                }
                catch (err) {
                  console.log("erroe", err)
                }
              }}
              onPress={() => navigation.navigate('Edit', { alarm: a })}
              title={a.title}
              hour={a.dummyhour}
              minutes={a.dummyminutes}
              days={a.dummydays}
              dummytimezoneName={a.dummytimezoneName}
              isActive={a.active}
            />
          ))}
    
      </View>
      </View>
     </ScrollView>
  );
}



const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
   scrollContent: {
  paddingBottom: 100,   
  },
  listView: { 
 minHeight:300,  
 },

});
