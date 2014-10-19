Meteor.methods({
  ShowPosts: function() {
    console.log('Posts:-----------------');
    var aa = Posts.find({}).fetch();
    _.each(aa, function(a) {
      console.log(a);
    })
    console.log('-----------------------');
  },
  ShowMessages: function() {
    console.log('Messages:-----------------');
    var aa = Messages.find({}).fetch();
    _.each(aa, function(a) {
      console.log(a);
    })
    console.log('-----------------------');
  }
});