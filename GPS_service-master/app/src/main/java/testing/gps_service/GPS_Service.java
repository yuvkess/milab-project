package testing.gps_service;

import android.annotation.SuppressLint;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Bundle;
import android.os.IBinder;
import android.provider.Settings;
import android.support.annotation.Nullable;
import android.widget.Toast;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;

import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

public class GPS_Service extends Service {

    private LocationListener listener;
    private LocationManager locationManager;
    private RequestQueue requestQueue;
    private static final String REQUEST_URL = "http://10.0.2.2:3000/gps_data";

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @SuppressLint("MissingPermission")
    @Override
    public void onCreate() {
            requestQueue = Volley.newRequestQueue(this);
            listener = new LocationListener() {
                @Override
                public void onLocationChanged(final Location location) {
                    Intent i = new Intent("location_update");
                    i.putExtra("coordinates",location.getLongitude()+" "+location.getLatitude());
                    sendBroadcast(i);

                    // Sending to server
                    Map<String, String> params = new HashMap();
                    params.put("longitude", String.valueOf(location.getLongitude()));
                    params.put("latitude", String.valueOf(location.getLatitude()));

                    JSONObject parameters = new JSONObject(params);

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

                @Override
                public void onStatusChanged(String s, int i, Bundle bundle) {

                }

                @Override
                public void onProviderEnabled(String s) {

                }

                @Override
                public void onProviderDisabled(String s) {
                        Intent i = new Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS);
                        i.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                    startActivity(i);
                }
            };

        locationManager = (LocationManager) getApplicationContext().getSystemService(Context.LOCATION_SERVICE);
        //noinspection MissingPermission
        locationManager.requestLocationUpdates(LocationManager.GPS_PROVIDER,3000,0,listener);

    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        if(locationManager != null){
            //noinspection MissingPermission
            locationManager.removeUpdates(listener);
        }
    }
}
