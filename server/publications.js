
Meteor.publishComposite("tags", function() {
  return  {
    find: function() {
      return Tags.find({}, {
        sort: {createdAt: -1},
        fields: {name: 1}
      });
    }
  }
});

// home
Meteor.publishComposite("posts", function(page, sort) {
  console.log(page);
  console.dir(sort);
  var page = page || 0;
  var batch = 20;

  /* Publish posts for the home page */
  return {
    find: function () {
      // XXX: will sort this by score soon
      // return Posts.find({}, {limit: 10});
      return Posts.find({}, {
          sort: sort,
          limit: batch,
          skip: batch*page
        }
      );
    },
    children: [
      {
        find: function (post) {
          return Votes.find({postId: post._id});
        }
      }
    ]
  }
});

Meteor.publishComposite("post", function(postId) {
  /* publish single post for post chat page */
  return {
    find: function() {
      return Posts.find({_id: postId})
    },
    children : [
      {
        find: function (post) {
          return Messages.find({postId: post._id})
        }
      },
      {
        find: function (post) {
          return Votes.find({postId: post._id});
        }
      }
    ]
  }
});

Meteor.publishComposite('tag', function(name, page) {
  var batch = 20;
  var page = page || 0;

  return {
    find: function () {
      return Tags.find({name: name})
    },
    children : [
      {
        find: function (tag) {
          return Posts.find({tagId: tag._id}, {
            sort: {hot: -1, createdAt: -1},
            limit: batch,
            skip: batch*page
          })
        }
      }
    ]
  }
});