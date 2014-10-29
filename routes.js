Router.map(function() {

  this.route('home', {
    path: '/',
    waitOn: function() {
      return this.subscribe("posts");
    },
    data: {
      posts: Posts.find({}, {sort: {hot: -1, createdAt: -1, score: -1}})
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
      tags: Tags.find({})
    }
  });

  this.route('postShow', {
    path: '/post/:_id',
    waitOn: function() {
      return this.subscribe("post", this.params._id);
    },
    data: function () {
      return {
        post: Posts.findOne({_id: this.params._id}),
        messages: Messages.find({postId: this.params._id})
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
