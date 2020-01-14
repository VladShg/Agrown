package com.agrownapp.adapter

class Model(name: String, id: Int) {

    var id: Int = 0
        internal set
    var name: String
        internal set

    init {
        this.id = id
        this.name = name
    }
}