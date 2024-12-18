package com.alarm;

import android.content.Context;
import android.media.AudioManager;
import android.media.MediaPlayer;
import android.net.Uri;
import android.os.Build;
import android.os.Handler;

import android.os.VibrationEffect;
import android.os.Vibrator;
import android.provider.Settings;
import android.util.Log;

import java.io.File;
import android.widget.Toast;

class Sound {

    private static final String TAG = "AlarmSound";
    private static final long DEFAULT_VIBRATION = 100;

    private AudioManager audioManager;
    private int userVolume;
    private MediaPlayer mediaPlayer;
    private Vibrator vibrator;

    private Context context;
   
    private Handler handler = new Handler();
    private int currentVolumeLevel = 0; // Ensure this is properly declared as an instance variable
    private static final int MAX_VOLUME_LEVEL = 10; // Maximum volume level to increase to
    private static final int VOLUME_INCREASE_INTERVAL = 500; // Interval in milliseconds


    Sound(Context context) {
        this.context = context;
        this.vibrator = (Vibrator) context.getSystemService(Context.VIBRATOR_SERVICE);
        this.audioManager = (AudioManager) context.getSystemService(Context.AUDIO_SERVICE);
        this.userVolume = audioManager.getStreamVolume(AudioManager.STREAM_ALARM);
        this.mediaPlayer = new MediaPlayer();
    }

    void play(String sound) {
        Uri soundUri = getSoundUri(sound);
        playSound(soundUri);
        startVibration();
    }

    void stop() {
        try {
            if (mediaPlayer.isPlaying()) {
                stopSound();
                stopVibration();
                mediaPlayer.release();
            }
        } catch (IllegalStateException e) {
            Log.d(TAG, "Sound has probably been released already");
        }
    }

    private void playSound(Uri soundUri) {
        try {
            if (!mediaPlayer.isPlaying()) {
                mediaPlayer.setScreenOnWhilePlaying(true);
                mediaPlayer.setAudioStreamType(AudioManager.STREAM_ALARM);
                mediaPlayer.setDataSource(context, soundUri);
                mediaPlayer.setVolume(0,100);
                 mediaPlayer.setLooping(true);
                mediaPlayer.prepare();
                mediaPlayer.start();
                graduallyIncreaseVolume();
            }
        } catch (Exception e) {
            Log.e(TAG, "Failed to play sound", e);
        }
    }
      private void graduallyIncreaseVolume() {
        handler.postDelayed(new Runnable() {
            @Override
            public void run() {
                if (currentVolumeLevel <= MAX_VOLUME_LEVEL) {
                    float volume = currentVolumeLevel / (float) MAX_VOLUME_LEVEL;
                    mediaPlayer.setVolume(volume, volume);
                    currentVolumeLevel++;
                    handler.postDelayed(this, VOLUME_INCREASE_INTERVAL);
                }
            }
        }, VOLUME_INCREASE_INTERVAL);
    }

    private void stopSound() {
        try {
            // reset the volume to what it was before we changed it.
            audioManager.setStreamVolume(AudioManager.STREAM_ALARM, userVolume, AudioManager.FLAG_PLAY_SOUND);
            mediaPlayer.stop();
            mediaPlayer.reset();
        } catch (Exception e) {
            e.printStackTrace();
            Log.e(TAG, "ringtone: " + e.getMessage());
        }
    }

    private void startVibration() {
        vibrator.vibrate(DEFAULT_VIBRATION);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            vibrator.vibrate(VibrationEffect.createOneShot(5000, VibrationEffect.DEFAULT_AMPLITUDE));
        } else {
            //deprecated in API 26
            vibrator.vibrate(500);
        }

        long[] pattern = {0, 100, 1000};

        // The '0' here means to repeat indefinitely
        // '0' is actually the index at which the pattern keeps repeating from (the start)
        // To repeat the pattern from any other point, you could increase the index, e.g. '1'
        vibrator.vibrate(pattern, 0);
    }

    private void stopVibration() {
        vibrator.cancel();
    }

    // private Uri getSoundUri(String soundName) {
    //     Uri soundUri;
    //     if (soundName.equals("default")) {
    //         soundUri = Settings.System.DEFAULT_RINGTONE_URI;
    //     } else {
    //         int resId;
    //         if (context.getResources().getIdentifier(soundName, "raw", context.getPackageName()) != 0) {
    //             resId = context.getResources().getIdentifier(soundName, "raw", context.getPackageName());
    //         } else {
    //             soundName = soundName.substring(0, soundName.lastIndexOf('.'));
    //             resId = context.getResources().getIdentifier(soundName, "raw", context.getPackageName());
    //         }
    //         soundUri = Uri.parse("android.resource://" + context.getPackageName() + "/" + resId);
    //     }
    //     return soundUri;
    // }


private Uri getSoundUri(String soundName) {
    Uri soundUri;
    
    if (soundName.equals("default")) { 
        soundUri = Settings.System.DEFAULT_RINGTONE_URI;
    } else {
        int resId = 0; 
        resId = context.getResources().getIdentifier(soundName, "raw", context.getPackageName()); 
        if (resId != 0) { 
            soundUri = Uri.parse("android.resource://" + context.getPackageName() + "/" + resId);
        } else {  
       File directory = context.getFilesDir(); 
       File file = new File(directory, soundName);
            if (file.exists()) {  
        //   Toast.makeText(context, "Rr: " + file, Toast.LENGTH_LONG).show();
                soundUri = Uri.fromFile(file);
            } else { 
                soundName = soundName.substring(0, soundName.lastIndexOf('.'));
                resId = context.getResources().getIdentifier(soundName, "raw", context.getPackageName()); 
                if (resId != 0) {
                    soundUri = Uri.parse("android.resource://" + context.getPackageName() + "/" + resId);
                } else { 
                    soundUri = null;
                }
            }
        }
    } 
    return soundUri;
}


}