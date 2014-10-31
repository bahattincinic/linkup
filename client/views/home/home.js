Template.home.rendered = function() {
};

Template.home.helpers({
  hasVoted: function () {
    if (Meteor.user()) {
      var userId = Meteor.userId();
      var postId = this._id;
      var vote = Votes.findOne({postId: postId, userId: userId});
      return !!vote;
    }

    return false;
  },
  checkVote: function () {
    // check for vote
    // return true if upvote, false otherwise
    if (Meteor.user()) {
      var postId = this._id;
      var userId = Meteor.userId();
      var vote = Votes.findOne({postId: postId, userId: userId});
      if (vote.vote == 1)
        return true;
      else if (vote.vote == -1)
        return false;
    }
  }
});

Template.home.events({
  'click #create_topic': function () {
    Router.go('post');
  },
  'click #create_tag': function () {
    Router.go('tag');
  },
  'click .post-detail': function () {
    Router.go('postShow', {_id: this._id});
  },
  'click .upvote': function () {
    if (Meteor.user()) {
      Meteor.call('upvote', this._id, Meteor.userId());
    }
  },
  'click .downvote': function () {
    if (Meteor.user()) {
      Meteor.call('downvote', this._id, Meteor.userId());
    }
  }
});
