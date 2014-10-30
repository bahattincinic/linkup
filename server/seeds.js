Meteor.startup(function() {
  getRandomArbitrary = function (min, max) {
    return Math.round(Math.random() * (max - min) + min);
  }

  Posts.remove({});
  Tags.remove({});
  Messages.remove({});

  if (Posts.find().count() == 0) {
    _(3).times(function (n) {
      var tag_id = Tags.insert({
        name: Fake.word()
      });

      _(3).times(function(n) {
        var post_id = Posts.insert({
          title: Fake.sentence(),
          url: 'http://google.com',
          tagId: tag_id,
          score: getRandomArbitrary(1, 100),
          hot: 0
        });

        _(2).times(function(n) {
          Messages.insert({
            postId: post_id,
            body: Fake.paragraph()
          });
        });
      })
    });
  }
});
