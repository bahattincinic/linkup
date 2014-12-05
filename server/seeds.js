
Meteor.startup(function() {
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

     Posts.remove({});
     Tags.remove({});
     Messages.remove({});
     Votes.remove({});
     Meteor.users.remove({});
     var use_seeder = !!process.env.USE_SEEDER;

    if (Tags.find({}).count() == 0 && use_seeder) {
        ["new", "tesla", "osman"].forEach(function (tag) {
            var tag_id = Tags.insert({
                name: tag,
                description: "no desc"
            });

            var usernames = ['osman', 'kazim', 'janhus', 'jonhus', 'ismail'];
            function makeid()
            {
                    var text = "";
                    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

                    for( var i=0; i < 5; i++ )
                            text += possible.charAt(Math.floor(Math.random() * possible.length));

                    return text;
            }

            _(5).times(function(n) {
                // create a user first
                var username = makeid();
                console.log(username);
                var user_id = Meteor.users.insert({username: username});
                console.log(user_id, Meteor.users.find().count());

                var ii = getRandomInt(2, 8000);
                var post_id = Posts.insert({
                    title: tag + Fake.sentence(),
                    url: 'http://google.com',
                    tagId: tag_id,
                    hot: 0
                });

                Posts.update(post_id, {$set: {score: ii}});

                // change createdAt
                var ranDate = moment().subtract(getRandomInt(1, 5), 'days').utc().toDate();
                Posts.update(post_id, {$set: {createdAt: ranDate}});

                // upvote post to trigger hotness calculation
                Meteor.call('upvote', post_id, user_id);
                var post = Posts.findOne(post_id);
                Posts.update(post_id, {$set: {authorId: user_id}});

                _(2).times(function(n) {
                    Messages.insert({
                        postId: post_id,
                        body: Fake.paragraph()
                    });
                });


            });

        // end of 50 times

        });
    }
});
