Template.login.events({
	'submit #loginForm': function(e, t){
		e.preventDefault();
		var username = $.trim($('#login-username').val());
        var password = $.trim($('#login-password').val());
        Meteor.loginWithPassword(username, password, function(error) {
            if(error){
                $('#account-username').val('');
                $('#account-password').val('');
            }else {
            	$('#loginModal').modal('hide');
                $('.modal-backdrop').remove();
            }
        });
        return false;
	}
});

Template.register.events({
	'submit #registerForm': function(e, t){
		e.preventDefault();
		var username = $.trim($('#register-username').val());
        var password = $.trim($('#register-password').val());
        if(username == '' || password == ''){
        	return false;
        }
        Accounts.createUser({password: password, username: username}, function(err){
        	$('#registerModal').modal('hide');
            $('.modal-backdrop').remove();
        });
        return false;
	}
});