import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Base URL for the API
const API_URL = "http://localhost:5000/api/cart";

// Helper function to get the auth token
const getAuthToken = () => localStorage.getItem("token");

// Thunks for async actions
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (product, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const response = await axios.post(`${API_URL}/add`, product, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (productId, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      await axios.delete(`${API_URL}/remove/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return productId;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateCartItem = createAsyncThunk(
  "cart/updateCartItem",
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const response = await axios.patch(
        `${API_URL}/update/${productId}`,
        { quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (_, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      await axios.delete(`${API_URL}/clear`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return {};
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const increaseQuantity = createAsyncThunk(
  "cart/increaseQuantity",
  async (itemId, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const response = await axios.patch(
        `${API_URL}/items/increase/${itemId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const decreaseQuantity = createAsyncThunk(
  "cart/decreaseQuantity",
  async (itemId, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const response = await axios.patch(
        `${API_URL}/items/decrease/${itemId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    cartCount: 0,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.cart.items;
        state.cartCount = action.payload.cart.items.reduce(
          (total, item) => total + item.quantity,
          0
        );
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.cart.items;
        state.cartCount = action.payload.cart.items.reduce(
          (total, item) => total + item.quantity,
          0
        );
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(
          (item) => item.product._id !== action.payload
        );
        state.cartCount = state.items.reduce(
          (total, item) => total + item.quantity,
          0
        );
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(increaseQuantity.pending, (state, action) => {
        state.cartCount += 1;
      })
      .addCase(increaseQuantity.rejected, (state, action) => {
        state.cartCount -= 1;
      })
      .addCase(decreaseQuantity.pending, (state, action) => {
        state.cartCount -= 1;
      })
      .addCase(decreaseQuantity.rejected, (state, action) => {
        state.cartCount += 1;
      })
      .addCase(clearCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = [];
        state.cartCount = 0;
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const cartReducer = cartSlice.reducer;
export const cartSelector = (state) => state.cartReducer;
