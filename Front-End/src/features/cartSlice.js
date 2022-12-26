import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const initialState ={ //intial state of cart
    cartItems: localStorage.getItem("cartItems") ? JSON.parse(localStorage.getItem("cartItems"))  //cartitems is the key
    : [], //local storage for saving cart when refreshed.
    cartTotalQuantity: 0,
    cartTotalAmount: 0
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart(state, action){
            const itemIndex = state.cartItems.findIndex( 
                (item) => item._id === action.payload._id
            ); //using find index, an array method, to chevk if the item we are trying to add is already in the cart, compare id's
            if(itemIndex >= 0){ //incase item is already in cart, condition ^
                state.cartItems[itemIndex].cartQuantity += 1;
                toast.info(`Increased ${state.cartItems[itemIndex].name} Quantity`, {
                    position: "bottom-center",
                })
            }
            else {
                const tempProduct = {...action.payload, cartQuantity: 1 };
                state.cartItems.push(tempProduct);
                toast.success(`${action.payload.name} Added to Cart`, {
                    position: "bottom-center",
                });
            }
            localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
        },
        removeFromCart(state, action){
            const nextCartItems = state.cartItems.filter(
                cartItem => cartItem._id !== action.payload._id 
            )

            state.cartItems = nextCartItems
            localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
            toast.error(`${action.payload.name} remove from cart`, {
                position: "bottom-left",
            });
        },
        decreaseCart(state, action){
            const itemIndex = state.cartItems.findIndex(
                cartItem => cartItem._id === action.payload._id
            )
            if(state.cartItems[itemIndex].cartQuantity > 1){
                state.cartItems[itemIndex].cartQuantity -= 1

                toast.info(`Decreased ${action.payload.name} cart quantity`, {
                    position: "bottom-left",
                });
            }
            else if (state.cartItems[itemIndex].cartQuantity === 1){
                const nextCartItems = state.cartItems.filter( //same code as before to rmeove item from cart when quantity =1
                    cartItem => cartItem._id !== action.payload._id 
                )
    
                state.cartItems = nextCartItems
                toast.error(`${action.payload.name} remove from cart`, {
                    position: "bottom-left",
                });
            }
            localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
        },
        clearCart(state, action){
            state.cartItems = [];
            toast.error(`Cart Cleared`,
            {
                position: "bottom-left",
            });
            localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
        },
        getTotals(state, action){
             
            let{total,quantity}= state.cartItems.reduce(
                (cartTotal, cartItem)=>
                {
                    const{price,cartQuantity} = cartItem;
                    const itemTotal = price * cartQuantity;

                    cartTotal.total += itemTotal;
                    cartTotal.quantity += cartQuantity;

                    return cartTotal;

                },{
                    total: 0,
                    quantity: 0
                }
            );

            state.cartTotalQuantity = quantity;
            state.cartTotalAmount = total;
        }
    },
});

export const { clearCart,addToCart, removeFromCart, decreaseCart, getTotals } = cartSlice.actions;
export default cartSlice.reducer;