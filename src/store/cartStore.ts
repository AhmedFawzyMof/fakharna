import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

type DiscountType = "percentage" | "fixed";

interface PromoCode {
  code: string;
  discountType: DiscountType;
  discountValue: number;
}

interface CartState {
  cart: CartItem[];
  promoCode: PromoCode | null;

  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;

  applyPromoCode: (promo: PromoCode) => void;
  removePromoCode: () => void;

  getQuantity: () => number;
  getSubtotal: () => number;
  getDiscountAmount: () => number;
  getTotal: () => number;

  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],
      promoCode: null,

      addToCart: (item) =>
        set((state) => {
          const existing = state.cart.find((i) => i.id === item.id);

          if (existing) {
            return {
              cart: state.cart.map((i) =>
                i.id === item.id
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i,
              ),
            };
          }

          return { cart: [...state.cart, item] };
        }),

      removeFromCart: (id) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== id),
        })),

      updateQuantity: (id, quantity) =>
        set((state) => ({
          cart: state.cart.map((item) =>
            item.id === id ? { ...item, quantity } : item,
          ),
        })),

      clearCart: () =>
        set({
          cart: [],
          promoCode: null,
        }),

      applyPromoCode: (promo) =>
        set({
          promoCode: promo,
        }),

      removePromoCode: () =>
        set({
          promoCode: null,
        }),

      getQuantity: () =>
        get().cart.reduce((sum, item) => sum + item.quantity, 0),

      getSubtotal: () =>
        get().cart.reduce((sum, item) => sum + item.price * item.quantity, 0),

      getDiscountAmount: () => {
        const { promoCode } = get();
        const subtotal = get().getSubtotal();

        if (!promoCode) return 0;

        if (promoCode.discountType === "percentage") {
          return (subtotal * promoCode.discountValue) / 100;
        }

        return Math.min(promoCode.discountValue, subtotal);
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        const discount = get().getDiscountAmount();
        return Math.max(subtotal - discount, 0);
      },
    }),
    {
      name: "cart-storage",
      storage: {
        getItem: (name) => {
          const item = localStorage.getItem(name);
          return item ? JSON.parse(item) : null;
        },
        setItem: (name, value) =>
          localStorage.setItem(name, JSON.stringify(value)),
        removeItem: (name) => localStorage.removeItem(name),
      },
    },
  ),
);
