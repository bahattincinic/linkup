
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

SortedController = RouteController.extend({
  limit: 20,
  page: 0,
  sort: {createdAt: -1},
  getSortOptions: function () {
    return this.sort;
  },
  getPage: function() {
    return this.params.page || this.page;
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


BestController = SortedController.extend({
  sort: {score: -1, createdAt: -1},
  waitOn: function () {
  }
});