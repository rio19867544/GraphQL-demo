import { gql } from 'apollo-server'
// 1. GraphQL Schema 定義
export default gql`
  """
  選項類型
  """
  enum OptionType {
    "冰塊"
    ice
    "甜度"
    sugar
    "額外加價"
    extra
    "尺寸"
    size
  }

  type Option {
    "選項id"
    _id:ID!
    "榜定的選項名稱&類型"
    optionId:ID!
    "選項資料"
    optionInfo:OptionInfo
    "加價價格"
    price:Int
    "排序"
    index:Int
  }

  type OptionInfo {
    "名稱&類型id"
    _id:ID!
    "選項名稱"
    name:String
    "選項類型"
    type:OptionType
  }
  type Query {
    options(type:OptionType): [Option]
    optionInfos(type:OptionType): [OptionInfo]
  }
  input createOptionInput {
    "名稱&類型id"
    optionId:ID!
    "加價價格"
    price:Int
    "排序"
    index:Int
  }
  input updateOptionInput {
    "就是id"
    _id:ID!
    "名稱&類型id"
    optionId:ID!
    "加價價格"
    price:Int
    "排序"
    index:Int
  }
  input createOptionInfoInput {
    "選項名稱"
    name:String
    "選項類型"
    type:OptionType
  }
  type Mutation {
    addOption(input:createOptionInput):Option
    updateOption(input:updateOptionInput):Option
    addOptionInfo(input:createOptionInfoInput):OptionInfo
  }
`;

// type Drink {
//   "飲料名"
//   name:String
//   "飲料編號"
//   id:Int!
//   "價錢"
//   price:Int
//   "販售店家"
//   sellShop:[Shop]
//   "飲料圖片"
//   icon:String
// }

// type Shop {
//   "飲料店id"
//   id:Int!
//   "飲料店名稱"
//   name:String
//   "店家圖片"
//   icon:String
//   drinks: [Drink]
// }
// type OrderDrink {
//   "店家編號"
//   shopId:Int!
//   "飲料編號"
//   drinkId:Int!
//   drinkName:String
//   shopName:String
//   "杯數"
//   count:Int
//   "金額"
//   price:Int
// }
// type Order {
//   "訂單編號"
//   id:Int!
//   orderList:[OrderDrink]
//   totalPrice:Int
// }
// type Query {
//   shops: [Shop]
//   shop(id:ID!):Shop
//   drinks: [Drink]
// }
// input inputDrink {
//   "店家編號"
//   shopId:Int
//   "飲料編號"
//   drinkId:Int
//   "杯數"
//   count:Int
// }
// input OrderInput {
//   list: [inputDrink]!
// }
// type Mutation {
//   addOrder(input:[inputDrink]!):Order
//   removeOrder(input:Int!): String
// }