Template.home.rendered = function() {
};

Template.home.events({
  'click #create_topic': function () {
    Router.go('post');
  },
  'click .post-detail': function () {
    Router.go('postShow', {_id: this._id});
  }
});
