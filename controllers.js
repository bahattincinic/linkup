
PaginatedController = RouteController.extend({
  action: function () {
    // we expect exactly one tag here
    if (Tags.find().count() !== 1) {
      // no tag found
      this.render('notFound');
      this.render('header', {to: 'header'});
      this.render('footer', {to: 'footer'});
    } else {
      if (!this.ready()) {
        this.render('loading');
      } else {
        this.render();
      }
    }
  }
});