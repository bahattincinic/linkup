
Router.map(function() {
  this.route('home', {
    controller: HotController,
    childRoute: 'homePages',
    path: '/',
    data: function () {
      var router = Router.current();
      var sort = router.sort || null;
      return {
        posts: Posts.find({}, {sort: sort}),
        page: router.type
      }
    }
  });

  this.route('userHistory', {
    controller: NewController,
    childRoute: 'userHistoryPaged',
    requires: [{collection: Posts}],
    template: 'userShow',
    path: '/user/:username',
    data: function () {
      var router = Router.current();
      var sort = router.sort || null;
      return {
        posts: Posts.find({}, {sort: sort})
      }
    }
  });

  this.route('userHistoryPaged', {
    controller: NewController,
    parentRoute: 'userHistory',
    template: 'userShow',
    path: '/user/:username/:page',
    requires: [{collection: Posts}],
    data: function () {
      var router = Router.current();
      var sort = router.sort || null;
      return {
        posts: Posts.find({}, {sort: sort})
      }
    }
  });

  this.route('homeNew', {
    path: '/new',
    template: 'home',
    controller: NewController,
    childRoute: 'newPages',
    requires: [{collection: Posts}],
    data: function () {
      var router = Router.current();
      var sort = router.sort || null;
      return {
        posts: Posts.find({}, {sort: sort}),
        page: router.type
      }
    }
  });

  this.route('newPages', {
    path: '/new/:page',
    template: 'home',
    parentRoute: 'homeNew',
    controller: NewController,
    requires: [{collection: Posts}],
    data: function () {
      var router = Router.current();
      var sort = router.sort || null;
      return {
        posts: Posts.find({}, {sort: sort}),
        page: router.type
      }
    }
  });

  this.route('homePages', {
    path: '/page/:page',
    controller: HotController,
    template: 'home',
    parentRoute: 'home',
    requires: [{collection: Posts}],
    data: function () {
      var router = Router.current();
      var sort = router.sort || null;
      return {
        posts: Posts.find({}, {sort: sort}),
        tags: Tags.find({}),
        page: router.type
      }
    }
  });

  this.route('tag', {
    path: '/tag',
    data: function () {
      return {
        tags: Tags.find({})
      }
    }
  });

  this.route('postShow', {
    path: '/post/:_id',
    controller: HotController, // bring me the hot ones
    requires: [{collection: Posts}], // must contain a Post
    data: function () {
      return {
        post: Posts.findOne({_id: this.params._id}),
        messages: Messages.find({postId: this.params._id})
      }
    }
  });

  this.route('tagShow', {
    requires: [
      {collection: Tags},
      {collection: Posts}
    ],
    path: '/r/:name',
    controller: HotController,
    childRoute: 'tagShowPaged',
    data: function() {
      return {
        tag: Tags.findOne({name: this.params.name}),
        posts: Posts.find({})
      }
    }
  });

  this.route('tagShowPaged', {
    requires: [{collection: Tags}, {collection: Posts}],
    path: '/r/:name/:page',
    controller: HotController,
    template: 'tagShow',
    parentRoute: 'tagShow',
    data: function() {
      return {
        tag: Tags.findOne({name: this.params.name}),
        posts: Posts.find({})
      }
    }
  });

  this.route('dashboard', {
    path: '/dashboard',
    loginRequired: 'entrySignIn',
    onAfterAction: function() {
      SEO.set({
        title: 'Dashboard | ' + SEO.settings.title
      });
    }
  });

  this.route('notFound', {
    path: '*',
    where: 'server',
    action: function() {
      this.response.statusCode = 404;
      this.response.end(Handlebars.templates['404']());
    }
  });
});
