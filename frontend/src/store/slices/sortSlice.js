import { createSlice } from '@reduxjs/toolkit'

export const sortSlice = createSlice({
    name: 'counter',
    initialState: {
        popupValue: 'популярности',
    },
    reducers: {
        setPopupValue(state, action) {
            state.popupValue = action._payload.popupValue;
        }
    },
})

export const { setPopupValue } = sortSlice.actions

export default sortSlice.reducer