Posts = new Meteor.Collection('posts');

Posts.before.insert(function (userId, doc) {
  doc.createdAt = moment().toDate();
});
