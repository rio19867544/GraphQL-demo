import { shops, drinks, orders } from './fakeDrinkData';

const findDrinkDataById = (id, key) => {
  const res = drinks.find(d => d.id === id) || {};
  // console.log('findDrinkDataById', res, id);
  if (!key) return res;
  return res[key];
};
const findShopDataById = (id, key) => {
  const res = shops.find(d => d.id === id) || {};
  if (!key) return res;
  return res[key];
};
const findOrdersDataById = (id, key) => {
  const res = orders.find(d => d.id === id) || {};
  if (!key) return res;
  return res[key];
};
export default {
  Query: {
    shops: () => shops,
    shop: (parent, { id } ) => {
      return shops.find(s => s.id == id)
    },
    drinks: () => drinks,
  },
  Mutation: {
    addOrder: (parent, args, context) => {
      const list = args.input;
      const { ol, price } = list.reduce((pre, item) => {
        const price = findDrinkDataById(item.drinkId, 'price');
        // console.log('price', price);
        if (!price) return pre;
        return {
          ...pre,
          ol: pre.ol.concat({ ...item, price }),
          price: pre.price + (price*item.count),
        };
      }, { price:0, ol: []});
      orders.push({
        id: (orders[0] && orders[orders.length-1].id + 1) || 0,
        orderList: ol,
        totalPrice: price,
      });
      // console.log('addOrder', orders);
      return orders[orders.length -1];
    },
    removeOrder:(parent, { input }, context) => {
      const index = orders.findIndex(o => o.id === input);
      if (index === -1) return `Order number(${input}) is not exist`;
      let status;
      try {
        orders.splice(index, 1);
        status = 'Successfully.'
      } catch {
        status = 'Failure';
      }

      return  status;
    },
  },
  Shop: {
    drinks:(parent) => {
      const { id } = parent;
      return drinks.filter(d => d.shopIds.includes(id));
    },
  },
  Drink: {
    sellShop:(parent) =>  {
      const { shopIds } = parent;
      return shopIds.reduce((pre, id) => {
        const result = shops.find(shop => shop.id === id);
        return (result && pre.concat(result)) || pre;
      }, []);
    },
    icon:(parent) => {
      return 'https://vignette.wikia.nocookie.net/taiwanbubbletea/images/f/f6/Boba0001.jpeg/revision/latest?cb=20181218070905&path-prefix=zh-tw';
    }
  },
  OrderDrink: {
    drinkName:(parent) => {
      const { drinkId } = parent;
      return findDrinkDataById(drinkId, 'name');
    },
    shopName:(parent) => {
      const { shopId } = parent;
      return findShopDataById(shopId, 'name');
    },
  }
}