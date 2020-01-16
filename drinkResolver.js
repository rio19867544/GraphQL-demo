import dataBase from "./mongo/dataBase";
import { ObjectId } from 'mongodb';

export default {
  Query: {
    options: async (parent, { type }) => {
      let query = {};
      if (type) {
        const oNames = await dataBase.drinkOptionName.find({type:  type.toLowerCase()});
        if (!oNames.length) return [];
        query = { $or: oNames.map((o) => ({ optionId: o._id})) };
        
      }
      return dataBase.drinkOption.find(query);
    },
    optionInfos:(parent, { type }) => {
      let query = {};
      if (type) {
        query.type = type.toLowerCase();
      }
      return dataBase.drinkOptionName.find(query);
    }
  },
  Mutation: {
    addOption:async (parent, { input }) => {
      const data = await dataBase.drinkOption.findOne(input);
      // console.log('addOption',data);
      if (data) return data;
      return dataBase.drinkOption.create(input);
    },
    addOptionInfo: async (parent, { input }) => {
      const data = await dataBase.drinkOptionName.findOne(input);
      if (data) return data;
      return dataBase.drinkOptionName.create(input);
    },
    updateOption: async (parent, { input }) => {
      const condition = { _id: input._id };
      const update = { ...input, _id: undefined };
      return await dataBase.drinkOption.findOneAndUpdate(condition, update, { omitUndefined: true, new: true });
    },
  },
  Option: {
    optionInfo: (parent) => {
      const { optionId } = parent;
      return dataBase.drinkOptionName.findOne({ _id: optionId });
    }
  }
}
// {
//   "data": {
//     "_id": "5de4df4910bc3c7eacf87d47",
//     "optionId": "5de4dd252d511a7c7e9fda2b",
//     "price": 15,
//     "index": 2
//   }
// }