// document.getElementById('facebookLogin').addEventListener('click', doLogin);

var ref = new Firebase('https://whatsgood.firebaseio.com/');


var	auth = new FirebaseSimpleLogin(ref, function(error, user){
	if (error) {
		console.log(error);
		auth.login('facebook', {
  			rememberMe: true,
  			scope: 'email'
		});
	} else if (user) {
		window.location.replace('index.html');
		self.user = user;
		console.log('User ID: ' + user.id + ', Provider: ' + user.provider);
	}
});