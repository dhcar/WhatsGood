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

function elt(tag, content, attrs) {
   var e = document.createElement(tag);
   if (typeof content === "string") {
     setTextContent(e, content);
   } else if (content) {
     for (var i = 0; i < content.length; ++i) { e.appendChild(content[i]); }
   }
   for(var attr in (attrs || { })) {
     e.setAttribute(attr, attrs[attr]);
   }
   return e;
 }

 function setTextContent(e, str) {
   e.innerHTML = "";
   e.appendChild(document.createTextNode(str));
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
		self.setAuth();
		self.ref.child('users').child(user.id).on('value', this.setUserInfo);
		self.ref.child(user.id).child('recentPosts').on('child_added', this.getPosts);
		self.ref.child('private').child(user.id).child('friends').on('child_added', this.makeFriends);
		self.ref.child('private').child(user.id).child('events').on('child_added', this.combEvents);
		self.ref.child('invites').child(user.id).on('child_added', this.makeInvites);
		// 
		// firebase events
		// 
		var newPicSubmit = document.getElementById('newPicSubmit');
		newPicSubmit.addEventListener('click', function(e){
			var blob = this.src;
			var type = this.getAttribute('data-pic-type');
			var postObj = {
				caption: caption || '',
				picUrl: blob,
				lat: Map.currMarker.getPosition().lat(),
				lng: Map.currMarker.getPosition().lng(),
				creator: userId,
				timestamp: Firebase.ServerValue.TIMESTAMP
			};
			if(type == 'posts'){
				// doesnt have to use newRef, could use random UIDs since push occurs for user read
				var newRef = self.ref.child('posts').push(postObj, function(){
					self.ref.child('private').child(user.id).child('friends').once('value', function(snap){
							snap.forEach(function(snap2){
								var userId = snap2.name();
								var pushId = newRef.name();
								self.ref.child('recentPosts').child(userId).push(pushId);
							});
						});
					self.ref.push(postObj);
				});
			} else if (type == 'events'){
				var newRef = self.ref.child('events').child(pushId).child('posts').push(postObj);
				var pushId = newRef.name();
			}
		});
		document.getElementById('submitNewEvent').addEventListener('click', this.makeEvent);
		document.getElementById('searchFriends').addEventListener('keypress', this.searchFriends);
	},

	makeEvent: function(e){
		var event = {
			name: $('#eName').value || '',
			caption: $('#caption').value || '',
			picUrl: $('#eventImage').src,
			lat: Map.currMarker.getPosition().lat(),
			lng: Map.currMarker.getPosition().lng(),
			creator: userId,
			timestamp: Firebase.ServerValue.TIMESTAMP
		};
		var newRef = this.ref.child('events').push(event);
		var pushId = newRef.name();
		// make event
		
	},

	searchFriends: function(){
		/* Act on the event */
		var input       = document.getElementById('searchFriends');
		var search_term = input.value.toLowerCase();
		console.log(search_term);
		var resultsLoc       = document.getElementById('searchResultsList');
		resultsLoc.innerHTML = '';
		if (search_term.length < 2) return false;
		var search_res = [];
		
		// convert app.friends to array
		// 
		var friendRay = [];
		for (var prop in this.friends) {
			if (this.friends.hasOwnProperty(prop)) {
				friendRay.push(prop, this.friends[prop]);
			}
		}
		// 
		// scan array for an indexOf > -1 for the search_term
		// 
		//for (var i = 0; i < search_res.length; i++) {
		for(var i=0; i < friendRay.length; i++){
			var k     = i;
			var userId  = friendRay[k][0];
			var name  = friendRay[k][1];
			var sp    = elt('span', name , {'class': 'search-result-text'});
			var b     = elt('a', "Invite" , {'class': 'search-result-link right', "data-userId": userId, "data-url": app.ref.root().child('events').child(userId).toString()});
				b.addEventListener("click", joinThis);
			var e     = elt('li', [ b, sp ], {'class':'search-result'});
			console.log(e);
			parentEl.appendChild(e);
		}
		resultsLoc.appendChild(parentEl);
	},
	
	makeInvites: function(snap){
		this.invites[snap.name()] = snap.val();
	},

	setUserInfo: function(snap){
		this.user = snap.val();
	},

	combEvents: function(snap){
		var eventId = snap.val();
		this.ref.child('events').child(eventId).once('value', function(snap2) {
			self.events[eventId] = snap2.val();
		});
		// separate read for pictures
	},

	makeFriends: function(snap){
		var userId           = snap.name();
		this.friends[userId] = snap.val();
	},

	setAuth: function(){
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
		self.ref.child('posts').child(postId).once('value', function(snap2) {
			// call post reference
			// add to model
			self.posts[postId] = snap2.val();
		});
	},

};