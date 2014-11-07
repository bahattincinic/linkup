Template.header.events({
  'click #create_topic': function () {
    $('#newTopicModal').modal('show');
  },
});

Template.home.events({
  'click #create_tag': function () {
    Router.go('tag');
  },
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
