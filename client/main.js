Meteor.startup(function() {
  console.log('client startup');
  Meteor.typeahead.inject();
});