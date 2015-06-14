
exports.mapRoute = function(app, prefix) {

   prefix = '/' + prefix;

   var prefixObj = require('./controllers/' + prefix);

   // index
   app.get(prefix, prefixObj.index);

   // add
   app.get(prefix + '/new', prefixObj.new);

   // show
   app.get(prefix + '/:sn', prefixObj.show);

   // create
   app.post(prefix + '/create', prefixObj.create);

   // edit
   app.get(prefix + '/:sn/edit', prefixObj.edit);

   // update
   app.put(prefix + '/:sn', prefixObj.update);

   // destroy
   app.del(prefix + '/:sn', prefixObj.destroy);

};
