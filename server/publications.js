Meteor.publishComposite("items", function() {
  return {
    find: function() {
      return Items.find({});
    }
  }
});


Meteor.publishComposite("messages", function() {
  return {
    find: function() {
      return Messages.find({});
    }
  }
});
