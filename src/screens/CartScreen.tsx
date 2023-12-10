import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {useStore} from '../store/store';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import {COLORS, SPACING} from '../theme/theme';
import HeaderBar from '../components/HeaderBar';
import EmptyListAnimation from '../components/EmptyListAnimation';
import PaymentFooter from '../components/PaymentFooter';
import CartItem from '../components/CartItem';

const CartScreen = ({navigation, route}: any) => {
  const cartList = useStore((state: any) => state.cartList);
  const cartPrice = useStore((state: any) => state.cartPrice);
  const incrementCartItemQuantity = useStore(
    (state: any) => state.incrementCartItemQuantity,
  );
  const decrementCartItemQuantity = useStore(
    (state: any) => state.decrementCartItemQuantity,
  );
  const calculateCartPrice = useStore((state: any) => state.calculateCartPrice);
  const tabBarHeight = useBottomTabBarHeight();

  const buttonPressHandler = () => {
    navigation.push('Payment', {
      amount: cartPrice,
    });
  };

  const incrementCartItemQuantityHandler = (id: string, size: string) => {
    incrementCartItemQuantity(id, size);
    calculateCartPrice();
  };

  const decrementCartItemQuantityHandler = (id: string, size: string) => {
    decrementCartItemQuantity(id, size);
    calculateCartPrice();
  };

  return (
    <View style={styles.screenContainer}>
      <StatusBar backgroundColor={COLORS.primaryBlackHex} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}>
        <View style={[styles.bodyContainer, {marginBottom: tabBarHeight}]}>
          <View style={styles.bodyContentContainer}>
            <HeaderBar title="Cart" />
            {cartList.length == 0 ? (
              <EmptyListAnimation title={'Cart is empty'} />
            ) : (
              <View style={styles.listItemContainer}>
                {cartList.map((data: any) => {
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        navigation.push('Details', {
                          index: data.index,
                          id: data.id,
                          type: data.type,
                        });
                      }}
                      key={data.id}>
                      <CartItem
                        id={data.id}
                        name={data.name}
                        imagelink_square={data.imagelink_square}
                        special_ingredient={data.special_ingredient}
                        roasted={data.roasted}
                        prices={data.prices}
                        type={data.type}
                        incrementCartItemQuantityHandler={
                          incrementCartItemQuantityHandler
                        }
                        decrementCartItemQuantityHandler={
                          decrementCartItemQuantityHandler
                        }
                      />
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>
          {cartList.length !== 0 ? (
            <PaymentFooter
              buttonTitle="Pay"
              price={{price: cartPrice, currency: '$'}}
              buttonPressHandler={buttonPressHandler}
            />
          ) : (
            <></>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: COLORS.primaryBlackHex,
  },
  contentContainer: {
    flexGrow: 1,
  },
  bodyContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  bodyContentContainer: {
    flex: 1,
  },
  listItemContainer: {
    paddingHorizontal: SPACING.space_20,
    gap: SPACING.space_20,
  },
});

export default CartScreen;
