Template.post.rendered = function() {
};

Template.post.events({
  'submit #topic': function (e, form) {
    e.preventDefault();
    var title = $.trim(form.find('textarea[name=title]').value);
    var url = $.trim(form.find('input[name=url]').value);
    var channels = $.trim(form.find('input[name=tags]').value);
    // XXX: splice channels, get tags individually
    // title and url are mandatory
    if (title && url) {
      Posts.insert({
        title: title,
        url: url,
        channels: channels,
        authorId: Meteor.userId()
      }, insertCb);

      function insertCb(err, postId) {
        if (err) {
          throw err;
          return;
        }

        // result is post _id
        Meteor.call('upvote', postId, Meteor.userId());
        $('#newTopicModal').modal('hide');
        $('#topic')[0].reset();
        // refresh
        var self = Posts.findOne(postId);
        Router.go('postShow', {_id: postId, slug: self.slug});
      };
    } else {
      throw new Meteor.Error('XXX: missing data');
    }
  },
  'submit #tag': function(e, form) {
    e.preventDefault();

    var name = $.trim(form.find('#tag input[name=name]').value);
    var title = $.trim(form.find('#tag input[name=title]').value);
    var desc = $.trim(form.find('#tag textarea[name=desc]').value);
    var required = !!name && !!title
    if (!required) {
      // invalid tag post
      console.log('invalid');
      return;
    }

    Tags.insert({
      name: name,
      title: title,
      description: desc
    }, insertTag);

    function insertTag(err, tagId) {
      if (err)
        console.log(err);

      console.log('inserted tag: ' + tagId);
      $('#newTagModal').modal('hide');
      $('#tag')[0].reset();
    }
  }
});


Template.post.helpers({
  tags: function () {
    return Tags.find({}).fetch().map(function(tag){ return tag.name; });
  },
  settings: function () {
    return {
      position: "bottom",
      limit: 5,
      rules : [
        {
          token: '#',
          collection: Tags,
          field: "name",
          template: Template.scrub,
          callback: function (doc, element) {
            console.log(doc, element);
          }
        }
      ]
    }
  }
});
