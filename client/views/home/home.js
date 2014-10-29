Template.home.events({
  'click #create_topic': function () {
    Router.go('post');
  },
  'click #create_tag': function () {
    Router.go('tag');
  },
  'click .previous': function () {
    page -= 1;
    if (page <= 0) {
      page = 0;
      Router.go('/');
    } else {
      Router.go('home', {page: page});
    }
  },
  'click .next': function () {
    page += 1;
    Router.go('home', {page: page});
  }
});
