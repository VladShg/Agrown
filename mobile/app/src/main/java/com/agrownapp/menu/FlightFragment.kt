package com.agrownapp.menu

import androidx.fragment.app.Fragment
import android.os.Bundle



class FlightFragment : Fragment() {


    fun newInstance(param1: String, param2: String): FlightFragment {
        val fragment = FlightFragment()
        val args = Bundle()
        args.putString("param1", param1)
        args.putString("param2", param2)
        fragment.arguments = args
        return fragment
    }
}