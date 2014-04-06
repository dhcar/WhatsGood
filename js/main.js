function checkError(error) {
        switch (error.code) {
            case 'INVALID_EMAIL':
                console.log('The specified authentication type is not enabled for this Firebase');
                break;
            case 'INVALID_PASSWORD':
                window.alert('Password is incorrect');
                break;
            case 'EMAIL_TAKEN':
                window.alert('Email is already in use');
                break;
            case 'AUTHENTICATION_DISABLED':
                window.alert('Email must be in correct format');
                break;
            case 'INVALID_FIREBASE':
                console.log('Invalid Firebase specified');
                break;
            case 'INVALID_ORIGIN':
                console.log('Unauthorized request origin, please check application configuration.');
                break;
            case 'INVALID_USER':
                window.alert('The specified user does not exist');
                break;
            case 'UNKNOWN_ERROR':
                console.log('An unknown error occurred. Please contact support@firebase.com.');
                break;
            case 'USER_DENIED':
                console.log('User denied authentication request.');
                break;
            case 'SERVER_ERROR':
                console.log('There was a server error');
                break;
            default:
                console.log('an error occurred');
        }
    }

function randomString(length, chars) {
    var mask = '';
    if (chars.indexOf('a') > -1) mask += 'abcdefghijklmnopqrstuvwxyz';
    if (chars.indexOf('A') > -1) mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (chars.indexOf('#') > -1) mask += '0123456789';
    var result = '';
    for (var i = length; i > 0; --i) result += mask[Math.round(Math.random() * (mask.length - 1))];
    return result;
}

// posts
// events
// private
// invites
// users

var app = {

	self: this,

	auth: {},

	ref: new Firebase('https://whatsgood.firebaseio.com/'),

	user: {},

	posts: {},

	events: {},

	friends: {},

	invites: {},

	init: function(){
		// read 
		self.ref.child(user.id).child('recentPosts').on('child_added', this.getPosts);
		self.setUser();
		self.ref.child('private').child(user.id).child('friends').on('child_added', this.makeFriends);
	},

	makeFriends: function(snap){
		var userId           = snap.name();
		this.friends[userId] = snap.val();
	},

	setUser: function(){
		if(!self.auth){
			self.auth = new FirebaseSimpleLogin(app.ref, function(error,user){
				if (error) {
					console.log(error);
				} else if (user) {
					self.user = user;
					console.log('User ID: ' + user.id + ', Provider: ' + user.provider);
				}
			});
		}
	},

	getPosts: function(snap){
		var postId = snap.val;
		self.ref.child(postId).once('value', function(snap2) {
			// call post reference
			// add to model
			self.posts[postId] = snap2.val();
		});
	},

};

