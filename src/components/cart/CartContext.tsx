"use client";

import { createContext, useContext, useMemo, useReducer } from "react";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  isOpen: boolean;
};

type CartAction =
  | { type: "ADD"; payload: Omit<CartItem, "quantity">; quantity?: number }
  | { type: "REMOVE"; payload: { id: string } }
  | { type: "DECREMENT"; payload: { id: string } }
  | { type: "CLEAR" }
  | { type: "TOGGLE"; payload?: boolean };

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
  totalQuantity: number;
  totalPrice: number;
} | null>(null);

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD": {
      const qty = action.quantity ?? 1;
      const existing = state.items.find((i) => i.id === action.payload.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.id === existing.id ? { ...i, quantity: i.quantity + qty } : i
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: qty }],
      };
    }
    case "DECREMENT": {
      const next = state.items
        .map((i) =>
          i.id === action.payload.id ? { ...i, quantity: i.quantity - 1 } : i
        )
        .filter((i) => i.quantity > 0);
      return { ...state, items: next };
    }
    case "REMOVE": {
      return {
        ...state,
        items: state.items.filter((i) => i.id !== action.payload.id),
      };
    }
    case "CLEAR": {
      return { ...state, items: [] };
    }
    case "TOGGLE": {
      const forced = action.payload;
      return { ...state, isOpen: forced ?? !state.isOpen };
    }
    default:
      return state;
  }
}

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    isOpen: false,
  });

  const { totalPrice, totalQuantity } = useMemo(() => {
    const totalPrice = state.items.reduce(
      (sum, i) => sum + i.price * i.quantity,
      0
    );
    const totalQuantity = state.items.reduce((sum, i) => sum + i.quantity, 0);
    return { totalPrice, totalQuantity };
  }, [state.items]);

  const value = useMemo(
    () => ({ state, dispatch, totalPrice, totalQuantity }),
    [state, totalPrice, totalQuantity]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
