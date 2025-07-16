"use client"

import { combineReducers } from "@reduxjs/toolkit"
import shopsReducer from "./features/shopsSlice"

const reducers = combineReducers({
    shops: shopsReducer
})

export default reducers