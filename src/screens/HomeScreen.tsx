import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useRef, useState} from 'react';
import {useStore} from '../store/store';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import {StatusBar} from 'react-native';
import {
  BORDERRADIUS,
  COLORS,
  FONTFAMILY,
  FONTSIZE,
  SPACING,
} from '../theme/theme';
import {ScrollView} from 'react-native';
import HeaderBar from '../components/HeaderBar';
import CustomIcon from '../components/CustomIcon';
import CoffeeCardItem from '../components/CoffeeCardItem';

const getCategoriesFromData = (data: any) => {
  let temp: any = {};
  data.map((item: any) => {
    if (temp[item.name] == undefined) {
      temp[item.name] = 1;
    } else {
      temp[item.name]++;
    }
  });
  let categories = Object.keys(temp);
  categories.unshift('All');
  return categories;
};

const getCoffeeList = (category: string, data: any) => {
  if (category == 'All') {
    return data;
  } else {
    return data.filter((item: any) => category == item.name);
  }
};

const HomeScreen = ({navigation}: any) => {
  const coffeeList = useStore((state: any) => state.coffeeList);
  const beanList = useStore((state: any) => state.beanList);
  const [categories, setCategories] = useState(
    getCategoriesFromData(coffeeList),
  );
  const [searchText, setSearchText] = useState('');
  const [categoryIndex, setCategoryIndex] = useState({
    index: 0,
    category: categories[0],
  });
  const [sortedCoffee, setSortedCoffee] = useState(
    getCoffeeList(categoryIndex.category, coffeeList),
  );

  const listRef: any = useRef<FlatList>();
  const tabBarHeight = useBottomTabBarHeight();

  const searchCoffee = (search: string) => {
    if (search != '') {
      listRef?.current?.scrollToOffset({
        animated: true,
        offset: 0,
      });
      setCategoryIndex({index: 0, category: categories[0]});
      setSortedCoffee([
        ...coffeeList.filter((item: any) =>
          item.name.toLowerCase().includes(search.toLowerCase()),
        ),
      ]);
    }
  };

  const resetSearchCoffee = () => {
    listRef?.current?.scrollToOffset({
      animated: true,
      offset: 0,
    });
    setCategoryIndex({index: 0, category: categories[0]});
    setSortedCoffee([...coffeeList]);
    setSearchText('');
  };

  return (
    <View style={styles.screenContainer}>
      <StatusBar backgroundColor={COLORS.primaryBlackHex} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewFlex}>
        {/* App Header */}
        <HeaderBar />

        <Text style={styles.screenTitle}>
          Find the best{'\n'}coffee for you
        </Text>

        {/* Search input */}
        <View style={styles.searchContainer}>
          <TouchableOpacity
            onPress={() => {
              searchCoffee(searchText);
            }}>
            <CustomIcon
              style={styles.searchIcon}
              name="search"
              size={FONTSIZE.size_18}
              color={
                searchText.length > 0
                  ? COLORS.primaryOrangeHex
                  : COLORS.primaryLightGreyHex
              }
            />
          </TouchableOpacity>
          <TextInput
            placeholder="Find coffee/bean..."
            placeholderTextColor={COLORS.primaryLightGreyHex}
            value={searchText}
            onChangeText={text => {
              setSearchText(text);
              searchCoffee(text);
            }}
            style={styles.searchInput}
          />
          {searchText.length > 0 ? (
            <TouchableOpacity
              onPress={() => {
                resetSearchCoffee();
              }}>
              <CustomIcon
                style={styles.searchIcon}
                name="close"
                size={FONTSIZE.size_16}
                color={COLORS.primaryLightGreyHex}
              />
            </TouchableOpacity>
          ) : (
            <></>
          )}
        </View>

        {/* Category list */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryContainer}>
          {categories.map((category, index) => (
            <View style={styles.categoryList} key={index.toString()}>
              <TouchableOpacity
                style={styles.categoryItem}
                onPress={() => {
                  listRef?.current?.scrollToOffset({
                    animated: true,
                    offset: 0,
                  });
                  setCategoryIndex({index: index, category: categories[index]});
                  setSortedCoffee([
                    ...getCoffeeList(categories[index], coffeeList),
                  ]);
                }}>
                <Text
                  style={[
                    styles.categoryText,
                    categoryIndex.index == index
                      ? {
                          color: COLORS.primaryOrangeHex,
                        }
                      : {},
                  ]}>
                  {category}
                </Text>
                {categoryIndex.index == index ? (
                  <View style={styles.categoryActive} />
                ) : (
                  <></>
                )}
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

        {/* Coffee list */}
        <FlatList
          ref={listRef}
          horizontal
          ListEmptyComponent={
            <View style={styles.emptyListContainer}>
              <Text style={styles.categoryText}>No Coffee Available</Text>
            </View>
          }
          showsHorizontalScrollIndicator={false}
          data={sortedCoffee}
          contentContainerStyle={styles.coffeeListContainer}
          keyExtractor={item => item.id}
          renderItem={({item}) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  navigation.push('Details', {
                    id: item.id,
                    index: item.index,
                    type: item.type,
                  });
                }}>
                <CoffeeCardItem
                  id={item.id}
                  index={item.index}
                  type={item.type}
                  name={item.name}
                  roasted={item.roasted}
                  imagelink_square={item.imagelink_square}
                  special_ingredient={item.special_ingredient}
                  average_rating={item.average_rating}
                  prices={item.prices[2]}
                  buttonHandler={() => {}}
                />
              </TouchableOpacity>
            );
          }}
        />

        <Text style={styles.coffeeBeanTitle}>Coffee Beans</Text>

        {/* Bean list */}
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={beanList}
          contentContainerStyle={[
            styles.coffeeListContainer,
            {marginBottom: tabBarHeight},
          ]}
          keyExtractor={item => item.id}
          renderItem={({item}) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  navigation.push('Details', {
                    id: item.id,
                    index: item.index,
                    type: item.type,
                  });
                }}>
                <CoffeeCardItem
                  id={item.id}
                  index={item.index}
                  type={item.type}
                  name={item.name}
                  roasted={item.roasted}
                  imagelink_square={item.imagelink_square}
                  special_ingredient={item.special_ingredient}
                  average_rating={item.average_rating}
                  prices={item.prices[2]}
                  buttonHandler={() => {}}
                />
              </TouchableOpacity>
            );
          }}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: COLORS.primaryBlackHex,
  },
  scrollViewFlex: {
    flexGrow: 1,
  },
  screenTitle: {
    fontSize: FONTSIZE.size_28,
    fontFamily: FONTFAMILY.poppins_semibold,
    color: COLORS.primaryWhiteHex,
    paddingLeft: SPACING.space_30,
  },
  searchContainer: {
    margin: SPACING.space_30,
    borderRadius: BORDERRADIUS.radius_20,
    backgroundColor: COLORS.primaryDarkGreyHex,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchIcon: {
    marginHorizontal: SPACING.space_20,
  },
  searchInput: {
    flex: 1,
    height: SPACING.space_20 * 3,
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_14,
    color: COLORS.primaryWhiteHex,
  },
  categoryContainer: {
    paddingHorizontal: SPACING.space_20,
    marginBottom: SPACING.space_20,
  },
  categoryList: {
    paddingHorizontal: SPACING.space_15,
  },
  categoryItem: {
    alignItems: 'center',
  },
  categoryText: {
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_16,
    color: COLORS.primaryLightGreyHex,
    marginBottom: SPACING.space_4,
  },
  categoryActive: {
    height: SPACING.space_10,
    width: SPACING.space_10,
    borderRadius: BORDERRADIUS.radius_10,
    backgroundColor: COLORS.primaryOrangeHex,
  },
  coffeeListContainer: {
    gap: SPACING.space_20,
    paddingVertical: SPACING.space_20,
    paddingHorizontal: SPACING.space_30,
  },
  emptyListContainer: {
    width: Dimensions.get('window').width - SPACING.space_30 * 2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.space_36 * 3.6,
  },
  coffeeBeanTitle: {
    fontSize: FONTSIZE.size_18,
    marginLeft: SPACING.space_30,
    marginTop: SPACING.space_20,
    fontFamily: FONTFAMILY.poppins_medium,
    color: COLORS.secondaryLightGreyHex,
  },
});

export default HomeScreen;
