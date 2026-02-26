import { getFeedsApi } from "@api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { TOrdersData } from "@utils-types";

export interface TFeed extends TOrdersData {
  isLoading: boolean;
  error: string | null;
}

export const initialState: TFeed = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: false,
  error: null
}

export const getFeeds = createAsyncThunk(
  'feed/getFeed',
  async () => {
    const response = await getFeedsApi();
    return response;
  }
)

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
    .addCase(getFeeds.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(getFeeds.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null;
      state.orders = action.payload.orders;
      state.total = action.payload.total;
      state.totalToday = action.payload.totalToday
    })
    .addCase(getFeeds.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string
    })
  }
})

export default feedSlice.reducer;