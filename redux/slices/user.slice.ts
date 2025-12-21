import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: null,
  token: null,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUser(state, action) {
      const userObj = action.payload
      const newState = { ...state }
      Object.assign(newState, userObj)
      return newState
    },
    logoutUser(state) {
      const newState = { ...state }
      newState.user = null
      newState.token = null
      return newState
    },
  },
})

export const { updateUser, logoutUser } = userSlice.actions
export default userSlice.reducer
