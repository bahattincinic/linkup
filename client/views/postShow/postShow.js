Template.postShow.rendered = function () {
  // ...
};

Template.postShow.events({
  'submit #insertMessage': function (e, form) {
    e.preventDefault();
    var postId = $.trim(form.find('input[name=postId]').value);
    var body = $.trim(form.find('textarea[name=body]').value);

    if (postId && body) {
      Messages.insert({
        postId: postId,
        body: body
      }, function(err, result) {
        if (err)
          throw err;
      });
    }
  }
});


