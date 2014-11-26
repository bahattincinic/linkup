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
  doc.authorId = userId;
  doc.createdAt = moment().utc().toDate();

  // poster counted as upvoted
  doc.score = 0;

  // generate slug from title for post detail url
  if (Meteor.isServer) {
    var slug = Npm.require('slug');
    doc.slug = slug(doc.title);
  }
});

Posts.helpers({
    author: function () {
        return Meteor.users.findOne(this.authorId);
    }
});
