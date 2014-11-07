
Meteor.startup(function() {
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  // Posts.remove({});
  // Tags.remove({});
  // Messages.remove({});
  // Votes.remove({});
  // Meteor.users.remove({username: 'test'});

  if (Tags.find({}).count() == 0) {
    var user_id = Meteor.users.insert({username: 'test'});
    var user = Meteor.users.findOne(user_id);

    ["new", "tesla", "osman"].forEach(function (tag) {
      var tag_id = Tags.insert({
        name: tag,
        description: "no desc"
      });

      _(50).times(function(n) {
        var ii = getRandomInt(2, 8000);
        var post_id = Posts.insert({
          title: tag + Fake.sentence(),
          url: 'http://google.com',
          tagId: tag_id,
          hot: 0
        });

        // update default score
        Posts.update(post_id, {$set: {score: ii}});

        // change createdAt
        var ranDate = moment().subtract(getRandomInt(1, 5), 'days').utc().toDate();
        Posts.update(post_id, {$set: {createdAt: ranDate}});

        // upvote post to trigger hotness calculation
        Meteor.call('upvote', post_id, user_id);

        _(2).times(function(n) {
          Messages.insert({
            postId: post_id,
            body: Fake.paragraph()
          });
        });
      });
    });
  }
});
