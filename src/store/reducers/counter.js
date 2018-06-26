import wepy from 'wepy'
import _ from 'underscore'
import { handleActions } from 'redux-actions'
import { ADD_PRODUCT, DECREASE_PRODUCT, UPDATE_PRODUCT_COUNT, UPDATE_PRODUCT_INFO, CART_PRODUCT_COUNT, CHECK_PRODUCT } from '../types/counter'

const cartList = wx.getStorageSync('cartList') || []

export default handleActions({
  [ADD_PRODUCT] (state, action) {
    const payload = action.payload;
    const cartList = state.cartList;
    let is_added = false;
    if (cartList && cartList.constructor === Array) {
      for (let p of cartList) {
        if (p._id === payload._id) {
          is_added = true;
          p.count++;
          break;
        }
      }
    }
    if (!is_added) {
      state.cartList.push(action.payload);
    }
    return {...state}
  },
  [DECREASE_PRODUCT] (state, action) {
    const product_id = action.payload;
    const cartList = state.cartList;
    if (cartList && cartList.constructor === Array) {
      for (let p of cartList) {
        if (p._id === product_id && p.count > 1) {
          p.count--;
        }
      }
    }
    return {...state}
  },
  [UPDATE_PRODUCT_INFO] (state, action) {
    state.cartList = action.payload
    return {...state}
  },
  [CHECK_PRODUCT] (state, action) {
    const product_id = action.payload;
    const cartList = state.cartList;
    if (cartList && cartList.constructor === Array) {
      for (let p of cartList) {
        if (p._id === product_id) {
          p.checked = !p.checked
        }
      }
    }
    return {...state}
  },
  [UPDATE_PRODUCT_COUNT] (state, action) {

  },
  [CART_PRODUCT_COUNT] (state, action) {
    const cartList = state.cartList;
    let cartProductCount = 0;
    if (cartList && cartList.constructor === Array) {
      cartList.forEach(p => {
        cartProductCount += p.count;
      });
    }
    return {
      ...state,
      cartProductCount: cartProductCount
    }
  }
}, {
  cartList: cartList,
  cartProductCount: 0
})