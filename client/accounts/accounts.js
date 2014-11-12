Template.login.events({
	'submit #loginForm': function(){
		e.preventDefault();
		var username = $.trim(t.find('#account-username').value);
        var password = $.trim(t.find('#account-password').value);
        Meteor.loginWithPassword(username, password, function(error) {
            if(error){
                t.find('#account-username').value = '';
                t.find('#account-password').value = '';
            }else {
            	$('#loginModal').modal('hide');
            }
        });
        return false;
	}
});

Template.register.events({
	'submit #registerForm': function(){
		e.preventDefault();
		var username = $.trim(t.find('#account-username').value);
        var password = $.trim(t.find('#account-password').value);
        if(username == '' || password == ''){
        	return false;
        }
        Accounts.createUser({password: password, username: username, function(err){
        	$('#registerModal').modal('hide');
        }});
	}
});