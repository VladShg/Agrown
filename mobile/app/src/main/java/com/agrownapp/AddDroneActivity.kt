package com.agrownapp

import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.os.Looper
import android.view.View
import androidx.appcompat.app.AppCompatActivity
import android.widget.AutoCompleteTextView
import android.widget.ArrayAdapter
import android.widget.EditText
import android.widget.TextView
import com.beust.klaxon.Converter
import com.beust.klaxon.JsonObject
import com.github.kittinunf.fuel.Fuel
import com.github.kittinunf.fuel.core.Headers
import com.github.kittinunf.fuel.coroutines.awaitStringResponse
import com.github.kittinunf.fuel.httpGet
import org.jetbrains.anko.doAsync
import org.jetbrains.anko.toast
import org.jetbrains.anko.uiThread
import org.json.JSONArray
import org.json.JSONObject
import java.lang.Exception
import java.net.URL
import java.util.*
import kotlin.collections.ArrayList
import androidx.core.app.ComponentActivity.ExtraData
import androidx.core.content.ContextCompat.getSystemService
import android.icu.lang.UCharacter.GraphemeClusterBreak.T
import android.view.MenuItem


class AddDroneActivity : AppCompatActivity() {

    var models: ArrayList<String> = ArrayList<String>()
    var modelsObj: ArrayList<JSONObject> = ArrayList<JSONObject>()

    override fun onBackPressed() {
        super.onBackPressed()

        finish()
    }

    override fun moveTaskToBack(nonRoot: Boolean): Boolean {
        finish()
        return super.moveTaskToBack(nonRoot)
    }

    override fun onOptionsItemSelected(menuItem: MenuItem): Boolean {
        if (menuItem.getItemId() == android.R.id.home) {
                finish()
        }
        return super.onOptionsItemSelected(menuItem)
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_add_drone)

        val actionbar = supportActionBar
        actionbar!!.title = this.getResources().getString(R.string.add_drone)
        actionbar.setDisplayHomeAsUpEnabled(true)
        actionbar.setDisplayHomeAsUpEnabled(true)

        var models: ArrayList<String> = ArrayList<String>()
        var modelsObj: JSONArray
        var modelsIds: ArrayList<Int> = ArrayList<Int>()
        Fuel.get("${RequestStorage().api_url}/models")
            .header().response { request, response, result ->
                Looper.prepare()
                val str = String(response.body().toByteArray())
                modelsObj = JSONArray(str)
                for(i in 0 until modelsObj.length()) {
                    models.add(modelsObj.getJSONObject(i).getString("name"))
                    modelsIds.add(modelsObj.getJSONObject(i).getInt("id"))
                    this.models.add(modelsObj.getJSONObject(i).getString("name"))
                    this.modelsObj.add(modelsObj.getJSONObject(i))
                }
                val array = Array<String>(models.size, { "$it" })
                for(i in 0 until models.size)
                    array.set(i, models.get(i))
                val adapter = ArrayAdapter<String>(this, android.R.layout.simple_list_item_1, array)
                val acTextView: AutoCompleteTextView = findViewById(R.id.drone_add_model)
                acTextView.threshold = 1



                acTextView.setAdapter(adapter)
                adapter.notifyDataSetChanged()
            }
    }

    fun onSubmitAdd(view: View) {
        var modelName = findViewById<AutoCompleteTextView>(R.id.drone_add_model).text.toString()

        if (modelName.toString().isNullOrBlank()) {
            findViewById<TextView>(R.id.drone_add_model).setError(this.getResources().getString(R.string.field_no_empty))
        }

        var i = 1;
        if (this.models.indexOf(modelName) == -1) {
            toast(this.getResources().getString(R.string.model_not_found) + " '${this.models.get(0)}', " +
                    " '${this.models.get(1)}', '${this.models.get(2)}'" )
            return
        }

        var modelId: Int = -1
        for(i in 0 until modelsObj.size) {
            if (modelsObj.get(i).getString("name") == modelName) {
                modelId = modelsObj.get(0).getInt("id")
                continue
            }
        }
        var code = ""
        try {
            findViewById<EditText>(R.id.add_drone_code).text.toString().toInt()
            code = findViewById<EditText>(R.id.add_drone_code).text.toString()
        } catch (e: Exception) {
            code = ""
            findViewById<TextView>(R.id.add_drone_code).setError("0-9")
            return
        }
        var name = findViewById<EditText>(R.id.add_drone_name).text.toString()

        if (code.toString().isNullOrBlank()) {
            findViewById<TextView>(R.id.add_drone_code).setError(this.getResources().getString(R.string.field_no_empty))
        }
        if (name.toString().isNullOrBlank()) {
            findViewById<TextView>(R.id.add_drone_name).setError(this.getResources().getString(R.string.field_no_empty))
        }


        var bodyJson = JSONObject()
        bodyJson.put("name", name)
        bodyJson.put("code", code)
        bodyJson.put("model_id", modelId)
        bodyJson.put("token", UserPreference(this).getToken())


        Fuel.post("${RequestStorage().api_url}/add_drone")
            .header(Headers.CONTENT_TYPE, "application/json")
            .body(bodyJson.toString()).response { request, response, result ->
                val str = String(response.body().toByteArray())
                val ob = JSONObject(str)
                var error: String
                try {
                    error = ob.getString("error")
                } catch (e: Exception) {
                    error = ""
                }
                if (error != "" || response.statusCode != 200) {
                    // Invalid credentials
                } else {
                    toast(this.getResources().getString(R.string.created))
                    finish()
                }
            }
    }
}