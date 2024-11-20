/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, View,TouchableOpacity, Text,Modal } from 'react-native';
import Alarm, { removeAlarm, scheduleAlarm, updateAlarm } from '../alarm';
import TextInput from '../components/TextInput';
import DayPicker from '../components/DayPicker';
import TimePicker from '../components/TimePicker';
import CheckBox from '../components/CheckBox';
import SelectBox from '../components/SelectBox';
import Button from '../components/Button';
import { globalStyles } from '../global';
import SwitcherInput from '../components/SwitcherInput';
import ScalableText from 'react-native-text';
import DocumentPicker from 'react-native-document-picker';  
import RNFS from 'react-native-fs';


export default function ({ route, navigation }) {
  
 
  useEffect(() => { 
    loadMp3Files();
  }, []);

  const loadMp3Files = async () => {
    try {  
      
      const documentDir = await RNFS.readDir(RNFS.DocumentDirectoryPath); 
      const mp3FileNames = documentDir
      .filter(file => file.isFile())  
      .map(file => file.name) 
      .filter(fileName => fileName.endsWith('.mp3'));
  
      const soundLists = mp3FileNames.map(fileName => ({
        id: fileName,
        label: fileName.replace('.mp3', '')
      })); 
       setSoundLists(prevMp3Files => [
      ...prevMp3Files,
      ...soundLists
    ]);

    } catch (err) {
      console.error('Error loading files:', err);
      // Alert.alert('Error', 'An error occurred while loading files.');
    }
  };

    const selectAndSaveFile = async () => {
      try {
        // Pick a file from the user's device
        const res = await DocumentPicker.pick({
          type: [DocumentPicker.types.audio], // Adjust type if needed
        });
  
        console.log('Document Picker Result:', res[0]);
   
        const destPath = `${RNFS.DocumentDirectoryPath}/${res[0].name}`;

        // console.log('Destination Path:', destPath);  
        const fileContent = await RNFS.readFile(res[0].uri, 'base64');
 
        await RNFS.writeFile(destPath, fileContent, 'base64');

        // Alert.alert('Success', `File saved to: ${destPath}`);
        setSoundLists(prevMp3Files => [
          ...prevMp3Files,
          { id: res[0].name, label: res[0].name.replace('.mp3', '') },
        ]);
        update([['soundName', res[0].name]]);
      } catch (err) {
        if (DocumentPicker.isCancel(err)) {
          console.log('User canceled the picker');
        } else {
          console.error('Error:', err);
          Alert.alert('Error', 'An error occurred while selecting or saving the file.');
        }
      }
    };


  const [alarm, setAlarm] = useState(null);
  const [mode, setMode] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [soundLists, setSoundLists] = useState([
    { id: 'slow', label: 'slow' },
    { id: 'bird', label: 'bird' }, 
  ]); 
  const timezoneLists = [ 
    { value: -6, label: 'UTC-12' }, 
    { value: -5, label: 'UTC-11' }, 
    { value: -4, label: 'UTC-10' }, 
    { value: -3, label: 'UTC-9' }, 
    { value: -2, label: 'UTC-8' }, 
    { value: -1, label: 'UTC-7' }, 
    { value: 100, label: 'UTC-6' }, 
    { value: 1, label: 'UTC-5' }, 
    { value: 2, label: 'UTC-4' }, 
    { value: 3, label: 'UTC-3' }, 
    { value: 4, label: 'UTC-2' }, 
    { value: 5, label: 'UTC-1' }, 
    { value: 6, label: 'UTC+0' }, 
    { value: 7, label: 'UTC+1' }, 
    { value: 8, label: 'UTC+2' }, 
    { value: 9, label: 'UTC+3' }, 
    { value: 10, label: 'UTC+4' }, 
    { value: 11, label: 'UTC+5' }, 
    { value: 12, label: 'UTC+6' }, 
    { value: 13, label: 'UTC+7' }, 
    { value: 14, label: 'UTC+8' }, 
    { value: 15, label: 'UTC+9' }, 
    { value: 16, label: 'UTC+10' }, 
    { value: 17, label: 'UTC+11' }, 
    { value: 18, label: 'UTC+12' }, 
    { value: 19, label: 'UTC+13' }, 
    { value: 20, label: 'UTC+14' }, 
    // { value: 5.30, label: 'India' }, 
  ]; 
  useEffect(() => {
    if (route.params && route.params.alarm) {
      setAlarm(new Alarm(route.params.alarm));
      setMode('EDIT');
    } else {
      setAlarm(new Alarm());
      setMode('CREATE');
    }
  }, []);

  function update(updates) {  
    const a = Object.assign({}, alarm);
    for (let u of updates) {
      a[u[0]] = u[1];
    }
    setAlarm(a);
  }

  async function onSave() {
    if (mode === 'EDIT') {
      alarm.active = true;
      await updateAlarm(alarm);
    }
    if (mode === 'CREATE') {
      await scheduleAlarm(alarm);
    }
    navigation.goBack();
  }

  async function onDelete() {
    await removeAlarm(alarm.uid);
    navigation.goBack();
  }

  if (!alarm) {
    return <View />;
  }

  return (
    <View style={globalStyles.container}>
      <View style={[globalStyles.innerContainer, styles.container]}>
        <View styles={styles.inputsContainer}>
          <TimePicker
            onChange={(h, m) => {  
              update([
                ['dummyhour', h],
                ['dummyminutes', m],
              ])
              return
            }
            }
            hour={alarm.dummyhour}
            minutes={alarm.dummyminutes}
            dummytimezoneName={alarm.dummytimezoneName}
          />
          <TextInput
            description={'Title'}
            style={styles.textInput}
            onChangeText={v => update([['title', v]])}
            value={alarm.title}
          />
          <TextInput
            description={'Description'}
            style={styles.textInput}
            onChangeText={v => update([['description', v]])}
            value={alarm.description}
          />   
 
 
    
    <View style={styles.checkboxcontainer}>
    <View style={styles.checkboxRow}>
    <ScalableText style={styles.titleText}>Sound     :</ScalableText>

        <TouchableOpacity onPress={() => setIsModalVisible(true)}>
          <Text style={styles.currentSound}>{alarm.soundName || 'Select Sound'}</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {soundLists.map((sound) => (
              <CheckBox
                key={sound.id}
                description={sound.label}
                checked={alarm.soundName === sound.id}
                onCheckChange={() => update([['soundName', sound.id]])} 
              />
            ))}
               <View style={styles.modalButtonContainer}>
    <TouchableOpacity onPress={selectAndSaveFile}>
      <Text style={styles.buttonText}>Add New Sound</Text>
    </TouchableOpacity> 
    
            <TouchableOpacity onPress={() => setIsModalVisible(false)}>
              <Text style={styles.closeButton}>Close</Text>
            </TouchableOpacity>
            </View>


          </View>
        </View>
      </Modal>
 </View>
          
         <SelectBox 
          description={'Location :'} 
          selectedValue={alarm.timezoneName} 
          onValueChange={v => update([['timezoneName', v]])} 
          timezoneList={timezoneLists}
        /> 

          <SwitcherInput
            description={'Repeat'}
            value={alarm.repeating}
            onChange={v => update([['repeating', v]])}
          />

          {alarm.repeating && (
            <DayPicker
              onChange={v => update([['days', v]])}
              activeDays={alarm.dummydays}
            />
          )}
        </View>
        <View style={styles.buttonContainer}>
          {mode === 'EDIT' && <Button onPress={onDelete} title={'Delete'} />}
          <Button fill={true} onPress={onSave} title={'Save'} />
        </View>

       

    
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-around',
    alignItems: 'center',
    height: '100%',
  },
  inputsContainer: {
    width: '100%',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  checkboxRow: {
    flexDirection: 'row', // Aligns all checkboxes in a row
    alignItems: 'center', // Centers items vertically in the row
  },
  titleText: {
    width: 70,
    fontWeight: 'bold',
  },
///////////////////
  checkboxcontainer: {
    paddingVertical: 20,
  }, 
  currentSound: {
    fontSize: 18,
    color: 'blue',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  closeButton: { 
    fontSize: 18,
    color: 'red', 
  },
  modalButtonContainer: {
    flexDirection: 'row',        
    justifyContent: 'space-between', 
    alignItems: 'center',       
    padding: 10,              
  }, 
  buttonText: {
    color: 'blue', 
    fontSize: 18,
  },
});
