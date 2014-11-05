
PaginatedController = RouteController.extend({
  action: function () {
    // get requirements for this route
    var current = Router.current();
    var requirements = current.route.options.requirements;
    var passes = true;
    // confirm that all of the requirements passes OK
    //debugger;
    requirements.forEach(function validateReqs(req) {
      if (!passes) return;

      var keys = current.route.keys.map(function(key){return key.name});
      keys.forEach(function validateKeys(key) {
        if (req.params.indexOf(key) == -1) {
          return;
        }

        var selector = {};
        var param = current.params[key];
        selector[key] = param;
        console.log(selector);
        var hasDoc = !!req.collection.find(selector).count();

        //debugger;

        if (!hasDoc) {
          // did not pass
          passes = false;
          console.log('no go');
        } else {
          console.log('pass ok');
        }
      });
    });

    console.log(passes);
    //debugger;

    if (!passes) {
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
