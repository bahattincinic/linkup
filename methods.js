
if (Meteor.isServer) {
  var mq = Meteor.npmRequire('amqp').createConnection({host: 'localhost'});
}

Meteor.methods({
  // XX: next 2 ones for debugging
  ShowPosts: function() {
    console.log('Posts:-----------------');
    var aa = Posts.find({}).fetch();
    _.each(aa, function(a) {
      console.log(a);
    })
    console.log('-----------------------');
  },
  ShowMessages: function() {
    console.log('Messages:-----------------');
    var aa = Messages.find({}).fetch();
    _.each(aa, function(a) {
      console.log(a);
    })
    console.log('-----------------------');
  },
  vote: function(postId, userId, type) {
    if (postId && userId) {
      var voteScore = type;
      // check for prev votes by this user to this post
      var vote = Votes.findOne({postId: postId, userId: userId});
      if (vote) {
        if (vote.type === type) {
          // cannot vote same twice
          return;
        } else {
          type *= 2;
          // remove old votes to this post by this user
          Votes.remove({postId: postId, userId: userId});
        }
      }

      Posts.update(postId, {$inc: {score: type}}, function (err, res) {
        if (err) {
          console.log(err);
          return;
        }

        Votes.insert({postId: postId, userId: userId, vote: voteScore}, function (err, res) {
          if (err) {
            console.log(err);
            return;
          }

          if (Meteor.isServer) {
            mq.publish('votes', {vote: type, post: postId});
          }
        });
      });
    }
  },
  upvote: function(postId, userId) {
    Meteor.call('vote', postId, userId, 1);
  },
  downvote: function (postId, userId) {
    Meteor.call('vote', postId, userId, -1);
  }
});
