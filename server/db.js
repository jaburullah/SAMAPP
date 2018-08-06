/**
 * Created by jaburur on 21-07-2017.
 */
var mongoDB = require('mongodb');
var mongoClient = mongoDB.MongoClient;
var mongoDbObj;

var Q = require('q');
var Promise = require('promise');
var theApp = require('./app.js');
var fcm = require('./fcmNotification.js');



module.exports = {

  init: function () {
    fcm.init();
    var connection = theApp.mongoDBConnection;
    if (theApp.isProduction) {
      connection = theApp.mongoDBConnectionProduction;
    }
    mongoClient.connect(connection, function (err, db) {
      if (err)
        console.log(err);
      else {
        console.log("Connected to MongoDB");
        mongoDbObj = {
          db: db
        };
      }
    });
  },
  login: function (obj, callBack) {
    mongoDbObj.db.collection('users', function (err, collection) {
      collection.update({
        email: obj.email,
        password: obj.password
      }, {$set: {shouldRememberUserNameAndPassword: obj.shouldRememberUserNameAndPassword}}, function (err, items) {
        if (err) {
          callBack(false, err);
        }
        collection.findOne({email: obj.email, password: obj.password}, function (err, items) {
          if (err) {
            callBack(false, err);
          }

          if (items) {
            items.appInfo = {
              category: theApp.appWebSetting.ticketCategory,
              priority: theApp.appWebSetting.ticketPriority,
              status: theApp.appWebSetting.ticketStatus
            };
          }


          callBack(true, items);
        });
      });
    });
  },
  logout: function (obj, callBack) {
    mongoDbObj.db.collection('users', function (err, collection) {
      collection.update({
        email: obj.email,
        password: obj.password
      }, {$set: {lastVisited: new Date()}}, function (err, items) {
        if (err) {
          callBack(false, err);
        }
        callBack(true, items);
      });
    });
  },

  //Mobile Login
  mobileLogin: function (obj, callBack) {
    mongoDbObj.db.collection('users', function (err, collection) {
      var filterObj = {};
      if (obj.email) {
        filterObj.email = obj.email;
      }
      else if (obj.mobileNo) {
        filterObj.mobileNo = obj.mobileNo;
      }
      collection.findOne(filterObj, function (err, items) {
        if (err) {
          callBack(false, err);
        }
        if (items !== null) {

          collection.update({'_id': new mongoDB.ObjectID(items._id)}, {$set: {fireBaseId: obj.fireBaseId}}, function (err, results) {
            if (err) {
              callBack(false, err);
            }
          });
          var userDetails = items;
          var userAppartments = [];
          var i = 0,
            allAppartemnt = userDetails.appartements || [],
            l = allAppartemnt.length;
          if (allAppartemnt.length >= 1) {
            while (l--) {
              userAppartments.push({
                "_id": new mongoDB.ObjectID(allAppartemnt[i])
              });
              i++;
            }
            var appartementQuery = {
              $or: userAppartments
            };
            mongoDbObj.db.collection('appartements', function (err, collection) {
              collection.find(appartementQuery).toArray(function (err, items) {
                if (err) {
                  callBack(false, err);
                }

                userDetails.appartements = items;
                callBack(true, userDetails);
              });
            });
          }
          else {
            callBack(true, items);
          }

        }
        else {
          callBack(false, items);
        }

      });
    });
  },
  //mobile Logout
  mobileLogout: function (obj, callBack) {
    mongoDbObj.db.collection('users', function (err, collection) {
      var filterObj = {};
      filterObj.email = obj.email;
      collection.update(filterObj, {$set: {fireBaseId: ""}}, function (err, items) {
        if (err) {
          callBack(false, err);
        }
        callBack(true, obj);
      });
    });
  },

  appInfo: function (obj, callBack) {
    mongoDbObj.db.collection('users', function (err, collection) {
      collection.findOne({'_id': new mongoDB.ObjectID(obj.userId)}, function (err, items) {
        if (err) {
          callBack(false, err);
        }
        var userInfo = items;
        if (items.roles.indexOf('manager') >= 0) {
          var managerAppartements = userInfo.appartements;

          var userFilterObj = {
            $and: [
              {roles: {$in: ["user"]}},
              {appartements: {$in: managerAppartements}}
            ]
          };

          collection.find(userFilterObj).toArray(function (err, items) {
            if (err) {
              callBack(false, err);
            }
            var usersInfo = items;

            var i = 0, l = managerAppartements.length;
            var appartementFilter = {
              $or: []
            };

            while (l--) {
              appartementFilter.$or.push({
                '_id': new mongoDB.ObjectID(managerAppartements[i])
              });
              i++;
            }


            mongoDbObj.db.collection('appartements', function (err, collection) {

              collection.find(appartementFilter).toArray(function (err, items) {
                if (err) {
                  callBack(false, err);
                }
                var appartementInfo = items;
                var response = {
                  loggedInUser: userInfo,
                  usersInfo: usersInfo,
                  appartementInfo: appartementInfo,
                  category: theApp.appSetting.ticketCategory,
                  priority: theApp.appSetting.ticketPriority,
                  status: theApp.appSetting.ticketStatus
                };

                callBack(true, response);
              });
            });

          });
        }
        else {

          var userAppartement = userInfo.appartements[0];
          var managerFilterObj = {
            $and: [
              {roles: {$in: ["manager"]}},
              {appartements: {$in: [userAppartement]}}
            ]
          };

          collection.findOne(managerFilterObj, function (err, items) {
            if (err) {
              callBack(false, err);
            }
            var managerInfo = items;
            managerInfo.appartements = [];

            mongoDbObj.db.collection('appartements', function (err, collection) {
              var appatementFilterObj = {'_id': new mongoDB.ObjectID(userAppartement)};

              collection.findOne(appatementFilterObj, function (err, items) {
                if (err) {
                  callBack(false, err);
                }
                var appartementInfo = items;
                var response = {
                  loggedInUser: userInfo,
                  managerInfo: managerInfo,
                  appartementInfo: appartementInfo,
                  category: theApp.appSetting.ticketCategory,
                  priority: theApp.appSetting.ticketPriority,
                  status: theApp.appSetting.ticketStatus
                };

                callBack(true, response);
              });
            });

          });
        }


      });
    });
  },
  //Appartment
  getAppartmentDetails: function (callBack) {
    mongoDbObj.db.collection('appartements', function (err, collection) {
      collection.find({"isDeleted": false}).toArray(function (err, items) {
        if (err) {
          callBack(false, err);
        }
        callBack(true, items);
      });
    });
  },
  saveAppartement: function (data, callBack) {
    mongoDbObj.db.collection('appartements', function (err, collection) {
      if (data._id) {
        var id = data._id;
        delete data._id;
        collection.update(
          {'_id': new mongoDB.ObjectID(id)},
          {$set: data},
          function (err, items) {
            if (err) {
              callBack(false, err);
            }
            callBack(true, items);

          });
      }
      else {
        delete data.id;
        collection.insert(data, function (err, items) {
          if (err) {
            callBack(false, err);
          }
          callBack(true, items.ops[0]);
        });
      }
    });
  },
  deleteAppartement: function (data, callBack) {
    mongoDbObj.db.collection('appartements', function (err, collection) {
      collection.update(
        {'_id': new mongoDB.ObjectID(data._id)}, {$set: {"isDeleted": true}}, function (err, items) {
          if (err) {
            callBack(false, err);
          }
          callBack(true, items);
        });
    });
  },

  //users
  getAllUserDetails: function (callBack) {
    mongoDbObj.db.collection('users', function (err, collection) {
      collection.find({roles: {$in: ["user", "manager"]}}).toArray(function (err, items) {
        if (err) {
          callBack(false, err);
        }
        callBack(true, items);
      });
    });
  },
  saveUser: function (data, callBack) {
    mongoDbObj.db.collection('users', function (err, collection) {
      if (data.id) {
        var id = data.id;
        delete data.id;
        collection.update(
          {'_id': new mongoDB.ObjectID(id)},
          {$set: data},
          function (err, items) {
            if (err) {
              callBack(false, err);
            }
            callBack(true, items);

          });
      }
      else {
        delete data.id;
        collection.insert(data, function (err, items) {
          if (err) {
            callBack(false, err);
          }
          callBack(true, items.ops[0]);
        });
      }
    });
  },
  deleteUser: function (data, callBack) {
    mongoDbObj.db.collection('users', function (err, collection) {
      collection.remove({'_id': new mongoDB.ObjectID(data.id)}, function (err, items) {
        if (err) {
          callBack(false, err);
        }
        callBack(true, items);
      });
    });
  },


  //Manager
  getAllManagerDetails: function (callBack) {
    mongoDbObj.db.collection('users', function (err, collection) {
      collection.find({roles: {$in: ["manager"]}, 'isDeleted': false}).toArray(function (err, items) {
        if (err) {
          callBack(false, err);
        }
        callBack(true, items);
      });
    });
  },
  saveManager: function (data, callBack) {
    mongoDbObj.db.collection('users', function (err, collection) {
      collection.find({email: data.email}).toArray(function (err, item) {

        var createOrUpdate = function () {
          if (data._id) {
            var id = data._id;
            delete data._id;
            collection.update(
              {'_id': new mongoDB.ObjectID(id)},
              {$set: data},
              function (err, items) {
                if (err) {
                  callBack(false, err);
                }
                callBack(true, {action: true, msg: 'Manager ' + data.name + ' updated successfully'});

              });
          }
          else {
            delete data._id;
            collection.insert(data, function (err, items) {
              if (err) {
                callBack(false, err);
              }
              callBack(true, {action: true, msg: 'Manager ' + data.name + ' created successfully'});
            });
          }
        };
        if (item[0]) {
          if (!data._id && (data.email === item[0].email)) {
            callBack(true, {action: false, msg: 'Email already exists, ' + data.email});
          }
          else if (data._id !== item[0]._id.toString()) {
            callBack(true, {action: false, msg: 'Email already exists, ' + data.email});
          }
          else {
            createOrUpdate()
          }
        }
        else {
          createOrUpdate();
        }
      });
    });

  },
  deleteManager: function (data, callBack) {
    mongoDbObj.db.collection('users', function (err, collection) {
      collection.update(
        {'_id': new mongoDB.ObjectID(data._id)}, {$set: {"isDeleted": true}}, function (err, items) {
          if (err) {
            callBack(false, err);
          }
          callBack(true, {action: true, msg: 'Manager ' + data.name + ' deleted successfully'});
        });
    });
  },

  //Tenant
  getAllTenantDetails: function (callBack) {
    mongoDbObj.db.collection('users', function (err, collection) {
      collection.find({roles: {$in: ["tenant"]}, 'isDeleted': false}).toArray(function (err, items) {
        if (err) {
          callBack(false, err);
        }
        callBack(true, items);
      });
    });
  },
  saveTenant: function (data, callBack) {
    mongoDbObj.db.collection('users', function (err, collection) {
      collection.find({email: data.email}).toArray(function (err, item) {

        var createOrUpdate = function () {
          if (data._id) {
            var id = data._id;
            delete data._id;
            collection.update(
              {'_id': new mongoDB.ObjectID(id)},
              {$set: data},
              function (err, items) {
                if (err) {
                  callBack(false, err);
                }
                callBack(true, {action: true, msg: 'Tenant/House Owner ' + data.name + ' updated successfully'});

              });
          }
          else {
            delete data._id;
            collection.insert(data, function (err, items) {
              if (err) {
                callBack(false, err);
              }
              callBack(true, {action: true, msg: 'Tenant/House Owner ' + data.name + ' created successfully'});
            });
          }
        };
        if (item[0]) {
          if (!data._id && (data.email === item[0].email)) {
            callBack(true, {action: false, msg: 'Email already exists, ' + data.email});
          }
          else if (data._id !== item[0]._id.toString()) {
            callBack(true, {action: false, msg: 'Email already exists, ' + data.email});
          }
          else {
            createOrUpdate()
          }
        }
        else {
          createOrUpdate();
        }
      });
    });

  },
  deleteTenant: function (data, callBack) {
    mongoDbObj.db.collection('users', function (err, collection) {
      collection.update(
        {'_id': new mongoDB.ObjectID(data._id)}, {$set: {"isDeleted": true}}, function (err, items) {
          if (err) {
            callBack(false, err);
          }
          callBack(true, {action: true, msg: 'Tenant/House owner ' + data.name + ' deleted successfully'});
        });
    });
  },

  //Ticket info
  userTicket: function (data, callBack) {

    mongoDbObj.db.collection('tickets', function (err, collection) {
      var filterObj = {
        userID: data.userID,
        status: {$in: ["Open", "InProgress"]}
      };

      collection.find(filterObj).sort({"createdDate": -1}).toArray(function (err, items) {
        if (err) {
          callBack(false, err);
        }
        var userTicket = items;
        var filterObj = {
          $and: [
            {userID: {$ne: data.userID}},
            {apartmentID: {$eq: data.apartmentID}}
          ]
        };

        collection.find(filterObj).sort({"createdDate": -1}).toArray(function (err, items) {
          if (err) {
            callBack(false, err);
          }
          var appartementTicket = items;
          var response = {
            userTicket: userTicket,
            apartmentTicket: appartementTicket
          };
          callBack(true, response);
        });
      });
    });

  },
  managerTicket: function (data, callBack) {

    var filterObj = {
      $and: [
        {manager: data.userId},
        {$or: []}
      ]
    };
    var i = 0, appartementId = data.appartementId, l = appartementId.length;
    while (l--) {
      filterObj.$and[1].$or.push({appartement: appartementId[i]});
      i++;
    }


    mongoDbObj.db.collection('tickets', function (err, collection) {
      collection.find(filterObj).sort({"createdDate": -1}).toArray(function (err, items) {
        if (err) {
          callBack(false, err);
        }
        var recentTicket = items;
        //filterObj.$and.push({
        //    createdDate: {
        //        $gte: new Date(data.endDate).toISOString(),
        //        $lte: new Date(data.startDate).toISOString()
        //    }
        //});

        collection.find(filterObj).sort({"createdDate": -1}).toArray(function (err, items) {
          if (err) {
            callBack(false, err);
          }
          var appartementTicket = items;
          var response = {
            recentTicket: recentTicket,
            appartementTicket: appartementTicket
          };
          callBack(true, response);
        });
      });
    });
  },
  //Ticket
  sendNotification: function (data) {
    var userId = data.manager,
      title, body;

    if (data.isManagerAction) {
      userId = data.user;
      //if(data.isNewTicket){
      //    title = "Ticket Created";
      //    body = "Type: "+data.type+", Status: "+data.status+", Priority: "+data.priority;
      //}
      //else {
      title = "Ticket Modified";
      body = "Type: " + data.type + ", Status: " + data.status + ", Priority: " + data.priority;
      //}
    }
    else {
      userId = data.manager;
      if (data.isNewTicket) {
        title = "Ticket Created";
        body = "Type: " + data.type + ", Status: " + data.status + ", Priority: " + data.priority;
      }
      else {
        title = "Ticket Modified";
        body = "Type: " + data.type + ", Status: " + data.status + ", Priority: " + data.priority;
      }

    }

    //mongoDbObj.db.collection('user', function (err, collection) {
    //    collection.findOne({'_id': new mongoDB.ObjectID(userId)}, function (err, item) {
    //        if (err) {
    //            console.log("error: ",err);
    //        }
    //        if(item.fireBaseId){
    //        console.log("userId: "+userId, "FireBasesId: "+item.fireBaseId);
    //                        fcm.send(fcm.prepareNotification(item.fireBaseId, title, body,data));
    //        }
    //        else{
    //        console.log("No FCM Id to send notification");
    //        }
    //
    //    });
    //});
  },


  saveTicket: function (data, callBack) {
    var $this = this;
    mongoDbObj.db.collection('tickets', function (err, collection) {
      if (data._id) {
        var id = data._id;
        delete data._id;
        collection.update(
          {'_id': new mongoDB.ObjectID(id)},
          {$set: data},
          function (err, items) {
            if (err) {
              callBack(false, err);
            }
            data.id = id;
            data.isNewTicket = false;
            $this.sendNotification(data);
            callBack(true, {action: true, msg: 'Ticket No: ' + data.no + ', updated successfully', data: data});
          });
      }
      else {
        delete data._id;
        collection.insert(data, function (err, items) {
          if (err) {
            callBack(false, err);
          }
          data._id = items.ops[0]._id;
          data.isNewTicket = true;
          // $this.sendNotification(data);
          // callBack(true, data);
          callBack(true, {action: true, msg: 'Ticket No: ' + data.no + ', create successfully', data: data});
        });
      }
    });
  },

  deleteTicket: function (data, callBack) {
    mongoDbObj.db.collection('tickets', function (err, collection) {
      collection.update(
        {'_id': new mongoDB.ObjectID(data._id)}, {$set: {"isDeleted": true}}, function (err, items) {
          if (err) {
            callBack(false, err);
          }
          callBack(true, items);
        });
    });
  },
  getAllTicketDetails: function (callBack) {
    mongoDbObj.db.collection('tickets', function (err, collection) {
      collection.find({"isDeleted": false}).sort({"createdDate": -1}).toArray(function (err, items) {
        if (err) {
          callBack(false, err);
        }
        callBack(true, items);
      });
    });
  },


  //Home
  getHomeDetails: function (callBack) {
    mongoDbObj.db.collection('tickets', function (err, collection) {

      var newTickets = new Promise(function (resolve, reject) {
        collection.find({
          "status": 'Open', isManagerAction: false
        }).toArray(function (err, items) {
          if (err) {
            reject(err);
          }
          /// got recent tickets here
          resolve(items);
        });
      });
      var allOpenTickets = new Promise(function (resolve, reject) {
        collection.find(
          {
            "status": 'Open', isManagerAction: true
          }
        ).toArray(function (err, items) {
          if (err) {
            reject(err);
          }
          /// got all open tickets here
          resolve(items)
        });
      });
      var allClosedTickets = new Promise(function (resolve, reject) {
        collection.find(
          {
            "status": 'Close'
          }
        ).toArray(function (err, items) {
          if (err) {
            reject(err);
          }
          /// got all closed tickets here
          resolve(items)
        });
      });
      var allTickets = new Promise(function (resolve, reject) {
        collection.find(
          {
            "isDeleted": false
          }
        ).toArray(function (err, items) {
          if (err) {
            reject(err);
          }
          /// got all tickets here
          resolve(items)
        });
      });

      Promise.all([newTickets, allOpenTickets, allClosedTickets, allTickets])
        .done(function (results) {
          var res = {
            new: results[0],
            open: results[1],
            closed: results[2],
            all: results[3]
          };
          callBack(true, res);
        });
    });
  },
  //Dashboard
  getDashboardDetails: function (callBack) {
    mongoDbObj.db.collection('tickets', function (err, collection) {

      var newTickets = new Promise(function (resolve, reject) {
        collection.find({
          "status": 'Open',"isDeleted": false,
          createdDate: {
            $gte: new Date("2010-04-29T00:00:00.000Z"),
            $lt: new Date("2019-05-01T00:00:00.000Z")
          }
        }).toArray(function (err, items) {
          if (err) {
            reject(err);
          }
          /// got recent tickets here
          resolve(items);
        });
      });
      var allOpenTickets = new Promise(function (resolve, reject) {
        collection.find(
          {
            "status": 'Open', "isDeleted": false
          }
        ).toArray(function (err, items) {
          if (err) {
            reject(err);
          }
          /// got all open tickets here
          resolve(items)
        });
      });
      var allClosedTickets = new Promise(function (resolve, reject) {
        collection.find(
          {
            "status": 'Close', "isDeleted": false
          }
        ).toArray(function (err, items) {
          if (err) {
            reject(err);
          }
          /// got all closed tickets here
          resolve(items)
        });
      });
      var allTickets = new Promise(function (resolve, reject) {
        collection.find(
          {
            "isDeleted": false
          }
        ).toArray(function (err, items) {
          if (err) {
            reject(err);
          }
          /// got all tickets here
          resolve(items)
        });
      });

      Promise.all([newTickets, allOpenTickets, allClosedTickets, allTickets])
        .done(function (results) {
          var res = {
            recent: results[0],
            open: results[1],
            closed: results[2],
            all: results[3]
          };
          callBack(true, res);
        });
    });
  }

};
