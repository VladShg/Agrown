package com.agrownapp.menu

import android.os.Bundle
import androidx.fragment.app.Fragment

class FieldFragment : Fragment() {
    fun newInstance(param1: String, param2: String): FieldFragment {
        val fragment = FieldFragment()
        val args = Bundle()
        args.putString("param1", param1)
        args.putString("param2", param2)
        fragment.arguments = args
        return fragment
    }
}