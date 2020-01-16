'use strict';
let mongoose = require('mongoose');
let DBSchema = require('./dbSchema');

mongoose.Promise = global.Promise;

class Database{
  static connect(){
    return new Promise((resolve, reject)=> {
      var options = {
        // server: {
        //   socketOptions: { keepAlive: 1 }
        // }
      };
      /* istanbul ignore else */
      // if (process.env.NODE_ENV === 'unitTest') {
      //   mongoose.connect('mongodb://localhost:27017/angelTest', options);
      // } else {
      //   mongoose.connect('mongodb://localhost:27017/angel', options);
      //   // mongoose.connect('mongodb://192.168.22.4:27017/angel', options);
      // }

      // mongoose.connect('mongodb://localhost:27017/', options);
      mongoose.connect('mongodb://localhost:27017/rqd', options)
      const db = mongoose.connection;
      db.on('error', (err)=>{
        reject('Connect to DB error: ' + err.message, 'error');
      });
      db.on('connected', ()=>{
        this.drinkOptionName = mongoose.model('drinkOptionName', DBSchema.drinkOptionNameSchema);
        this.drinkOption = mongoose.model('drinkOption', DBSchema.drinkOptionSchema);
        this.drink = mongoose.model('drink', DBSchema.drinkSchema);
        this.shop = mongoose.model('shop', DBSchema.shopSchema);
        // log.writeLog('DB connected!', 'info');
        console.log('DB open!');
        resolve(null);
      });
    });
  }
  static arraytoObjs(models){
    let rets = [];
    for(let i in models){
      rets.push(models[i].toObject());
    }
    return rets;
  }
}

module.exports = Database;