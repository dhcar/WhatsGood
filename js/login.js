var ref = new Firebase('https://whatsgood.firebaseio.com/');

var	auth = new FirebaseSimpleLogin(ref, function(error, user){
	if (error) {
		console.log(error);
	} else if (user) {
		console.log(user);
		console.log('User ID: ' + user.id + ', Provider: ' + user.provider);
	}
});

// <input type="text" placeholder="email" id="email">
// <input type="password" id="password">
// <button id='login'>Log In</button><button id="newUser">New User</button>
function stringifyUser(obj){
	var _user = JSON.stringify(obj);
	localStorage.setItem('_user',_user);
}

function doLogin(){
	var password = document.getElementById('password').value || document.getElementById('passwordR').value;
	var email    = document.getElementById('email').value || document.getElementById('emailR').value;
    var authLogin = new FirebaseSimpleLogin(ref, function(error, user) {
        if (error) {
            console.log('doLogin');
            console.log(error);
        } else if (!error) {
            authLogin.login('password', {
                email: email,
                password: password,
                rememberMe: true
            });
            console.log("user.id: " + user.id);
            if (user.id) {
                console.log("fbUserId: " + fbUserId);
                window.location.redirect("index.html");
            }
        }
    });
}

$(document).ready(function(){
	// var password = document.getElementById('password').value;
	// var email    = document.getElementById('email').value;

	document.getElementById('login').addEventListener('click', doLogin);

	// document.getElementById('login').addEventListener('click', function(){
	// 	auth.login('password', {
	//   		email: email,
	//   		password: password,
	//   		rememberMe: true
	// 	});
	// 	if(auth.id){
	// 		window.location.replace('index.html');
	// 	}
	// });
	
	document.getElementById('newUser').addEventListener('click', function(){
		var name     = document.getElementById('nameR').value;
		var password = document.getElementById('passwordR').value;
		var email    = document.getElementById('emailR').value;
		auth.createUser(email, password, function(error, user){
			if (error) {
				console.log(error);
			} else {
				ref.child('users').child(user.id).set({email: email, name: name});
				// console.log(user);
				// auth.login('password', {
	  	// 			email: email,
	  	// 			password: password,
	  	// 			rememberMe: true
				// });
				doLogin();
				if(auth.id){
					window.location.replace('index.html');
				}
			}
		});
	});
});