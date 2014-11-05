Router.configure({
  layoutTemplate: 'mainLayout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound',
  osman: 10,

  yieldTemplates: {
    header: {
      to: 'header'
    },
    footer: {
      to: 'footer'
    }
  },

  onAfterAction: function() {
    $(document).scrollTop(0);
  }
});

// console.log('options: ');
// console.log(Router.options);
// console.log(Router.options.osman);

Router.onBeforeAction('loading');
