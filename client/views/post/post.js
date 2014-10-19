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
      }, function (err, result) {
        if (err)
          throw err;
        console.log(result);
        // result is post _id
      });
    } else {
      throw new Meteor.Error('XXX: missing data');
    }
  }
});
