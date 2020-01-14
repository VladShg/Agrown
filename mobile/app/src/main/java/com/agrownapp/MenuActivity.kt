package com.agrownapp

import android.content.Intent
import android.os.Bundle
import android.view.*
import android.widget.FrameLayout
import androidx.appcompat.app.AppCompatActivity
import com.agrown.com.agrownapp.login.LoginActivity
import com.google.android.material.bottomnavigation.BottomNavigationView
import com.google.android.material.bottomsheet.BottomSheetDialog
import androidx.fragment.app.Fragment
import com.agrownapp.menu.DroneFragment
import com.agrownapp.menu.FieldFragment
import com.agrownapp.menu.FlightFragment



class MenuActivity : AppCompatActivity() {

    var currentFragment: Fragment = DroneFragment()

    fun openFragment(fragment: Fragment) {
        val transaction = supportFragmentManager.beginTransaction()
        transaction.replace(R.id.container, fragment)
        transaction.addToBackStack(null)
        transaction.commit()
    }

    override fun onActivityReenter(resultCode: Int, data: Intent?) {
        super.onActivityReenter(resultCode, data)

        supportFragmentManager.beginTransaction().replace(R.id.container, this.currentFragment).commit()
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        supportFragmentManager.beginTransaction().replace(R.id.container, this.currentFragment).commit()

        val navigationItemSelectedListener =
            object : BottomNavigationView.OnNavigationItemSelectedListener {
                override fun onNavigationItemSelected(item: MenuItem): Boolean {
                    when (item.itemId) {
                        R.id.nav_drone -> {
                            val crimeFragment = DroneFragment()
                            supportFragmentManager.beginTransaction().replace(R.id.container, crimeFragment).commit()
                        }
                        R.id.nav_field -> {
                            openFragment(FieldFragment().newInstance("", ""))
                            return true
                        }
                        R.id.nav_flight -> {
                            openFragment(FlightFragment().newInstance("", ""))
                            return true
                        }
                    }
                    return false
                }
            }

        val nav = findViewById<BottomNavigationView>(R.id.bottom_bar)
        nav.setOnNavigationItemSelectedListener(navigationItemSelectedListener);


        adjustGravity(nav)
        adjustWidth(nav)
    }

    fun addDrone(view: View) {
        val intent = Intent(this, AddDroneActivity::class.java)
        startActivity(intent)
    }

    override fun onCreateOptionsMenu(menu: Menu): Boolean {
        val inflater = menuInflater
        inflater.inflate(R.menu.toolbar_menu, menu)
        return true
    }

    override fun onOptionsItemSelected(item: MenuItem?): Boolean {
        val id = item!!.itemId
        if (id == R.id.item_logout) {
            UserPreference(this).setToken("")
            val intent = Intent(this, LoginActivity::class.java)
            startActivity(intent)
            finish()
        } else if (id == R.id.item_lan) {
            val dialog = BottomSheetDialog(this)
            val view = layoutInflater.inflate(R.layout.lang_dialog, null)

            dialog.setCancelable(true)
            dialog.setContentView(view)
            dialog.show()
        }
        return super.onOptionsItemSelected(item)
    }

    fun onTabSelected(position: Int, wasSelected: Boolean) {
        if (position == 0) {
            this.currentFragment = DroneFragment()
            supportFragmentManager.beginTransaction().replace(R.id.content, this.currentFragment).commit()
        }
    }


    private fun loadFragment(fragment: Fragment) {
        // load fragment
        val transaction = supportFragmentManager.beginTransaction()
        transaction.replace(R.id.container, fragment)
        transaction.addToBackStack(null)
        transaction.commit()
    }


    // fix bottom bar
    private fun adjustGravity(v: View) {
        if (v.id == R.id.smallLabel) {
            val parent = v.parent as ViewGroup
            parent.setPadding(0, 0, 0, 0)

            val params = parent.layoutParams as FrameLayout.LayoutParams
            params.gravity = Gravity.CENTER
            parent.layoutParams = params
        }

        if (v is ViewGroup) {
            val vg = v as ViewGroup

            for (i in 0 until vg.childCount) {
                adjustGravity(vg.getChildAt(i))
            }
        }
    }
    // fix bottom bar
    private fun adjustWidth(nav: BottomNavigationView) {
        try {
            val menuViewField = nav.javaClass.getDeclaredField("mMenuView")
            menuViewField.isAccessible = true
            val menuView = menuViewField.get(nav)

            val itemWidth = menuView.javaClass.getDeclaredField("mActiveItemMaxWidth")
            itemWidth.isAccessible = true
            itemWidth.setInt(menuView, Integer.MAX_VALUE)
        } catch (e: NoSuchFieldException) {
            // TODO
        } catch (e: IllegalAccessException) {
            // TODO
        }
    }
}