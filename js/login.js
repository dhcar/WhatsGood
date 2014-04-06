// document.getElementById('facebookLogin').addEventListener('click', doLogin);

var ref = new Firebase('https://whatsgood.firebaseio.com/');

if(!auth){
	auth = new FirebaseSimpleLogin(ref, function(error, user){
		if (error) {
			console.log(error);
			auth.login('facebook', {
  				rememberMe: true,
  				scope: 'email'
			});
		} else if (user) {
			self.user = user;
			console.log('User ID: ' + user.id + ', Provider: ' + user.provider);
		}
	});
}