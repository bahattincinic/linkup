Template.postDetail.helpers({
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
    return false;
  }
});

Template.postDetail.events({
  'click .post-detail': function (e) {
    e.preventDefault();
    Router.go('postShow', {_id: this._id, slug: this.slug});
  },
  'click .upvote': function (e) {
    e.preventDefault();
    if (Meteor.user()) {
      Meteor.call('upvote', this._id, Meteor.userId());
    }else {
      Router.go('entrySignIn');
    }
  },
  'click .downvote': function (e) {
    e.preventDefault();
    if (Meteor.user()) {
      Meteor.call('downvote', this._id, Meteor.userId());
    }else {
      Router.go('entrySignIn');
    }
  }
});