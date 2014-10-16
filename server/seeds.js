Meteor.startup(function() {

  Factory.define('item', Items, {
    name: function() { return Fake.sentence(); },
    rating: function() { return _.random(1, 5); }
  });

  Factory.define('messages', Messages, {
    body: function() { return Fake.sentence(); }
  });

  if (Items.find({}).count() === 0) {

    _(10).times(function(n) {
      Factory.create('item');
    });
  }

  if (Messages.find({}).count() === 0) {
    _(10).times(function(n) {
      Factory.create('messages');
    });
  }

});
