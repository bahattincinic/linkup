Template.home.rendered = function() {
};

Template.home.events({
  'click #create_topic': function () {
    Router.go('post');
  },
  'click .post-detail': function () {
    console.log(this._id);
    Router.go('postShow', {_id: this._id});
  }
});
