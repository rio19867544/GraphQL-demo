export const shops = ['五十嵐', '迷克夏', '麻古', '屋弄'].map((name, index) => ({ name, id: index + 1, icon: 'https://s3-ap-northeast-1.amazonaws.com/nidin-production/store/icons/b_43_icon_20190219_165711_f7154.png'}));

export const drinks = [{
  id:1,
  name: '珍珠奶茶',
  price: 60,
  shopIds: [1,2,3],
  
}, {
  id:2,
  name: '珍珠奶茶',
  price: 55,
  shopIds: [4],
}, {
  id:3,
  name: '柳橙綠茶',
  price: 55,
  shopIds: [3],
}, {
  id:4,
  name: '伯爵紅茶拿鐵',
  price: 50,
  shopIds: [2],
}, {
  id:5,
  name: '四季春茶',
  price: 25,
  shopIds: [1, 3],
}, {
  id:6,
  name: '決明大麥',
  price: 25,
  shopIds: [2,4],
}, {
  id:7,
  name: '冬片仔',
  price: 25,
  shopIds: [4],
}];

export const orders = [];