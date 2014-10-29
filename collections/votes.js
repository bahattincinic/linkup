Votes = new Meteor.Collection('votes');

Votes.helpers({
});

Votes.before.insert(function votesBeforeInsert (userId, doc) {
  doc.createdAt = moment().utc().toDate();
});