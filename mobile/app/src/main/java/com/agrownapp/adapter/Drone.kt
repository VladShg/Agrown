package com.agrownapp.adapter

class Drone(name: String, id: Int, model: Model, code: Int) {

    var id: Int = 0
        internal set
    var name: String
        internal set
    var model: Model
        internal set
    var code: Int
        internal set

    init {
        this.id = id
        this.name = name
        this.model = model
        this.code = code
    }
}