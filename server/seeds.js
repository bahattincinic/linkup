Meteor.startup(function() {
  // clean all data first
  Posts.remove({});
  Messages.remove({});
  Tags.remove({});

  // create some fake data
  Factory.define('posts', Posts, {
    title: function() { return Fake.sentence(); },
    url: function () { return "http://google.com";}
  });

  if (Posts.find({}).count() === 0) {
    _(10).times(function(n) {
      Factory.create('posts');
    });
  }
});
