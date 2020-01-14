package com.agrownapp.menu

import android.content.Intent
import android.os.Bundle
import android.os.Looper
import androidx.fragment.app.Fragment
import android.widget.Toast
import android.widget.AdapterView
import android.widget.ArrayAdapter
import android.view.ViewGroup
import android.view.LayoutInflater
import android.view.View
import android.widget.ListView
import com.agrownapp.MenuActivity
import com.agrownapp.RequestStorage
import com.agrownapp.UserPreference
import com.github.kittinunf.fuel.Fuel
import com.github.kittinunf.fuel.core.Headers
import com.github.kittinunf.fuel.coroutines.awaitStringResponse
import kotlinx.coroutines.runBlocking
import org.jetbrains.anko.custom.async
import org.jetbrains.anko.doAsync
import org.jetbrains.anko.uiThread
import org.json.JSONArray
import org.json.JSONObject
import java.lang.Exception
import com.agrownapp.R



class DroneFragment : Fragment() {
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        var drones = Array<String>(0, {"$it"})
        var bodyJson = JSONObject()
        bodyJson.put("token", UserPreference(this.requireContext()).getToken())
        var a = runBlocking {
           Fuel.post("${RequestStorage().api_url}/drones")
                    .header(Headers.CONTENT_TYPE, "application/json")
                    .body(bodyJson.toString()).awaitStringResponse()
        }

        var str = a.third
        var jsonArray: JSONArray = JSONArray(str)
        drones = Array<String>(jsonArray.length(), { "$it" })
        for (i in 0 until jsonArray.length())
            drones.set(i, jsonArray.getJSONObject(i).getString("name"))


        val rootView = inflater.inflate(R.layout.drone_element, container, false)

        val lv = rootView.findViewById(R.id.drone_list) as ListView
        val adapter = ArrayAdapter(this.activity!!, android.R.layout.simple_list_item_1, drones)
        lv.adapter = adapter

        lv.onItemClickListener = AdapterView.OnItemClickListener { parent, view, position, id -> Toast.makeText(activity, drones[position], Toast.LENGTH_SHORT).show() }
        return rootView
    }
}