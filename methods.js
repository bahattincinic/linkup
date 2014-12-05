
if (Meteor.isServer) {
    // host amqp appears when this container links to rabbitmq container
    var amqp_host = process.env.AMQP_HOST || "localhost";
    console.info("amqp host resolved as : " + amqp_host);
    var mq = Meteor.npmRequire('amqp').createConnection({host: amqp_host });
}

Meteor.methods({
    vote: function(postId, userId, type) {
        var complies = postId && userId;
        if (!complies) {
            console.err("postId and userId required when voting..");
            console.err("received  postId %s and userId %s instead" % (postId, userId));
            return;
        }

        var voteScore = type;
        // check for prev votes by this user to this particular post
        var vote = Votes.findOne({postId: postId, userId: userId});
        if (vote) {
            if (vote.type === type) {
                // cannot vote same twice
                return;
            } else {
                type *= 2;
                // remove old votes to this post by this user
                Votes.remove({postId: postId, userId: userId});
            }
        }

        Posts.update(postId, {$inc: {score: type}}, function (err, res) {
            if (err) {
                console.err(err);
                return;
            }

            Votes.insert({postId: postId, userId: userId, vote: voteScore}, function (err, res) {
                if (err) {
                    console.err(err);
                    return;
                }

                if (Meteor.isServer) {
                    mq.publish('votes', {vote: type, post: postId});
                }
            });
        });
    },
    upvote: function(postId, userId) {
        Meteor.call('vote', postId, userId, 1);
    },
    downvote: function (postId, userId) {
        Meteor.call('vote', postId, userId, -1);
    }
});
