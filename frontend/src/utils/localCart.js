const CART_KEY = 'cart';

export function getLocalCart() {
  const cart = localStorage.getItem(CART_KEY);
  return cart ? JSON.parse(cart) : [];
}

export function saveLocalCart(cartItems) {
  localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
}

export function addToLocalCart(newItem) {
  const cart = getLocalCart();
  const index = cart.findIndex(item => item.id === newItem.id);
  if (index > -1) {
    cart[index].quantity += newItem.quantity;
  } else {
    cart.push(newItem);
  }
  saveLocalCart(cart);
}

export function clearLocalCart() {
  localStorage.removeItem(CART_KEY);
}
