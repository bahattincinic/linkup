Template.header.events({
  'click #create_topic': function () {
    $('#newTopicModal').modal('show');
  },
  'click #login_btn': function(){
    $('#loginModal').modal('show');
  },
  'click #register_btn': function(){
    $('#registerModal').modal('show');
  },
  'click #logout_btn': function(){
    Meteor.logout();
  }
});

Template.home.events({
  'click #create_tag': function () {
    Router.go('tag');
  }
});


Template.paginator.events({
  'click .previous': function (e, f) {
    e.preventDefault();

    var controller = Router.current();
    if (controller && controller.hasPages && controller.hasPages()) {
      controller.previousPage();
    }
  },
  'click .next': function (e, f) {
    e.preventDefault();

    var controller = Router.current();
    if (controller && controller.hasPages && controller.hasPages()) {
      controller.nextPage();
    }
  }
});
