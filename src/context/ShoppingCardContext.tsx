import { createContext, ReactNode, useContext, useState } from 'react';
import ShoppingCart from '../components/ShoppingCart';
import { useLocalStorage } from '../hooks/useLocalStorage';

type ShoppingCardProviderProps = {
    children: ReactNode
}

type ShoppingCardContextProps = {
    openCart:() => void
    closeCart:() => void
    getItemQuantity: (id: number) => number
    increaseCartQuantity: (id: number) => void
    decreaseCartQuantity: (id: number) => void
    removeFromCart: (id: number) => void
    cartQuantity: number
    cartItems: CartItem[]
}

type CartItem = {
    id: number
    quantity: number
}

const ShoppingCardContext = createContext({} as ShoppingCardContextProps)

export function useShoppingCart() {
    return useContext(ShoppingCardContext)
}

export function ShoppingCartProvider({ children }: ShoppingCardProviderProps) {

    // const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [cartItems, setCartItems] = useLocalStorage<CartItem[]>("shopping-cart", []);
    const [isOpen, setIsOpen] = useState(false);

    const cartQuantity = cartItems.reduce((quantity, item) => item.quantity + quantity, 0);

    function getItemQuantity(id:number){
        return cartItems.find(item => item.id === id)?.quantity || 0
    }

    function increaseCartQuantity(id:number){
        setCartItems(cartItem => {
            if(cartItem.find(item => item.id === id) == null) {
                return [...cartItem, { id, quantity: 1 }]
            } else {
                return cartItem.map(item => {
                    if(item.id === id) {
                        return { ...item, quantity: item.quantity + 1 }
                    } else {
                        return item 
                    }
                })
            }
        })
    }

    function decreaseCartQuantity(id:number){
        setCartItems(cartItem => {
            if(cartItem.find(item => item.id === id)?.quantity === 1) {
                return cartItem.filter(item => item.id !== id)
            } else {
                return cartItem.map(item => {
                    if(item.id === id) {
                        return { ...item, quantity: item.quantity - 1 }
                    } else {
                        return item 
                    }
                })
            }
        })
    }

    function removeFromCart(id:number){
        setCartItems(cartItem => {
            return cartItem.filter(item => item.id !== id)
        })
    }

    const openCart = () => setIsOpen(true);
    const closeCart = () => setIsOpen(false);

    return (
        <ShoppingCardContext.Provider value={{ getItemQuantity, increaseCartQuantity, decreaseCartQuantity, removeFromCart, cartItems, cartQuantity, openCart, closeCart }}>
            {children}
            <ShoppingCart isOpen={isOpen} />
        </ShoppingCardContext.Provider>  
    )
}

