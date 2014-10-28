Posts = new Meteor.Collection('posts');

Posts.helpers({
  age: function () {
    return moment(this.createdAt).fromNow();
  }
});

function getRandomArbitrary(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

Posts.before.insert(function (userId, doc) {
  doc.createdAt = moment().utc().toDate();
  // poster counted as upvoted
  doc.score = getRandomArbitrary(1, 2000);
});
