package testing.gps_service;

import android.app.IntentService;
import android.content.Intent;
import android.content.Context;
import android.nfc.Tag;
import android.util.Log;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.google.android.gms.location.ActivityRecognitionResult;
import com.google.android.gms.location.ActivityTransition;
import com.google.android.gms.location.ActivityTransitionEvent;
import com.google.android.gms.location.ActivityTransitionRequest;
import com.google.android.gms.location.ActivityTransitionResult;
import com.google.android.gms.location.DetectedActivity;

import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * An {@link IntentService} subclass for handling asynchronous task requests in
 * a service on a separate handler thread.
 * <p>
 * TODO: Customize class - update intent actions, extra parameters and static
 * helper methods.
 */
public class ActivityRecognitionService extends IntentService {
    private static final String TAG = "ActivityRecogService";
    private RequestQueue requestQueue;
    private static final String REQUEST_URL = "\"https://georgy-server.now.sh\"";

    public ActivityRecognitionService() {

        super("ActivityRecognitionService");


    }

    public ActivityRecognitionService(String name) {
        super(name);
    }


    @Override
    protected void onHandleIntent(Intent intent) {
        if (ActivityTransitionResult.hasResult(intent)) {
            ActivityTransitionResult result = ActivityTransitionResult.extractResult(intent);
            HandleDetectedActivity(result.getTransitionEvents());
        }
    }

    private void HandleDetectedActivity(List<ActivityTransitionEvent> probableActivities) {

        Map<String, String> params = new HashMap();
        params.put("origin", "demo-app");
        params.put("userId", "demo-user");
        params.put("timestamp", "" + System.currentTimeMillis());
        /*
        for(DetectedActivity activity: probableActivities){
            switch (activity.getType()){
                case DetectedActivity.STILL:{
                    Log.d(TAG, "Detected Activity : STILL " + activity.getConfidence());
                    params.put("activityType","" + activity.getType());
                    params.put("activityConfidence" ,"" + activity.getConfidence());
                    break;

                }
                case DetectedActivity.ON_FOOT:{
                    Log.d(TAG, "Detected Activity : ON_FOOT " + activity.getConfidence());
                    params.put("activityType","" + activity.getType());
                    params.put("activityConfidence" ,"" + activity.getConfidence());
                    break;

                }
                case DetectedActivity.ON_BICYCLE:{
                    Log.d(TAG, "Detected Activity : ON_BICYCLE " + activity.getConfidence());
                    params.put("activityType","" + activity.getType());
                    params.put("activityConfidence" ,"" + activity.getConfidence());
                    break;

                }
                case DetectedActivity.IN_VEHICLE:{
                    Log.d(TAG, "Detected Activity : IN_VEHICLE " + activity.getConfidence());
                    params.put("activityType","" + activity.getType());
                    params.put("activityConfidence" ,"" + activity.getConfidence());
                    break;

                }
                case DetectedActivity.UNKNOWN:{
                    Log.d(TAG, "Detected Activity : UNKNOWN " + activity.getConfidence());
                    params.put("activityType","" + activity.getType());
                    params.put("activityConfidence" ,"" + activity.getConfidence());
                    break;

                }
            }
        }
        */

        for (ActivityTransitionEvent event : probableActivities) {
            switch (event.getActivityType()) {
                case DetectedActivity.STILL: {
                    Log.d(TAG, "Detected Activity : STILL ");
                    //params.put("activityType", "" + event.getActivityType());
                    params.put("activityTransition", "" + event.getTransitionType());
                    break;
                }
                case DetectedActivity.ON_FOOT: {
                    Log.d(TAG, "Detected Activity : ON_FOOT ");
                   // params.put("activityType", "" + event.getActivityType());
                    params.put("activityTransition", "" + event.getTransitionType());
                    break;
                }


            }


            JSONObject parameters = new JSONObject(params);
            if (MainActivity.mSocket.connected()) {
                // Sending to server via socket io
                MainActivity.mSocket.emit("activity_transition", parameters);
                Log.d(TAG, "emit to server activity update");
            } else {
            // Sending to server via http request
            JsonObjectRequest jsonRequest = new JsonObjectRequest(Request.Method.POST, REQUEST_URL, parameters, new Response.Listener<JSONObject>() {
                @Override
                public void onResponse(JSONObject response) {
                    //TODO: handle success
                }
            }, new Response.ErrorListener() {
                @Override
                public void onErrorResponse(VolleyError error) {
                    error.printStackTrace();
                    //TODO: handle failure
                }
            });

            requestQueue.add(jsonRequest);
        }
        }

    }
}





