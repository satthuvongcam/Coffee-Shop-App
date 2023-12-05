import {
  StyleSheet,
  Text,
  View,
  ImageProps,
  Image,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {
  BORDERRADIUS,
  COLORS,
  FONTFAMILY,
  FONTSIZE,
  SPACING,
} from '../theme/theme';
import CustomIcon from './CustomIcon';

interface CartItemProps {
  id: string;
  name: string;
  imagelink_square: ImageProps;
  special_ingredient: string;
  roasted: string;
  prices: any;
  type: string;
  incrementCartItemQuantityHandler: any;
  decrementCartItemQuantityHandler: any;
}

const CartItem: React.FC<CartItemProps> = ({
  id,
  name,
  imagelink_square,
  special_ingredient,
  roasted,
  prices,
  type,
  incrementCartItemQuantityHandler,
  decrementCartItemQuantityHandler,
}) => {
  return (
    <View>
      {prices.length !== 1 ? (
        <LinearGradient
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          colors={[COLORS.primaryGreyHex, COLORS.primaryBlackHex]}
          style={styles.cartItemContainer}>
          <View style={styles.cartItemRow}>
            <Image source={imagelink_square} style={styles.cartImage} />
            <View style={styles.cartInfo}>
              <View>
                <Text style={styles.cartName}>{name}</Text>
                <Text style={styles.cartIngredient}>{special_ingredient}</Text>
              </View>
              <View style={styles.cartRoastedContainer}>
                <Text style={styles.cartRoastedText}>{roasted}</Text>
              </View>
            </View>
          </View>
          {prices.map((data: any, index: any) => (
            <View key={index.toString()} style={styles.cartSizeContainer}>
              <View style={styles.cartSizeItem}>
                <View style={styles.cartSizeBox}>
                  <Text
                    style={[
                      styles.cartSizeText,
                      {
                        fontSize:
                          type === 'Bean' ? FONTSIZE.size_12 : FONTSIZE.size_16,
                      },
                    ]}>
                    {data.size}
                  </Text>
                </View>
                <Text style={styles.cartSizeCurrency}>
                  {data.currency}
                  <Text style={styles.cartSizePrice}>{data.price}</Text>
                </Text>
              </View>
              <View key={index.toString()} style={styles.cartSizeContainer}>
                <TouchableOpacity
                  style={styles.cartSizeIcon}
                  onPress={() => {
                    decrementCartItemQuantityHandler(id, data.size);
                  }}>
                  <CustomIcon
                    name="minus"
                    color={COLORS.primaryWhiteHex}
                    size={FONTSIZE.size_10}
                  />
                </TouchableOpacity>
                <View style={styles.cartItemQuantityContainer}>
                  <Text style={styles.cartItemQuantityText}>
                    {data.quantity}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.cartSizeIcon}
                  onPress={() => {
                    incrementCartItemQuantityHandler(id, data.size);
                  }}>
                  <CustomIcon
                    name="add"
                    color={COLORS.primaryWhiteHex}
                    size={FONTSIZE.size_10}
                  />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </LinearGradient>
      ) : (
        <LinearGradient
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          colors={[COLORS.primaryGreyHex, COLORS.primaryBlackHex]}
          style={styles.cartItemSingleContainer}>
          <View>
            <Image
              source={imagelink_square}
              style={styles.cartItemSingleImage}
            />
          </View>
          <View style={styles.cartItemSingleInfo}>
            <View>
              <Text style={styles.cartName}>{name}</Text>
              <Text style={styles.cartIngredient}>{special_ingredient}</Text>
            </View>
            <View style={styles.cartItemSingleSize}>
              <View style={styles.cartSizeBox}>
                <Text
                  style={[
                    styles.cartSizeText,
                    {
                      fontSize:
                        type === 'Bean' ? FONTSIZE.size_12 : FONTSIZE.size_16,
                    },
                  ]}>
                  {prices[0].size}
                </Text>
              </View>
              <Text style={styles.cartSizeCurrency}>
                {prices[0].currency}
                <Text style={styles.cartSizePrice}>{prices[0].price}</Text>
              </Text>
            </View>
            <View style={styles.cartItemSingleSizeContainer}>
              <TouchableOpacity
                style={styles.cartSizeIcon}
                onPress={() => {
                  decrementCartItemQuantityHandler(id, prices[0].size);
                }}>
                <CustomIcon
                  name="minus"
                  color={COLORS.primaryWhiteHex}
                  size={FONTSIZE.size_10}
                />
              </TouchableOpacity>
              <View style={styles.cartItemQuantityContainer}>
                <Text style={styles.cartItemQuantityText}>
                  {prices[0].quantity}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.cartSizeIcon}
                onPress={() => {
                  incrementCartItemQuantityHandler(id, prices[0].size);
                }}>
                <CustomIcon
                  name="add"
                  color={COLORS.primaryWhiteHex}
                  size={FONTSIZE.size_10}
                />
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  cartItemContainer: {
    flex: 1,
    gap: SPACING.space_12,
    padding: SPACING.space_10,
    borderRadius: BORDERRADIUS.radius_25,
  },
  cartItemRow: {
    flex: 1,
    flexDirection: 'row',
    gap: SPACING.space_12,
  },
  cartImage: {
    height: 130,
    width: 130,
    borderRadius: BORDERRADIUS.radius_25,
  },
  cartInfo: {
    flex: 1,
    paddingVertical: SPACING.space_4,
    justifyContent: 'space-between',
  },
  cartName: {
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_18,
    color: COLORS.primaryWhiteHex,
  },
  cartIngredient: {
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_12,
    color: COLORS.secondaryLightGreyHex,
  },
  cartRoastedContainer: {
    height: 50,
    width: 50 * 2 + SPACING.space_20,
    borderRadius: BORDERRADIUS.radius_15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primaryDarkGreyHex,
  },
  cartRoastedText: {
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_10,
    color: COLORS.primaryWhiteHex,
  },
  cartSizeContainer: {
    flex: 1,
    gap: SPACING.space_20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartSizeItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cartSizeBox: {
    backgroundColor: COLORS.primaryBlackHex,
    height: 40,
    width: 100,
    borderRadius: BORDERRADIUS.radius_10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartSizeText: {
    fontFamily: FONTFAMILY.poppins_medium,
    color: COLORS.secondaryLightGreyHex,
  },
  cartSizeCurrency: {
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_18,
    color: COLORS.primaryOrangeHex,
  },
  cartSizePrice: {
    color: COLORS.primaryWhiteHex,
  },
  cartSizeIcon: {
    backgroundColor: COLORS.primaryOrangeHex,
    padding: SPACING.space_12,
    borderRadius: BORDERRADIUS.radius_10,
  },
  cartItemQuantityContainer: {
    backgroundColor: COLORS.primaryBlackHex,
    width: 80,
    borderRadius: BORDERRADIUS.radius_10,
    borderWidth: 2,
    borderColor: COLORS.primaryOrangeHex,
    alignItems: 'center',
    paddingVertical: SPACING.space_4,
  },
  cartItemQuantityText: {
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_16,
    color: COLORS.primaryWhiteHex,
  },
  cartItemSingleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.space_10,
    gap: SPACING.space_12,
    borderRadius: BORDERRADIUS.radius_25,
  },
  cartItemSingleImage: {
    height: 130,
    width: 130,
    borderRadius: BORDERRADIUS.radius_25,
  },
  cartItemSingleInfo: {
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'space-around',
  },
  cartItemSingleSize: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  cartItemSingleSizeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginTop: SPACING.space_10
  }
});

export default CartItem;
