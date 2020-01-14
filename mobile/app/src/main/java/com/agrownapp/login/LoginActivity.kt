package com.agrown.com.agrownapp.login

import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.EditText
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import com.agrown.com.agrownapp.signup.SignupActivity
import com.agrownapp.MenuActivity
import com.agrownapp.R
import com.agrownapp.RequestStorage
import com.agrownapp.UserPreference
import com.github.kittinunf.fuel.Fuel
import com.github.kittinunf.fuel.core.Headers
import com.google.android.material.bottomsheet.BottomSheetDialog
import org.json.JSONObject
import java.lang.Exception

class LoginActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login)


        var lang = findViewById<TextView>(R.id.login_lang)
        lang.setOnClickListener {
            val dialog = BottomSheetDialog(this)
            val view = layoutInflater.inflate(R.layout.lang_dialog, null)

            dialog.setCancelable(true)
            dialog.setContentView(view)
            dialog.show()
        }
    }


    fun submitLogin(view: View) {
        val login = findViewById<EditText>(R.id.add_drone_name).text
        val password = findViewById<EditText>(R.id.password_field).text

        var bodyJson = JSONObject()
        bodyJson.put("login", login)
        bodyJson.put("password", password)
        Fuel.post("${RequestStorage().api_url}/login")
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
                    var token = ob.getString("token")
                    UserPreference(this).setToken(token)
                    val intent = Intent(this, MenuActivity::class.java)
                    startActivity(intent)
                }
            }
    }

    fun switchLanguage(view: View) {
        val dialog = BottomSheetDialog(this)
        val view = layoutInflater.inflate(R.layout.lang_dialog, null)

        dialog.setCancelable(true)
        dialog.setContentView(view)
        dialog.show()
    }

    fun openSignup(view: View) {
        val intent = Intent(this, SignupActivity::class.java)
        startActivity(intent)
        finish()
    }

}