Template.postShow.rendered = function () {
  // ...
};

Template.postShow.events({
  'click #insertMessage, submit #messageForm': function (e) {
    e.preventDefault();
    var postId = $.trim($('input[name=postId]').val());
    var body = $.trim($('input[name=body]').val());

    if (postId && body) {
      var post = Posts.findOne({_id: postId});
      if (post) {
        Messages.insert({
          postId: postId,
          body: body
        }, function(err, result) {
          if (err)
            throw err;
        });
        $('input[name=body]').val('');
        $("html, body").animate({ scrollTop: $(document).height() }, 1000);
      } else {
        throw new Meteor.Error('Invalid post id');
      }
    }
    return false;
  }
});
