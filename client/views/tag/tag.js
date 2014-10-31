Template.tag.rendered = function() {
};


Template.tag.events({
  'submit #new_tag': function (e, form) {
    e.preventDefault();
    var title = $.trim(form.find('input[name=title]').value);
    var description = $.trim(form.find('textarea[name=description]').value);
    console.log(title, description);
  }
});