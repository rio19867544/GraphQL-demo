import fakeData from './fakeData';
// 2. Resolvers 是一個會對照 Schema 中 field 的 function map ，讓你可以計算並回傳資料給 GraphQL Server


// Helper Functions
const findUserById = id => fakeData.users.find(user => user.id === id);
const findUserByName = name => fakeData.users.find(user => user.name === name);
const filterPostsByAuthorId = authorId => fakeData.posts.filter(post => post.authorId === authorId);
const findPostById = postId => fakeData.posts.find(post => post.id === postId);
export default {
  Query: {
    // 需注意名稱一定要對到 Schema 中 field 的名稱
    hello: () => 'world',
    me: () => fakeData.users[0],
    users: () => fakeData.users,
    user: (root, args, context) => {
      const { name } = args;
      return fakeData.users.find(u => (u.name || '').toLowerCase() === (name || '').toLowerCase());
    },
    posts: () => fakeData.posts,
  },
  Mutation: {
    addPost: (root, args, context) => {
      // const { title, content } = args;
      const { title, content } = args.input;
      const { posts } = fakeData;
      const { me } = context;
      // 新增 post
      posts.push({
        id: posts.length + 1,
        authorId: me.id,
        title,
        content,
        likeGiverIds: []
      });
      // 回傳新增的那篇 post
      return posts[posts.length - 1];
    },
    likePost: (root, args, context) => {
      const { postId } = args;
      const { me } = context;
      const post = findPostById(postId);
      if (!post) throw new Error(`Post ${psotId} Not Exists`);

      if (post.likeGiverIds.includes(me.id)) {
        // 如果已經按過讚就收回
        const index = post.likeGiverIds.findIndex(v => v === userId);
        post.likeGiverIds.splice(index, 1);
      } else {
        // 否則就加入 likeGiverIds 名單
        post.likeGiverIds.push(me.id);
      }
      return post;
    },
  },
  User: { // Field resolver
    friends: (parent, args, context) => {
      const { friendIds } = parent;
      return fakeData.users.filter(u => friendIds.includes(u.id));
    },
    name: (parent) => {
      const { id, name } = parent;
      return id % 2 === 0 ? `${name}-odd` : name;
    },
    height: (parent, args) => {
      const { unit } = args;
      // 可注意到 Enum type 進到 javascript 就變成了 String 格式
      // 另外支援 default 值 CENTIMETRE
      if (!unit || unit === "CENTIMETRE") return parent.height;
      else if (unit === "METRE") return parent.height / 100;
      else if (unit === "FOOT") return parent.height / 30.48;
      throw new Error(`Height unit "${unit}" not supported.`);
    },
    // 對應到 Schema 的 User.weight
    weight: (parent, args, context) => {
      const { unit } = args;
      // 支援 default 值 KILOGRAM
      if (!unit || unit === "KILOGRAM") return parent.weight;
      else if (unit === "GRAM") return parent.weight * 100;
      else if (unit === "POUND") return parent.weight / 0.45359237;
      throw new Error(`Weight unit "${unit}" not supported.`);
    },
    posts: (parent, args, context) => {
      const { id } = parent;
      return filterPostsByAuthorId(id);
    },
  },
  Post: {
    likeGivers: (parent, args, context) => {
      const { likeGiverIds } = parent;
      return likeGiverIds.map((id) => findUserById(id))
    },
    author: (parent, args, context) => {
      const { authorId } = parent;
      return findUserById(authorId);
    },
  },
};