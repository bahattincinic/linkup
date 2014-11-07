
PaginatedController = RouteController.extend({
  action: function () {
    // get requirements for this route
    var current = Router.current();
    var requirements = current.route.options.require;
    var passes = true;

    requirements.forEach(function validateReqs(req) {
      if (!passes) return;

      if (req.collection) {
        var hasDoc = !!req.collection.find().count();

        if (!hasDoc)
          passes = false;
      }
    });

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

var SortedController = RouteController.extend({
  sort: {createdAt: -1},
  hasPages: function () {return true;},
  getSortOptions: function () {
    return this.sort;
  },
  getPage: function() {
    return this.params.page || 0;
  },
  process: function (page) {
    if (page > 0) {
      // pick childRoute option if provided, otherwise use current router
      var paged = this.route.options.childRoute || this.route.getName();
    } else if (page == 0) {
      // likewise pick parent route if provided, use self otherwise..
      var paged = this.route.options.parentRoute || this.route.getName();
    } else {
      // negative page, do nothing..
      // throw new Meteor.Error(404, ' No Such page ');
    }

    Router.go(paged, {page: page});
  },
  nextPage: function () {
    page = Number(this.getPage());
    this.process(++page);
  },
  previousPage: function () {
    page = Number(this.getPage());
    this.process(--page);
  }
});

HotController = SortedController.extend({
  sort: {hot: -1, createdAt: -1, score: -1},
  waitOn: function() {
    console.log(Number(this.getPage()), this.getSortOptions());
    return [
      this.subscribe("posts", Number(this.getPage()), this.getSortOptions()),
      this.subscribe("tags")
    ];
  }
});


// BestController = SortedController.extend({
//   sort: {score: -1, createdAt: -1},
//   waitOn: function () {
//   }
// });