
Meteor.publishComposite("messages", function() {
  return {
    find: function() {
      // XXX: messages only for current posts
      return Messages.find({});
    }
  }
});

Meteor.publishComposite("tags", function() {
  return  {
    find: function() {
      // XXX: maybe sort tags by popularity/score here
      // list most popular ones only
      // XXX: need limit on this 10/20 etc.
      return Tags.find({}, {sort: {createdAt: -1}, limit: 2});
    }
  }
});

Meteor.publishComposite("posts", function() {
  /* Publish posts for the home page */
  return {
    find: function() {
      // XXX: will sort this by score soon
      return Posts.find({}, {limit: 10});
    }
    // ,
    // children: [
    //   {
    //     find: function (post) {
    //       return Meteor.users.find({ _id: post.createdBy})
    //     }
    //   }
    // ]
  }
});

Meteor.publishComposite("post", function(postId){
  /* publish single post for post chat page */
  return {
    find: function() {
      return Posts.find({_id: postId})
    }
  }
});