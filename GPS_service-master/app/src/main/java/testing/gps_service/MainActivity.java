package testing.gps_service;

import android.Manifest;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.support.v4.content.ContextCompat;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.TextView;

import com.github.nkzawa.emitter.Emitter;
import com.github.nkzawa.socketio.client.IO;
import com.github.nkzawa.socketio.client.Socket;
import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.api.GoogleApi;
import com.google.android.gms.common.api.GoogleApiClient;
import com.google.android.gms.location.ActivityRecognition;
import com.google.android.gms.location.ActivityRecognitionApi;
import com.google.android.gms.location.ActivityTransition;
import com.google.android.gms.location.ActivityTransitionRequest;
import com.google.android.gms.location.DetectedActivity;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.android.gms.tasks.Task;

import org.json.JSONException;
import org.json.JSONObject;

import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;

public class MainActivity extends AppCompatActivity implements GoogleApiClient.ConnectionCallbacks, GoogleApiClient.OnConnectionFailedListener {

    private ImageButton btn_start;
    private TextView textView;
    private BroadcastReceiver broadcastReceiver;
    static Socket mSocket;
    static String update;



    {
        try {
            mSocket = IO.socket("https://georgy-server.now.sh");
        } catch (URISyntaxException e) {
            // TODO: error handling
            System.out.println("ggg");
        }
    }


    private void switchActivity (String update) {
        Intent activityUpdate = new Intent(MainActivity.this, OnBusActivity.class);
//        if (update == "ON_BUS") {
            startActivity(activityUpdate);
//        }

    }


    public ActivityTransitionRequest buildTransitionRequest() {
        List transitions = new ArrayList<>();
        transitions.add(new ActivityTransition.Builder()
                .setActivityType(DetectedActivity.IN_VEHICLE)
                .setActivityTransition(ActivityTransition.ACTIVITY_TRANSITION_ENTER)
                .build());
        transitions.add(new ActivityTransition.Builder()
                .setActivityType(DetectedActivity.IN_VEHICLE)
                .setActivityTransition(ActivityTransition.ACTIVITY_TRANSITION_EXIT)
                .build());
        transitions.add(new ActivityTransition.Builder()
                .setActivityType(DetectedActivity.WALKING)
                .setActivityTransition(ActivityTransition.ACTIVITY_TRANSITION_ENTER)
                .build());
        transitions.add(new ActivityTransition.Builder()
                .setActivityType(DetectedActivity.WALKING)
                .setActivityTransition(ActivityTransition.ACTIVITY_TRANSITION_EXIT)
                .build());
        return new ActivityTransitionRequest(transitions);
    }


    public Emitter.Listener onServerUpdate = new Emitter.Listener() {
        @Override
        public void call(final Object... args) {
            MainActivity.this.runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    JSONObject data = (JSONObject) args[0];

                    try {
                        update = data.getString("update");
                    } catch (JSONException e) {
                        return;
                    }
                    //TODO - do something
                    Log.i("Server Update", update);
                    switchActivity(update);
                    //activity switch based on the server update




                }
            });
        }
    };


    public GoogleApiClient mApiClient;


    @Override
    protected void onResume() {
        super.onResume();
        /*
        if(broadcastReceiver == null){
            broadcastReceiver = new BroadcastReceiver() {
                @Override
                public void onReceive(Context context, Intent intent) {
                    textView.append("\n" +intent.getExtras().get("coordinates"));
                }
            };
        }
        registerReceiver(broadcastReceiver,new IntentFilter("location_update"));
*/
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {

        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

       /* mApiClient = new GoogleApiClient.Builder(MainActivity.this)
                .addApi(ActivityRecognition.API)
                .addConnectionCallbacks(MainActivity.this)
                .addOnConnectionFailedListener(MainActivity.this)
                .build();
*/
        mApiClient = new GoogleApiClient.Builder(MainActivity.this)
                .addApi(ActivityRecognition.API)
                .addConnectionCallbacks(this)
                .addOnConnectionFailedListener(this)
                .build();


        btn_start = findViewById(R.id.imageButton);
        textView = findViewById(R.id.textView);

        if(!runtime_permissions()) {
            enable_buttons();
        }
        mSocket.on("server_update", onServerUpdate);
        mSocket.connect();
        mSocket.emit("user_gps_data");




    }


    @Override
    protected void onDestroy() {
        super.onDestroy();
        if(broadcastReceiver != null){
            unregisterReceiver(broadcastReceiver);
        }
        mSocket.off("server_update", onServerUpdate);
        mSocket.disconnect();
    }

    private void enable_buttons() {

        btn_start.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent i =new Intent(getApplicationContext(),GPS_Service.class);

                mApiClient.connect();

                startService(i);
            }
        });



    }

    private boolean runtime_permissions() {
        if(Build.VERSION.SDK_INT >= 23 && ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED && ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED){
            requestPermissions(new String[]{Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.ACCESS_COARSE_LOCATION},100);
            return true;
        }
        return false;
    }


    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if(requestCode == 100){
            if( grantResults[0] == PackageManager.PERMISSION_GRANTED && grantResults[1] == PackageManager.PERMISSION_GRANTED){
                enable_buttons();
            }else {
                runtime_permissions();
            }
        }
    }

    @Override
    public void onConnected(@Nullable Bundle bundle) {

        ActivityTransitionRequest request = buildTransitionRequest();

        Intent intent = new Intent(MainActivity.this, ActivityRecognitionService.class);
        PendingIntent  pendingIntent = PendingIntent.getService(MainActivity.this, 0 , intent ,  PendingIntent.FLAG_UPDATE_CURRENT);
        ActivityRecognition.getClient(MainActivity.this).requestActivityUpdates(2000, pendingIntent);

        Task task = ActivityRecognition.getClient(MainActivity.this)
                .requestActivityTransitionUpdates(request, pendingIntent);
        task.addOnSuccessListener(
                new OnSuccessListener() {
                    @Override
                    public void onSuccess(Object o) {


                    }


                });
        task.addOnFailureListener(
                new OnFailureListener() {
                    @Override
                    public void onFailure(Exception e) {
                        // Handle failure...
                    }
                });
    }




    @Override
    public void onConnectionSuspended(int i) {

    }

    @Override
    public void onConnectionFailed(@NonNull ConnectionResult connectionResult) {

    }

}
