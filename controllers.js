
PaginatedController = RouteController.extend({
  action: function () {
    // get requirements for this route
    var current = Router.current();
    var requirements = current.route.options.requirements;
    var passes = true;
    // confirm that all of the requirements passes OK
    debugger;
    requirements.forEach(function validateReqs(req) {
      if (!passes) return;

      var keys = current.route.keys;
      keys.forEach(function validateKeys(key) {
        var attr = key.name;
        var param = current.params[attr];
        console.log("key: " + attr + " param: " + param);
        var doc = req.collection.find({attr: param}).fetch();
        debugger;
        console.log(doc);
        if (!doc) {
          // did not pass
          passes = false;
          console.log('no go');
        } else {
          console.log('pass ok');
        }
      });
    });

    debugger;

    if (Tags.find().count() !== 1) {
      // no tag found
      this.render('notFound');
      this.render('header', {to: 'header'});
      this.render('footer', {to: 'footer'});
    } else {
      if (!this.ready()) {
        this.render('loading');
      } else {
        this.render();
      }
    }
  }
});