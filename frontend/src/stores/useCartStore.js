import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";
import { useUserStore } from "./useUserStore.js";

export const useCartStore = create((set, get) => ({
	cart: [],
	coupon: null,
	total: 0,
	subtotal: 0,
	isCouponApplied: false,
	
	getMyCoupon: async () => {
		try {
			const response = await axios.get("/coupons");
			set({ coupon: response.data });
		} catch (error) {
			console.error("Error fetching coupon:", error);
		}
	},
	applyCoupon: async (code) => {
		try {
			const response = await axios.post("/coupons/validate", { code });
			set({ coupon: response.data, isCouponApplied: true });
			get().calculateTotals();
			toast.success("Coupon applied successfully");
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to apply coupon");
		}
	},
	removeCoupon: () => {
		set({ coupon: null, isCouponApplied: false });
		get().calculateTotals();
		toast.success("Coupon removed");
	},

	getCartItems: async () => {
		try {
			const res = await axios.get("/cart");
			set({ cart: res.data });
			get().calculateTotals();
		} catch (error) {
			set({ cart: [] });
			toast.error(error.response.data.message || "An error occurred");
		}
	},
	clearCart: async () => {
		set({ cart: [], coupon: null, total: 0, subtotal: 0 });
	},
	addToCart: async (product) => {
		try {
      const cartExistingItem = get().cart.find(
        (item) => item._id === product._id
      );
      if (cartExistingItem) {
        toast.error("Item is already in cart");
        return;
      }
      const user = useUserStore.getState().user;
      const libraryExistingItem = user.libraryItems.find(
        (item) => item === product._id
      );
      if (libraryExistingItem) {
        toast.error("Item is already in library");
        return;
      }

      await axios.post("/cart", { gameId: product._id });
      toast.success("Product added to cart");
      set((prevState) => {
        const newCart = [...prevState.cart, { ...product, quantity: 1 }];
        return { cart: newCart };
      });
      // set((prevState) => {
      // 	const existingItem = prevState.cart.find((item) => item._id === product._id);
      // 	const newCart = existingItem
      // 		? prevState.cart.map((item) =>
      // 				item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
      // 		  )
      // 		: [...prevState.cart, { ...product, quantity: 1 }];
      // 	return { cart: newCart };
      // });
      get().calculateTotals();
    } catch (error) {
      toast.error(error.response.data.message || "An error occurred");
    }
	},
	removeFromCart: async (gameId) => {
		await axios.delete(`/cart`, { data: {gameId} });
		set((prevState) => ({ cart: prevState.cart.filter((item) => item._id !== gameId) }));
		get().calculateTotals();
	},
	calculateTotals: () => {
		const { cart, coupon } = get();
		const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
		let total = subtotal;
		if (coupon) {
			const discount = subtotal * (coupon.discountPercentage / 100);
			total = subtotal - discount;
		}

		set({ subtotal, total });
	},
	
}));
