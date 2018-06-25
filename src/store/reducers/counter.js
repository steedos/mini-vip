import { handleActions } from 'redux-actions'
import { INCREMENT, DECREMENT, ASYNC_INCREMENT, CART_PRODUCT_COUNT, ADD_PRODUCT } from '../types/counter'

const cartList = wx.getStorageSync('cartList') || []

export default handleActions({
  [INCREMENT] (state) {
    return {
      ...state,
      num: state.num + 1
    }
  },
  [DECREMENT] (state) {
    return {
      ...state,
      num: state.num - 1
    }
  },
  [ASYNC_INCREMENT] (state, action) {
    return {
      ...state,
      asyncNum: state.asyncNum + action.payload
    }
  },
  [ADD_PRODUCT] (state, action) {
    console.log('ADD_PRODUCT......', action);
    state.cartList.push(action.payload);
    return {...state}
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
  num: 0,
  asyncNum: 0,
  cartList: cartList,
  cartProductCount: 0
})