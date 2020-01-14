package com.agrownapp

import android.content.Context

class UserPreference(context: Context) {
    val pref_name: String = "UserPreference"
    val pref_token: String? = ""

    val preference = context.getSharedPreferences(pref_name, Context.MODE_PRIVATE)

    fun getToken(): String {
        return preference.getString(pref_token, "").toString()
    }

    fun setToken(token: String) {
        val editor = preference.edit()
        editor.putString(pref_token, token)
        editor.apply()
    }
}