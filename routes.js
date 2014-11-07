
Router.map(function() {
  this.route('home', {
    controller: HotController,
    childRoute: 'homePages',
    path: '/',
    data: {
      posts: Posts.find({})
    }
  });

  // this.route('home', {
  //   path: '/best',
  //   controller: BestController,
  //   data: {
  //     posts: Posts.find({})
  //   }
  // });

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
    onBeforeAction: function() {
      // XXX: in here if there are no
      // Meteor.user() exists, then autocreate
      // an anonymous user for the poster
      // https://github.com/EventedMind/iron-router/blob/0.9/DOCS.md#before-and-after-hooks
    },
    waitOn: function() {
      // Post requires tags (aka subreddits)
      return this.subscribe("tags");
    },
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
    waitOn: function() {
      return this.subscribe('tags')
    },
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
    controller: PaginatedController,
    waitOn: function() {
      return this.subscribe('tag', this.params.name);
    },
    data: function() {
      return {
        tag: Tags.findOne({name: this.params.name}),
        posts: Posts.find({}, {
            sort: {hot: -1, createdAt: -1, score: -1}})
      }
    }
  });

  this.route('tagShowPaged', {
    require: [{collection: Tags}, {collection: Posts}],
    path: '/r/:name/:page',
    controller: PaginatedController,
    template: 'tagShow',
    waitOn: function() {
      return this.subscribe('tag', this.params.name, this.params.page);
    },
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
    waitOn: function() {
    },
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
