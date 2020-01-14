package com.agrownapp

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.widget.TextView
import com.agrown.com.agrownapp.login.LoginActivity
import com.github.kittinunf.fuel.Fuel
import com.github.kittinunf.fuel.core.Headers
import com.google.android.material.bottomsheet.BottomSheetDialog
import org.json.JSONObject





class MainActivity : AppCompatActivity() {

    fun openLogin() {
        val intent = Intent(this, LoginActivity::class.java)
        startActivity(intent)
        finish()
    }

    fun openMenu() {
        val intent = Intent(this, MenuActivity::class.java)
        startActivity(intent)
        finish()
    }

    override fun onActivityReenter(resultCode: Int, data: Intent?) {
        super.onActivityReenter(resultCode, data)

        val pref = UserPreference(this)
        var token = pref.getToken()
        if (token != "") {
            val bodyJson = """{
                    "token": "$token"
                }""".trimIndent()
            Fuel.post("${RequestStorage().api_url}/check_token")
                .header(Headers.CONTENT_TYPE, "application/json")
                .body(bodyJson).response { request, response, result ->
                    val str = String(response.body().toByteArray())
                    val ob = JSONObject(str)
                    val valid: Boolean = ob.getBoolean("token_is_valid")
                    if (valid) {
                        openMenu()
                    } else {
                        pref.setToken("")
                        openLogin()
                    }
                }
        } else {
            openLogin()
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val pref = UserPreference(this)
        var token = pref.getToken()
        if (token != "") {
            val bodyJson = """{
                    "token": "$token"
                }""".trimIndent()
            Fuel.post("${RequestStorage().api_url}/check_token")
                .header(Headers.CONTENT_TYPE, "application/json")
                .body(bodyJson).response { request, response, result ->
                    val str = String(response.body().toByteArray())
                    val ob = JSONObject(str)
                    val valid: Boolean = ob.getBoolean("token_is_valid")
                    if (valid) {
                        openMenu()
                    } else {
                        pref.setToken("")
                        openLogin()
                    }
                }
        } else {
            openLogin()
        }

    }
}
