import { handleActions } from 'redux-actions'
import { ADD_PRODUCT, DECREASE_PRODUCT, UPDATE_PRODUCT_INFO, CART_PRODUCT_COUNT, CHECK_PRODUCT, CHECK_ALL_PRODUCT, UPDATE_PRODUCT_COUNT, DELETE_PRODUCT } from '../types/counter'
import _ from 'underscore'

const cartList = wx.getStorageSync('cartList') || []

export default handleActions({
  [UPDATE_PRODUCT_COUNT] (state, action) {
    const operation = action.payload.operation;
    const product = action.payload.product;
    const cartList = state.cartList;
    if (cartList && cartList.constructor === Array) {
      if (product.count > 0) {
        let is_added = false;
        for (let p of cartList) {
          if (p._id === product._id) {
            p.count = product.count;
            is_added = true;
          }
        }

        if (!is_added) {
          cartList.push(product)
        }
      }
    }
    return {...state}
  },
  [ADD_PRODUCT] (state, action) {
    const payload = action.payload;
    const cartList = state.cartList;
    let is_added = false;
    if (cartList && cartList.constructor === Array) {
      for (let p of cartList) {
        if (p._id === payload._id) {
          p.checked = true;
          is_added = true;
          p.count++;
          break;
        }
      }
    }
    if (!is_added) {
      state.cartList.push({...action.payload, checked: true});
    }
    return {...state}
  },
  [DELETE_PRODUCT] (state, action) {
    const product_id = action.payload;
    const cartList = _.filter(state.cartList, function(p){
      return p._id != product_id;
    })
    return {...state, cartList}
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
          p.checked = !p.checked;
        }
      }
    }
    return {...state}
  },
  [CHECK_ALL_PRODUCT] (state, action) {
    const cartList = state.cartList;
    const checked = action.payload;
    if (cartList && cartList.constructor === Array) {
      for (let p of cartList) {
        p.checked = checked;
      }
    }
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
  cartList: cartList,
  cartProductCount: 0
})