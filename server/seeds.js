Meteor.startup(function() {

  if (Posts.find({}).count == 0) {
    _(10).times(function(n) {
      var post_id = Posts.insert({
        title: Fake.sentence(),
        url: 'http://google.com'
      });

      _(2).times(function(n) {
        Messages.insert({
          postId: post_id,
          body: Fake.paragraph()
        })
      });
    })
  }
});
