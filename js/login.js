var ref = new Firebase('https://whatsgood.firebaseio.com/');

var	auth = new FirebaseSimpleLogin(ref, function(error, user){
	if (error) {
		console.log(error);
	} else if (user) {
		console.log(user);
		console.log('User ID: ' + user.id + ', Provider: ' + user.provider);
	}
});