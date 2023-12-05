import {create} from 'zustand';
import {produce} from 'immer';
import {persist, createJSONStorage} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CoffeeData from '../data/CoffeeData';
import BeansData from '../data/BeansData';

export const useStore = create(
  persist(
    (set, get) => ({
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
            let found = false;
            for (let i = 0; i < state.cartList.length; i++) {
              if (state.cartList[i].id == cartItem.id) {
                found = true;
                let size = false;
                for (let j = 0; j < state.cartList[i].prices.length; j++) {
                  if (
                    state.cartList[i].prices[j].size == cartItem.prices[0].size
                  ) {
                    size = true;
                    state.cartList[i].prices[j].quantity++;
                    break;
                  }
                }
                if (size == false) {
                  state.cartList[i].prices.push(cartItem.prices[0]);
                }
                state.cartList[i].prices.sort((a: any, b: any) => {
                  if (a.size > b.size) {
                    return -1;
                  }
                  if (a.size < b.size) {
                    return 1;
                  }
                  return 0;
                });
                break;
              }
            }
            if (found == false) {
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
            const targetList = state.favoriteList;

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
      incrementCartItemQuantity: (id: string, size: string) =>
        set(
          produce(state => {
            // for (let i = 0; i < state.cartList.length; i++) {
            //   if (state.cartList[i].id == id) {
            //     for (let j = 0; j < state.cartList[i].prices.length; j++) {
            //       if (state.cartList[i].prices[j].size == size) {
            //         state.cartList[i].prices[j].quantity++;
            //         break;
            //       }
            //     }
            //   }
            // }
            const product = state.cartList.find((item: any) => item.id === id);

            if (product) {
              const price = product.prices.find((p: any) => p.size === size);

              if (price) {
                price.quantity++;
              }
            }
          }),
        ),
      decrementCartItemQuantity: (id: string, size: string) =>
        set(
          produce(state => {
            // for (let i = 0; i < state.cartList.length; i++) {
            //   if (state.cartList[i].id == id) {
            //     for (let j = 0; j < state.cartList[i].prices.length; j++) {
            //       if (state.cartList[i].prices[j].size == size) {
            //         if (state.cartList[i].prices.length > 1) {
            //           if (state.cartList[i].prices[j].quantity > 1) {
            //             price.quantity--;
            //           } else {
            //             state.cartList[i].prices.splice(j, 1);
            //           }
            //         } else {
            //           if (state.cartList[i].prices[j].quantity > 1) {
            //             price.quantity--;
            //           } else {
            //             state.cartList.splice(i, 1);
            //           }
            //         }
            //         break;
            //       }
            //     }
            //   }
            // }
            const itemIndex = state.cartList.findIndex(
              (item: any) => item.id === id,
            );

            if (itemIndex !== -1) {
              const prices = state.cartList[itemIndex].prices;
              const priceIndex = prices.findIndex(
                (price: any) => price.size === size,
              );

              if (priceIndex !== -1) {
                const quantity = prices[priceIndex].quantity;

                if (prices.length > 1 && quantity > 1) {
                  prices[priceIndex].quantity--;
                } else {
                  prices.splice(priceIndex, 1);

                  if (prices.length === 0) {
                    state.cartList.splice(itemIndex, 1);
                  }
                }
              }
            }
          }),
        ),
      addToOrderHistoryListFromCart: () =>
        set(
          produce(state => {
            // let temp = state.cartList.reduce(
            //   (accumulator: number, currentValue: any) =>
            //     accumulator + parseFloat(currentValue.itemPrice),
            //   0,
            // );
            // if (state.orderHistoryList.length > 0) {
            //   state.orderHistoryList.unshift({
            //     orderDate:
            //       new Date().toDateString() +
            //       ' ' +
            //       new Date().toLocaleTimeString(),
            //     cartList: state.cartList,
            //     cartListPrice: temp.toFixed(2).toString(),
            //   });
            // } else {
            //   state.orderHistoryList.push({
            //     orderDate:
            //       new Date().toDateString() +
            //       ' ' +
            //       new Date().toLocaleTimeString(),
            //     cartList: state.cartList,
            //     cartListPrice: temp.toFixed(2).toString(),
            //   });
            //   state.cartList = []
            // }
            if (state.cartList.length > 0) {
              const temp = state.cartList.reduce(
                (accumulator: number, currentValue: any) =>
                  accumulator + parseFloat(currentValue.itemPrice),
                0,
              );

              const orderDate =
                new Date().toDateString() +
                ' ' +
                new Date().toLocaleTimeString();

              const orderEntry = {
                orderDate,
                cartList: state.cartList,
                cartListPrice: temp.toFixed(2).toString(),
              };

              if (state.orderHistoryList.length > 0) {
                state.orderHistoryList.unshift(orderEntry);
              } else {
                state.orderHistoryList.push(orderEntry);
              }

              state.cartList = [];
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
