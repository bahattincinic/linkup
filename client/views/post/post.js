Template.post.rendered = function() {
};

Template.post.events({
  'submit #topic': function (e, form) {
    e.preventDefault();
    var title = $.trim(form.find('textarea[name=title]').value);
    var url = $.trim(form.find('input[name=url]').value);
    var channels = $.trim(form.find('input[name=tags]').value);
    // title and url are mandatory
    if (title && url) {
      Posts.insert({
        title: title,
        url: url,
        channels: channels
      }, function (err, postId) {
        if (err)
          throw err;

        // result is post _id
        Meteor.call('upvote', postId, Meteor.userId());
        Router.go('home');
      });
    } else {
      throw new Meteor.Error('XXX: missing data');
    }
  }
});


Template.post.helpers({
  tags: function () {
    console.log('tagNames called');
    return Tags.find({}).fetch().map(function(tag){ return tag.name; });
  }
});

// Template.post.tags = function () {
//   console.log('tagNames called');

// };
