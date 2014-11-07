
Router.map(function() {
  this.route('home', {
    controller: HotController,
    childRoute: 'homePages',
    path: '/',
    data: {
      posts: Posts.find({})
    }
  });


  this.route('userHistory', {
    controller: NewController,
    childRoute: 'userHistoryPaged',
    requires: [{collection: Posts}],
    template: 'userShow',
    path: '/user/:username',
    data: {
      posts: Posts.find({})
    }
  });

  this.route('userHistoryPaged', {
    controller: NewController,
    parentRoute: 'userHistory',
    template: 'userShow',
    path: '/user/:username/:page',
    requires: [{collection: Posts}],
    data: {
      posts: Posts.find({})
    }
  });

  this.route('homeNew', {
    path: '/new',
    template: 'home',
    controller: NewController,
    childRoute: 'newPages',
    requires: [{collection: Posts}],
    data: {
      posts: Posts.find({})
    }
  });

  this.route('newPages', {
    path: '/new/:page',
    template: 'home',
    parentRoute: 'homeNew',
    controller: NewController,
    requires: [{collection: Posts}],
    data: {
      posts: Posts.find({})
    }
  });

  this.route('homePages', {
    path: '/page/:page',
    controller: HotController,
    template: 'home',
    parentRoute: 'home',
    requires: [{collection: Posts}],
    data: {
      posts: Posts.find({}),
      tags: Tags.find({})
    }
  });

  this.route('post', {
    path: '/post',
    data: function() {
      // get all relevant tags here when posting
      // XXX: get all popular 10/20 tasks here
      // should sort by score/popularity
      return  {
        tags: Tags.find({})
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
    waitOn: function() {
      return this.subscribe("post", this.params._id);
    },
    action: function () {
      // we expect exactly one post here
      if (Posts.find().count() !== 1) {
        // no post here
        this.render('notFound');
      } else {
        if (!this.ready()) {
          this.render('loading');
        } else {
          this.render();
        }
      }
    },
    data: function () {
      return {
        post: Posts.findOne({_id: this.params._id}),
        messages: Messages.find({postId: this.params._id})
      }
    }
  });

  this.route('tagShow', {
    require: [{collection: Tags}],
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

  this.route('profile', {
    path: '/profile',
    data: function() {
      return Meteor.user();
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
