
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

Filter = function () {
  this.filter = function (filterOptions) {

  }
}


// home
Meteor.publishComposite("posts", function(page, sort, filterOptions) {
  console.log('----------------');
  console.log(page);
  console.dir(sort);
  var page = page || 0;
  var batch = 20;
  var filter = {};

  // we expect an array
  if (filterOptions && filterOptions instanceof Array) {
    try {
      filterOptions.forEach(function (option) {
        var doc = eval(option.collection).findOne(option.filter);
        if (doc && option.key) {
          filter[option.key] = doc._id;
        } else {
          /**
            No doc returned via filter option
            or option key was absent,
            in that case return nothing from subscription
          */
          throw new Meteor.Error(404, 'Error 404: Not found');
        }
      });
    } catch (e) {
      // return nothing
      return {
        find: function() {
          return Posts.find('nothing');
        }
      };
    }
  }

  console.log(filter);
  console.log('----------------');

  /* Publish posts for the home page */
  return {
    find: function () {
      // XXX: will sort this by score soon
      // return Posts.find({}, {limit: 10});
      return Posts.find(filter, {
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
      },
      {
        find: function (post) {
          return Meteor.users.find(post.authorId);
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
        },
        // return message owner as well
        children: [
          {
            find: function (message) {
              return Meteor.users.find(message.createdBy)
            }
          }
        ]
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