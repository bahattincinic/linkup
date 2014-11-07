
FilteringController = RouteController.extend({
  getTagName: function () {
    return this.params.name || null;
  },
  getUserName: function () {
    return this.params.username || null;
  },
  getFilteringOptions: function () {
    var filtering = {};
    var username = this.getUserName();
    var tagname = this.getTagName();

    if (username) {
        filtering['username'] = {
        collection: Meteor.users,
        filter: {username: username},
        key: 'authorId'
      };
    }

    if (tagname) {
      filtering['tagname'] = {
        collection: Tags,
        filter: {name: tagname},
        key: 'tagId'
      };
    }

    return filtering;
  }
});

RequiredController = FilteringController.extend({
  routeParams: {},
  requirementsCheck: function () {
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
    });

    return passes;
  },
  populateParams: function () {
    // populate param keys for the first time
    var extractKeys = function extractKeys(path) {
      // extract keys starting with ':' from path
      var keys = [];
      if (path === '/') {
        return keys;
      }

      var ll = path.split('/').splice(1);
      ll.forEach(function (l) {
        l.charAt(0) === ':' &&  keys.push(l.slice(1));
      });

      return keys;
    };

    var current = Router.current();
    var path = current.route.options.path;
    var params = extractKeys(path);

    if (!params)
      return {};

    // extract values from this.params using keys obtained earlier
    var payload = {};
    params.forEach(function(param) {
      payload[param] = current.params[param];
    });

    // enhance!!
    _.extend(this.routeParams, payload);
  },
  action: function () {
    if (!this.requirementsCheck()) {
      // XXX: get notFoundTemplate from route first
      this.render('notFound');
      this.render('header', {to: 'header'});
      this.render('footer', {to: 'footer'});
    } else {
      this.populateParams();
      this.render();
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

    Router.go(paged, _.extend(this.routeParams, {page: page}));
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
  waitOn: function() {
    console.log(Number(this.getPage()), this.getSortOptions(), this.getFilteringOptions());
    return this.subscribe("posts",
                          Number(this.getPage()),
                          this.getSortOptions(),
                          this.getFilteringOptions())
  }
});

NewController = PagedController.extend({
  sort: {createdAt: -1, score: -1},
  waitOn: function () {
    console.log(Number(this.getPage()), this.getSortOptions(), this.getFilteringOptions());
    return this.subscribe("posts",
                          Number(this.getPage()),
                          this.getSortOptions(),
                          this.getFilteringOptions())
  }
});

