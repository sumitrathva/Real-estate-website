import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: JSON.parse(localStorage.getItem("user")) || null,
  loading: false,
  signinError: null,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loddingStart: (state) => {
      state.loading = true;
    },
    loddingEnd: (state) => {
      state.loading = false;
    },
    signinSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.signinError = false;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    signinFailed: (state, action) => {
      state.signinError = action.payload;
      state.loading = false;
    },
    userUpdateSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = false;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    userUpdateFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    userDeleteSuccess: (state) => {
      state.loading = false;
      state.currentUser = null;
      state.error = false;
      localStorage.removeItem("user");
    },
    userDeleteFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    signoutSuccess: (state) => {
      state.loading = false;
      state.currentUser = null;
      state.error = false;
      localStorage.removeItem("user");
    },
    signoutFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    handleSave: (state, action) => {
      state.savedListing.push(action.payload);
    },
    handleLisingRemove: (state, action) => {
      state.savedListing = action.payload;
    },
  },
});
export const {
  loddingStart,
  signinSuccess,
  signinFailed,
  userUpdateFailed,
  userUpdateSuccess,
  userDeleteSuccess,
  userDeleteFail,
  signoutSuccess,
  signoutFailed,
  handleSave,
  handleLisingRemove,
} = userSlice.actions;

export default userSlice.reducer;
