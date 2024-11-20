/* eslint-disable prettier/prettier */
import {NativeModules} from 'react-native';
import 'react-native-get-random-values';
import {v4 as uuidv4} from 'uuid';

const AlarmService = NativeModules.AlarmModule;

export async function scheduleAlarm(alarm) {
  if (!(alarm instanceof Alarm)) {
    alarm = new Alarm(alarm);
  }
  try {

    
    var dummyhour=alarm.dummyhour
    var dummyminutes=alarm.dummyminutes
    var repeating=alarm.repeating 
    var dummydays=alarm.days 
    alarm.dummydays = dummydays
    var timezoneName=alarm.timezoneName
    var timezoneValue='UTC'
    var offset = -6;  
      if(timezoneName==100){ 
        alarm.hour = dummyhour
        alarm.minutes = dummyminutes
        alarm.dummytimezoneName = 'UTC-6'
      }else{ 
    var timezoneResult = parseInt(timezoneName) + parseInt(offset); 
    timezoneValue = timezoneValue + (timezoneResult >= 0 ? '+' : '') + timezoneResult;
    const date = new Date();
    date.setHours(dummyhour, dummyminutes); 
    const utcMinus6Time = new Date(date.getTime() + (timezoneName * 60 * 60000));
    
    alarm.hour = utcMinus6Time.getHours(); 
    alarm.minutes = utcMinus6Time.getMinutes(); 
    alarm.dummytimezoneName = timezoneValue
    if (utcMinus6Time.getHours() < dummyhour && timezoneName > 0) { 
      alarm.days = dummydays.map(days => (days + 1) % 7);
    }
    if (utcMinus6Time.getHours() > dummyhour && timezoneName < 0) { 
      alarm.days = dummydays.map(days => (days - 1) % 7);
    }
      }
      
    if (dummydays.length === 0 || !repeating) {
      const today = new Date().getDay();  
      alarm.days = [today];
      alarm.dummydays = [today];
    } 
   

    await AlarmService.set(alarm.toAndroid());
    console.log('scheduling alarm: ', JSON.stringify(alarm));
  } catch (e) {
    console.log(e);
  }
}

export async function enableAlarm(uid) {
  try {
    await AlarmService.enable(uid);
  } catch (e) {
    console.log(e);
  }
}

export async function disableAlarm(uid) {
  try {
    await AlarmService.disable(uid);
  } catch (e) {
    console.log(e);
  }
}

export async function stopAlarm() {
  try { 
    await AlarmService.stop();
  } catch (e) {
    console.log(e);
  }
}

export async function snoozeAlarm() {
  try {  
    await AlarmService.snooze();
  } catch (e) {
    console.log(e);
  }
}

export async function removeAlarm(uid) {
  try {
    await AlarmService.remove(uid);
  } catch (e) {
    console.log(e);
  }
}

export async function updateAlarm(alarm) {
  if (!(alarm instanceof Alarm)) {
    alarm = new Alarm(alarm);
  }
  try {
    var dummyhour=alarm.dummyhour
    var dummyminutes=alarm.dummyminutes
    var repeating=alarm.repeating 
    var dummydays=alarm.days 
    alarm.dummydays = dummydays
    var timezoneName=alarm.timezoneName
    var timezoneValue='UTC'
    var offset = -6;  
      if(timezoneName==100){ 
        alarm.hour = dummyhour
        alarm.minutes = dummyminutes
        alarm.dummytimezoneName = 'UTC-6'
      }else{ 
    var timezoneResult = parseInt(timezoneName) + parseInt(offset); 
    timezoneValue = timezoneValue + (timezoneResult >= 0 ? '+' : '') + timezoneResult;
    const date = new Date();
    date.setHours(dummyhour, dummyminutes); 
    const utcMinus6Time = new Date(date.getTime() + (timezoneName * 60 * 60000));
    
    alarm.hour = utcMinus6Time.getHours(); 
    alarm.minutes = utcMinus6Time.getMinutes(); 
    alarm.dummytimezoneName = timezoneValue
    if (utcMinus6Time.getHours() < dummyhour && timezoneName > 0) { 
      alarm.days = dummydays.map(days => (days + 1) % 7);
    }
    if (utcMinus6Time.getHours() > dummyhour && timezoneName < 0) { 
      alarm.days = dummydays.map(days => (days - 1) % 7);
    }
      }
      
    if (dummydays.length === 0 || !repeating) {
      const today = new Date().getDay();  
      alarm.days = [today];
      alarm.dummydays = [today];
    } 
    await AlarmService.update(alarm.toAndroid());
    console.log('updated alarm: ', JSON.stringify(alarm));
  } catch (e) {
    console.log(e);
  }
}

export async function removeAllAlarms() {
  try {
    await AlarmService.removeAll();
  } catch (e) {
    console.log(e);
  }
}

export async function getAllAlarms() {
  try {
    const alarms = await AlarmService.getAll();
    return alarms.map(a => Alarm.fromAndroid(a));
  } catch (e) {
    console.log(e);
  }
}

export async function getAlarm(uid) {
  try {
    const alarm = await AlarmService.get(uid);
    return Alarm.fromAndroid(alarm);
  } catch (e) {
    console.log(e);
  }
}

export async function getAlarmState() {
  try {
    return AlarmService.getState();
  } catch (e) {
    console.log(e);
  }
}

export default class Alarm {
  constructor(params = null) {
    this.uid = getParam(params, 'uid', uuidv4());
    this.enabled = getParam(params, 'enabled', true);
    this.title = getParam(params, 'title', 'Alarm');
    this.description = getParam(params, 'description', 'Wake up');
    this.hour = getParam(params, 'hour', new Date().getHours());
    this.minutes = getParam(params, 'minutes', new Date().getMinutes() + 1);
    this.snoozeInterval = getParam(params, 'snoozeInterval', 1);
    this.repeating = getParam(params, 'repeating', false);
    this.active = getParam(params, 'active', true);
    this.days = getParam(params, 'days', [new Date().getDay()]);
    this.soundName = getParam(params, 'soundName', 'bird');
    this.timezoneName = getParam(params, 'timezoneName', 100);
    this.dummyhour = getParam(params, 'dummyhour', new Date().getHours());
    this.dummyminutes = getParam(params, 'dummyminutes', new Date().getMinutes() + 1);
    this.dummydays = getParam(params, 'dummydays', [new Date().getDay()]);
    this.dummytimezoneName = getParam(params, 'dummytimezoneName', 'UTC-6');
  }

  static getEmpty() {
    return new Alarm({
      title: '',
      description: '',
      hour: 0,
      minutes: 0,
      repeating: false,
      days: [],
      soundName: 'bird',
      timezoneName: 100,
      dummyhour: 0,
      dummyminutes: 0,
      dummydays: [],
      dummytimezoneName: 'UTC-6',
    });
  }

  toAndroid() {
    return {
      ...this,
      days: toAndroidDays(this.days),
    };
  }

  static fromAndroid(alarm) {
    alarm.days = fromAndroidDays(alarm.days);
    return new Alarm(alarm);
  }

  getTimeString() {
    const hour = this.hour < 10 ? '0' + this.hour : this.hour;
    const minutes = this.minutes < 10 ? '0' + this.minutes : this.minutes;
    return {hour, minutes};
  }

  getTime() {
    const timeDate = new Date();
    timeDate.setMinutes(this.minutes);
    timeDate.setHours(this.hour);
    return timeDate;
  }
}

function getParam(param, key, defaultValue) {
  try {
    if (param && (param[key] !== null || param[key] !== undefined)) {
      return param[key];
    } else {
      return defaultValue;
    }
  } catch (e) {
    return defaultValue;
  }
}

export function toAndroidDays(daysArray) {
  return daysArray.map(day => (day + 1) % 7);
}

export function fromAndroidDays(daysArray) {
  return daysArray.map(d => (d === 0 ? 6 : d - 1));
}
