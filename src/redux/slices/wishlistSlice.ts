import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface WishlistProduct {
  id: string;
  name: string;
  image: string;
  price: string;
  special: string | null;
  options: boolean;
  date_added: string;
}

interface WishlistState {
  total: number;
  items: WishlistProduct[];
  isLoading: boolean;
}

const initialState: WishlistState = {
  total: 0,
  items: [],
  isLoading: false,
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    setWishlistTotal: (state, action: PayloadAction<number>) => {
      state.total = action.payload;
    },
    setWishlistProducts: (state, action: PayloadAction<WishlistProduct[]>) => {
      state.items = action.payload;
    },
    setWishlistLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    clearWishlist: (state) => {
      state.items = [];
      state.total = 0;
    },
  },
});

export const { 
  setWishlistTotal,
  setWishlistProducts,
  setWishlistLoading,
  clearWishlist
} = wishlistSlice.actions;

export const selectWishlistTotal = (state: RootState) => state.wishlist.total;

export const selectIsInWishlist = (state: RootState, productId: string) => 
  state.wishlist.items.some(item => item.id === productId);

export default wishlistSlice.reducer;
