import { gql } from 'apollo-server'
// 1. GraphQL Schema 定義
export default gql`
  """
  高度單位
  """
  enum HeightUnit {
    "公尺"
    METRE
    "公分"
    CENTIMETRE
    "英尺 (1 英尺 = 30.48 公分)"
    FOOT
  }

  """
  重量單位
  """
  enum WeightUnit {
    "公斤"
    KILOGRAM
    "公克"
    GRAM
    "磅 (1 磅 = 0.45359237 公斤)"
    POUND
  }

  """
  貼文
  """
  type Post {
    "識別碼"
    id: ID!
    "作者"
    author: User
    "標題"
    title: String
    "內容"
    content: String
    "按讚者"
    likeGivers: [User]
  }
  type User {
    id: Int!
    name: String
    age: Int
    "朋友列表 ([] 代表 array 之意)"
    friends: [User]
    height(unit: HeightUnit = METER):Float
    weight(unit: WeightUnit = KILOGRAM):Float
    posts:[Post]
  }

  type Query {
    hello: String
    me: User
    users: [User]
    user(name:String):User
    posts: [Post]
  }

  input AddPostInput {
    title: String!
    content: String
  }
  type Mutation {
    "新增貼文"
    addPost(input:AddPostInput!): Post
    "貼文按讚 (收回讚)"
    likePost(postId: ID!): Post
  }
`;
