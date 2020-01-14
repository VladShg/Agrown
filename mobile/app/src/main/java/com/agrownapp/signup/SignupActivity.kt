package com.agrown.com.agrownapp.signup

import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import com.agrown.com.agrownapp.login.LoginActivity
import com.agrownapp.R
import com.google.android.material.bottomsheet.BottomSheetDialog

class SignupActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_signup)

        var lang = findViewById<TextView>(R.id.signup_lang)
        lang.setOnClickListener {
            val dialog = BottomSheetDialog(this)
            val view = layoutInflater.inflate(R.layout.lang_dialog, null)

            dialog.setCancelable(true)
            dialog.setContentView(view)
            dialog.show()
        }
    }


    fun submitShignup(view: View) {
        val login = findViewById<EditText>(R.id.signup_login_field).text
        val email = findViewById<EditText>(R.id.signup_email_field).text
        val password1 = findViewById<EditText>(R.id.signup_password1).text
        val password2 = findViewById<EditText>(R.id.signup_password2).text

        if (login.isNullOrBlank()) {
            (findViewById<EditText>(R.id.signup_login_field) as EditText).setError(this.getResources().getString(R.string.login_empty))
            return
        }
        if (email.isNullOrBlank()) {
            (findViewById<EditText>(R.id.signup_email_field) as EditText).setError(this.getResources().getString(R.string.email_empty))
            return
        }
        if (password1.isNullOrBlank()) {
            (findViewById<EditText>(R.id.signup_password1) as EditText).setError(this.getResources().getString(R.string.password_empty))
            return
        }
        if (password2.isNullOrBlank()) {
            (findViewById<EditText>(R.id.signup_password2) as EditText).setError(this.getResources().getString(R.string.password_empty))
            return
        }
        if (!password1.trim().toString().equals(password2.trim().toString())) {
            (findViewById<EditText>(R.id.signup_password2) as EditText).setError(this.getResources().getString(R.string.password_mismatch))
            return
        }
        if (!android.util.Patterns.EMAIL_ADDRESS.matcher(email).matches()) {
            (findViewById<EditText>(R.id.signup_email_field) as EditText).setError(this.getResources().getString(R.string.email_wrong))
            return
        }
    }

    fun switchLanguage(view: View) {
        val dialog = BottomSheetDialog(this)
        val view = layoutInflater.inflate(R.layout.lang_dialog, null)

        dialog.setCancelable(true)
        dialog.setContentView(view)
        dialog.show()
    }

    fun openLogin(view: View) {
        val intent = Intent(this, LoginActivity::class.java)
        startActivity(intent)
        finish()
    }
}