Tags = new Meteor.Collection('tags');

Tags.before.insert(function (userId, doc) {
  doc.createdAt = moment().toDate();
  doc.createdBy = userId;
});
