'use strict';

import { Schema } from 'mongoose';
class DBSchema {
  constructor() {
    this.shopSchema = new Schema({
      name: {type: String, trim: true, required: true},
      tel: {type: String, trim: true, required: true},
      address:  {type: String, trim: true},
      minDelivery: { type: Number, default: 0 },
      icon: String,
      createAt: Number,
    });
    this.drinkOptionNameSchema = new Schema({
      name: {type: String, trim: true, required: true},
      type: {type: String, trim: true, required: true},
    })
    this.drinkOptionSchema = new Schema({
      optionId: Schema.Types.ObjectId,
      index: { type: Number, default: 0 },
      price: { type: Number, default: 0 }
    });
    this.drinkSchema = new Schema({
      shopId: Schema.Types.ObjectId,
      // [{ name: '中杯', price: 50}]
      sizes: { type: Schema.Types.Mixed, required:true },
      createAt: Number,
    })
    // this.taxiGroupSchema = new mongoose.Schema({
    //   use: { type: String, required: true },
    //   agentName: String,
    //   taxiGroupID: { type: String, index: true, unique: true, required: true },
    //   name: { type: String, required: true },
    //   address: String,
    //   area: String,
    //   contact: String,
    //   contactPhone: String,
    //   contactEmail: String,
    //   isRemove: { type: Boolean, default: false, index: true },
    //   note: { type: String, index: true }
    // });
    // this.taxiGroupSchema.index({ agentID: 1, name: 1 }, { unique: true });

    // this.accountSchema = new mongoose.Schema(expDBSchema.accountSchemaJSON);
    // this.accountSchema.index({ 'agent.agentID': 1, 'account': 1 }, { unique: true });
    // this.accountSchema.index({ 'police.location': '2d' });


    // this.roleSchema = new mongoose.Schema(expDBSchema.roleSchemaJSON, { minimize: false });
    // this.expDBSchema = expDBSchema;
  }
}
// var expDBSchema = {};
// Object.defineProperty(expDBSchema, 'roleSchemaJSON', {
//   set: (name) => { }, get: () => {
//     return {
//       agentID: String,
//       taxiGroupID: String,
//       agentName: String,
//       taxiGroupName: String,
//       roleID: String,
//       roleName: String,
//       roleType: String, //[superAdm | police | agentAdm | agentStaff | taxiGroupAdm | taxiGroupStaff | driver | passenger]
//       isEnable: { type: Boolean, default: true },
//       isRemove: { type: Boolean, default: false },
//       accessRight: {},
//       note: String,

//     };
//   }
// });

module.exports = new DBSchema();
