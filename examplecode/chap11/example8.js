var Sequelize = require('sequelize');

var sequelize = new Sequelize('databasenm',
                'username', 'password',
                { logging: false});

// define model
var Nodetest2 = sequelize.define('nodetest2',
  {id : {type: Sequelize.INTEGER, primaryKey: true},
   title : {type: Sequelize.STRING, allowNull: false, unique: true},
   text : Sequelize.TEXT,
   });

// sync
Nodetest2.sync().error(function(err) {
   console.log(err);
});

var test = Nodetest2.build(
   { title: 'New object',
     text: 'Newest object in the data store'});
// save record
test.save().success(function() {

  // first update
  Nodetest2.find({where : {title: 'New object'}}).success(function(test) {
     test.title = 'New object title';
     test.save().error(function(err) {
       console.log(err);
     });
     test.save().success(function() {

        // second update
        Nodetest2.find(
            {where : {title: 'New object title'}}).success(function(test) {
           test.updateAttributes(
           {title: 'An even better title'}).success(function() {});
           test.save().success(function() {

              // find all
              Nodetest2.findAll().success(function(tests) {
                 console.log(tests);


                // find new object and destroy
                Nodetest2.find({ where: {title: 'An even better title'}}).
                   success(function(test) {
                   test.destroy().on('success', function(info) {
                     console.log(info);
                     });
                });
              });
           });
         })
      });
  });
});
