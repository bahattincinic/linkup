Messages = new Meteor.Collection('messages');

Messages.before.insert(function (userId, doc) {
  doc.createdAt = moment().toDate();
  doc.createdBy = userId;
});

Messages.helpers({
    author: function () {
        return Meteor.users.findOne(this.createdBy);
    }
});