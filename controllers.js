
RequiredController = RouteController.extend({
  routeParams: {},
  action: function () {
    // get requirements for this route
    var current = Router.current();
    var passes = true;
    var requirements = current.route.options.requires || [];

    requirements.forEach(function validateReqs(req) {
      if (!passes) return;

      if (req.collection) {
        var hasDoc = !!req.collection.find().count();

        if (!hasDoc)
          passes = false;
      }

      debugger;
      // if (req.params) {
      //   req.params.forEach(function (param) {
      //     this.routeParams.extend({param: this.params[param]});
      //   });
      // }
    });

    if (!passes) {
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

PagedController = RequiredController.extend({
  sort: {},
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
      return;
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

HotController = PagedController.extend({
  sort: {hot: -1, createdAt: -1, score: -1},
  getTagName: function () {
    return this.params.name || null;
  },
  waitOn: function() {
    console.log(Number(this.getPage()), this.getSortOptions(), this.getTagName());
    return this.subscribe("posts",
                          Number(this.getPage()),
                          this.getSortOptions(),
                          this.getTagName())
  }
});


// BestController = PagedController.extend({
//   sort: {score: -1, createdAt: -1},
//   waitOn: function () {
//   }
// });
