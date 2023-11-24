import {create} from 'zustand';
import {produce} from 'immer';
import {persist, createJSONStorage} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CoffeeData from '../data/CoffeeData';
import BeansData from '../data/BeansData';

export const useStore = create(
  persist(
    (set, _get) => ({
      coffeeList: CoffeeData,
      beanList: BeansData,
      cartPrice: 0,
      cartList: [],
      favoriteList: [],
      orderHistoryList: [],
      addToCart: (cartItem: any) =>
        set(
          // produce(state => {
          //   let found = false;
          //   for (let i = 0; i < state.cartList.length; i++) {
          //     if (state.cartList[i].id == cartItem.id) {
          //       found = true;
          //       let size = false;
          //       for (let j = 0; j < state.cartList[i].prices.length; j++) {
          //         if (
          //           (state.cartList[i].prices[j].size = cartItem.prices[0].size)
          //         ) {
          //           size = true;
          //           state.cartList[i].prices[j].quantity++;
          //           break;
          //         }
          //       }
          //       if (size == false) {
          //         state.cartList[i].prices.push(cartItem.prices[0]);
          //       }
          //       state.cartList[i].prices.sort(
          //         (a: any, b: any) => {
          //           if (a.size > b.size) {
          //             return -1
          //           }
          //           if (a.size < b.size) {
          //             return 1
          //           }
          //           return 0
          //         }
          //       );
          //       break;
          //     }
          //   }
          //   if (found == false) {
          //     state.cartList.push(cartItem);
          //   }
          // }),
          produce(state => {
            const {cartList} = state;
            const existingCartItemIndex = cartList.findIndex(
              (item: any) => item.id === cartItem.id,
            );

            if (existingCartItemIndex !== -1) {
              const existingCartItem = cartList[existingCartItemIndex];
              const existingSizeIndex = existingCartItem.prices.findIndex(
                (price: any) => price.size === cartItem.prices[0].size,
              );

              if (existingSizeIndex !== -1) {
                existingCartItem.prices[existingSizeIndex].quantity++;
              } else {
                existingCartItem.prices.push(cartItem.prices[0]);
                existingCartItem.prices.sort(
                  (a: any, b: any) => a.size - b.size,
                );
              }
            } else {
              state.cartList.push(cartItem);
            }
          }),
        ),
      calculateCartPrice: () =>
        set(
          // produce(state => {
          //   let totalPrice = 0;
          //   for (let i = 0; i < state.cartList.length; i++) {
          //     let tempPrice = 0;
          //     for (let j = 0; j < state.cartList[i].prices.length; j++) {
          //       tempPrice +=
          //         parseFloat(state.cartList[i].prices[j].price) *
          //         state.cartList[i].prices[j].quantity;
          //     }
          //     state.cartList[i].itemPrice = tempPrice.toFixed(2).toString();
          //     totalPrice += tempPrice;
          //   }
          //   state.cartPrice = totalPrice.toFixed(2).toString();
          // }),
          produce(state => {
            let totalPrice = 0;

            state.cartList.forEach((item: any) => {
              let tempPrice = item.prices.reduce((acc: number, price: any) => {
                const priceValue = parseFloat(price.price) * price.quantity;
                return acc + priceValue;
              }, 0);

              item.itemPrice = tempPrice.toFixed(2).toString();
              totalPrice += tempPrice;
            });

            state.cartPrice = totalPrice.toFixed(2).toString();
          }),
        ),
      addToFavoriteList: (type: string, id: string) =>
        set(
          produce(state => {
            // if (type == 'Coffee') {
            //   for (let i = 0; i < state.coffeeList.length; i++) {
            //     if (state.coffeeList[i].id == id) {
            //       if (state.coffeeList[i].favourite == false) {
            //         state.coffeeList[i].favourite = true;
            //         state.favoriteList.unshift(state.coffeeList[i]);
            //       }
            //       break;
            //     }
            //   }
            // } else if (type == 'Bean') {
            //   for (let i = 0; i < state.beanList.length; i++) {
            //     if (state.beanList[i].id == id) {
            //       if (state.beanList[i].favourite == false) {
            //         state.beanList[i].favourite = true;
            //         state.favoriteList.unshift(state.beanList[i]);
            //       }
            //       break;
            //     }
            //   }
            // }
            const list = type === 'Coffee' ? state.coffeeList : state.beanList;
            const targetList =
              type === 'Coffee' ? state.favoriteList : state.beanList;

            const itemIndex = list.findIndex((item: any) => item.id === id);

            if (itemIndex !== -1 && !list[itemIndex].favourite) {
              list[itemIndex].favourite = true;
              targetList.unshift(list[itemIndex]);
            }
          }),
        ),
      deleteFromFavoriteList: (type: string, id: string) =>
        set(
          produce(state => {
            // if (type == 'Coffee') {
            //   for (let i = 0; i < state.coffeeList.length; i++) {
            //     if (state.coffeeList[i].id == id) {
            //       if (state.coffeeList[i].favourite == true) {
            //         state.coffeeList[i].favourite = false;
            //       }
            //       break;
            //     }
            //   }
            // } else if (type == 'Bean') {
            //   for (let i = 0; i < state.beanList.length; i++) {
            //     if (state.beanList[i].id == id) {
            //       if (state.beanList[i].favourite == true) {
            //         state.beanList[i].favourite = false;
            //       }
            //       break;
            //     }
            //   }
            // }
            // let spliceIndex = -1;
            // for (let i = 0; i < state.favoriteList.length; i++) {
            //   if (state.favoriteList[i].id == id) {
            //     spliceIndex = i;
            //     break;
            //   }
            // }
            // state.favoriteList.splice(spliceIndex, 1);
            const toggleFavourite = (list: any, id: string) => {
              const itemIndex = list.findIndex((item: any) => item.id === id);
              if (itemIndex !== -1 && list[itemIndex].favourite) {
                list[itemIndex].favourite = false;
              }
            };

            if (type === 'Coffee') {
              toggleFavourite(state.coffeeList, id);
            } else if (type === 'Bean') {
              toggleFavourite(state.beanList, id);
            }

            const spliceIndex = state.favoriteList.findIndex(
              (item: any) => item.id === id,
            );
            if (spliceIndex !== -1) {
              state.favoriteList.splice(spliceIndex, 1);
            }
          }),
        ),
    }),
    {
      name: 'coffee-app',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
