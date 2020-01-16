const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
import dataBase from "./mongo/dataBase";
import { ObjectId } from 'mongodb';

// ApolloServer: 讓我們啟動 server 的 class ，不但實作許多 GraphQL 功能也提供 web application 的功能 (背後使用 express)
// gql: template literal tag, 讓你在 Javascript 中使用 GraphQL 語法
// import typeDefs from './graphQL-schema';
// import resolvers from './graphQL-resolver';

import typeDefs from './drinkSchema';
import resolvers from './drinkResolver';

// typeDefs && resolvers固定名稱不能改
// 3. 初始化 Web Server ，需傳入 typeDefs (Schema) 與 resolvers (Resolver)
const server = new ApolloServer({
  // Schema 部分
  typeDefs,
  // Resolver 部分
  resolvers,
  context: ({ req }) => {
    // const token = req.header['x-token'];
    // const user = jwt.verify(token);
    return {
      me: { id: 1 },
      // ...others like db models, env, secret, ...
    };
  },
});

const app = express();
server.applyMiddleware({ app });
let dt;
function costTime(text) {
  const d = new Date().getTime();
  if (!dt) dt = d;
  console.log(text, d - dt);
}
function dbAction(model, method, query) {
  return new Promise((resolve, reject) => {
    try {
      costTime(`${method}-start`);
      model[method](query, function(err, data) {
        costTime(`${method}-end`);
        if(err) reject({isSuccess: false, data: err });
        else resolve({isSuccess: true, data });
      });
    } catch (e) {
      reject({isSuccess: false, data:e });
    }
  });
}

function addIfNone(model, query) {
  return new Promise((resolve, reject) => {
    try {
      costTime(`${JSON.stringify(query)}-start`);
      dbAction(model, 'findOne', query)
      .then(({ isSuccess, data }) => {
        if (!data) {
          console.log(`${JSON.stringify(query)} create now.`);
          dbAction(model, 'create', query)
            .then((createRes) => resolve(createRes))
            .catch((createErr) => reject(createErr));
        } else {
          console.log(`${JSON.stringify(query)} already exist.`);
          resolve(data);
        }
      })
      .catch((err) => reject(err));
      // model.findOne(query, function(err, data) {
      //   costTime(`${JSON.stringify(query)}-end`);
      //   if(err){
      //     console.log(`find ${JSON.stringify(query)} err`);
      //     reject(err);
      //   } else {
      //     if (!data) {
      //       console.log(`${JSON.stringify(query)} create now.`);
      //       model.create(query, function(err, createRes) {
      //         if (err) reject(`create ${query} err: ${err}`);
      //         resolve(createRes);
      //       })
      //     } else {
      //       console.log(`${JSON.stringify(query)} already exist.`);
      //       resolve(data);
      //     }
      //   }
      // });
    } catch(e) {
      reject(e);
    }
  });
}

const perSettingConst = {
  size: ['小杯', '中杯', '大杯', '特大杯', '瓶裝'],
  sugar: ['無糖','一分','三分','五分','七分','正常'],
  ice: ['熱', '溫', '去冰', '微冰', '少冰', '正常'],
  extra: [],
};
dataBase.connect()
.then(() => {
  return new Promise((resolve, reject) => {
    const actions = Object.entries(perSettingConst).reduce((pre, [type, values]) => {
      const apis = values.map((value) => ({ type, name: value }));
      return pre.concat(apis);
    }, [])
    dbAction(dataBase.drinkOptionName, 'find', {$or: actions})
      .then(({ data }) => {
        const optionItems = actions.reduce((pre, action) => {
          // 存在的直接返回id
          const existItem = data.find(item => action.type === item.type && action.name === item.name);
          // console.log('existItem', existItem);
          if (existItem) pre.exist.push(existItem);
          else pre.create.push(action);
          // return pre.concat(dbAction(dataBase.drinkOptionName, 'create', action));
          return pre;
        }, {exist: [], create:[] });
        const apis = optionItems.exist;
        if (optionItems.create.length) apis.push(dbAction(dataBase.drinkOptionName, 'insertMany', optionItems.create));
        Promise.all(apis).then((optionNameList) => {
          // costTime('optionName-End');
          const result = optionNameList.reduce((pre, optionName) => {
            let res = optionName;
            if (typeof optionName === 'object' && Object.prototype.hasOwnProperty.call(optionName, 'data')) {
              if (optionName.isSuccess) {
                res = optionName.data;
              } else throw new Error(optionName.data);
            }
            return pre.concat(res);
          }, []);
          resolve(result);
        });
      })
      .catch((err) => reject(err));
  });
})
// .then(() => {
//   return async () => {
//     const actions = Object.entries(perSettingConst).reduce((pre, [type, values]) => {
//       const apis = values.map((value) => ({ type, name: value }));
//       return pre.concat(apis);
//     }, [])
//     const { data, isSuccess}  = await dbAction(dataBase.drinkOptionName, 'find', {$or: actions});
//     const apis = actions.reduce((pre, action) => {
//       // 存在的直接返回id
//       const existItem = data.find(item => action.type === item.type && action.name === action.name);
//       if (existItem) return pre.concat(existItem._id);
//       return pre.concat(dbAction(drinkOptionName, 'create', action));
//     }, []);
//     return await Promise.all(apis).then((optionNameList) => {
//       console.log('optionNameList', optionNameList);
//       return optionNameList.map((optionName) => {
//         if (typeof optionName === 'object' && Object.prototype.hasOwnProperty.call(optionName, 'data')) {
//           if (optionName.isSuccess) {
//             return optionName.data._id;
//           } else throw new Error(optionName.data);
//         } else return optionName;
//       });
//     });
//   }
// })
// .then(() => {
//   // return new Promise((resolve, reject) => {
//   //   const actions = Object.entries(perSettingConst).reduce((pre, [type, values]) => {
//   //     const apis = values.map((value) => ({ type, name: value }));
//   //     return pre.concat(apis);
//   //   }, [])
//   //   costTime('drink-start');
//   //   .find({$or: actions}, function(err, data) {
//   //     costTime('drink-done')
//   //     console.log(data);
//   //     const 
//   //   });
//     // try {
//     //   const actions = Object.entries(perSettingConst)
//     //     .reduce((pre, [type, values]) => {
//     //       const apis = values.map((value) => ({ type, name: value }))
//     //         .map((body) => addIfNone(dataBase.drinkOptionName, body));
//     //       return pre.concat(apis);
//     //     }, [])
//     //   Promise.all(actions).then((data) => resolve(data));
//     // } catch(err) {
//     //   reject(err);
//     // }
//   // });
// })
.then((res) => {
  console.log('second', res);
  return new Promise((resolve, reject) => {
    try  {
      dbAction(dataBase.drinkOption, 'find', {$or: res.map(i => ({ optionId: i._id }))})
        .then(({ data }) => {
          const indexs = {};

          const optionItems = res.reduce((pre, optionName) => {
              if (!['ice', 'sugar'].includes(optionName.type)) return pre;
            // 存在的直接返回id
            const existOption = data.find((option) => {
              const oid = new ObjectId(option.optionId);
              const id = new ObjectId(optionName._id);
              // console.log('option.optionId', oid);
              // console.log('optionName._id', id);
              // console.log('existOption', oid.equals(id));
              return oid.equals(id);
            });
            console.log('existOption', existOption);
            if (existOption) pre.exist.push(existOption);
            else {
              const index = indexs[optionName.type] || 0;
              const option = { optionId: optionName._id,  index, price: 0};
              indexs[optionName.type] = index+1;
              pre.create.push(option);
            };
            // return pre.concat(dbAction(dataBase.drinkOptionName, 'create', action));
            return pre;
          }, {exist: [], create:[] });
          const apis = optionItems.exist;
          if (optionItems.create.length) apis.push(dbAction(dataBase.drinkOption, 'insertMany', optionItems.create));
          Promise.all(apis).then((optionList) => {
            costTime('optionList-End');
            const result = optionList.reduce((pre, option) => {
              let res = option;
              if (typeof option === 'object' && Object.prototype.hasOwnProperty.call(option, 'data')) {
                if (option.isSuccess) {
                  res = option.data;
                } else throw new Error(option.data);
              }
              return pre.concat(res);
            }, []);
            // console.log('option-result', result);
            resolve(result);
          });

        });
    } catch(err) {
      reject(err);
    }
  });
})
.then(() => {
  // 4. 啟動 Server
  app.listen({port: 4000}, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
  );
})
