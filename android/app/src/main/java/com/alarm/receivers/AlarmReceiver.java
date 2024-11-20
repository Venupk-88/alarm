package com.alarm.receivers;


import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.os.PowerManager;
import android.util.Log;
import android.widget.Toast;
import com.alarm.AlarmService;
import com.rnalarm.MainActivity;
import static android.view.WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON;

public class AlarmReceiver extends BroadcastReceiver {

    private static final String TAG = "AlarmReceiver";

    @Override
    public void onReceive(Context context, Intent intent) {
        String alarmUid = intent.getStringExtra("ALARM_UID");
        Log.d(TAG, "received alarm: " + alarmUid);
        // Toast.makeText(context, "received alarm: " + alarmUid, Toast.LENGTH_LONG).show();

        Intent serviceIntent = new Intent(context, AlarmService.class);
        serviceIntent.putExtra("ALARM_UID", alarmUid);
        serviceIntent.putExtras(serviceIntent);

        PowerManager powerManager = (PowerManager)context.getSystemService(Context.POWER_SERVICE);
        PowerManager.WakeLock wakeLock = powerManager.newWakeLock(
                FLAG_KEEP_SCREEN_ON | PowerManager.ACQUIRE_CAUSES_WAKEUP,
                "MyApp:AlarmWakeLock");
        wakeLock.acquire(5 * 60 * 1000L /*5 minutes*/);

        Intent alarmIntent = new Intent(context, MainActivity.class);
        alarmIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK | Intent.FLAG_ACTIVITY_NO_USER_ACTION);
        context.startActivity(alarmIntent);
        wakeLock.release();

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            context.startForegroundService(serviceIntent);
        } else {
            context.startService(serviceIntent);
        }
    }
}
