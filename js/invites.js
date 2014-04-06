;var makeInvite = (function(document,window, undefined) {
	function makeInvite(){
		if (!(this instanceof makeInvite)) { return new makeInvite(); }
		var self              = this;
		this._inviteButtonLoc = document.getElementById('event_invite_button');
		this._selectLoc       = document.getElementById('event_invite_selector');
		this._usereventDrop   = document.getElementsByClassName('user-event-invite');
		$('.user-event-invite').on('click', _pushId);
		this._inviteButtonLoc.addEventListener('click', _onSubmit);
	}

	makeInvite.prototype._doShit = function(){
		return _doMoreShit();
	};

	function _pushId(){
		// 
		var userId       = this.id;
		console.log(userId);
		document.getElementById('event_invite_selector').setAttribute("data-invitee", userId);
		console.log('set attribute');
		_doMoreShit();
	}

	function _doMoreShit(){
		var self            = this;
		var selectLoc       = document.getElementById('event_invite_selector');
		selectLoc.innerHTML = '';
		document.getElementById('event_invite_button').textContent = 'Send Invite';
		// fill drop
		// this._dropList = elt('', content, attrs);
		user.ref.root().child('private').child(user.ident).child('events').on('value', function(snap){
			snap.forEach(function(snap2){
				var eventId   = snap2.name();
				var eventName = snap2.child('title').val();
				var el        = elt('option', eventName, {'value' : eventId});
				selectLoc.appendChild(el);
			});
		});
	}

	function _onSubmit(){
		// this element is hidden
		var selectLoc          = document.getElementById('event_invite_selector');
		var userId             = selectLoc.getAttribute('data-invitee');
		console.log(userId);
		var select_name        = selectLoc.options[selectLoc.selectedIndex].text;
		var select_eventId     = selectLoc.options[selectLoc.selectedIndex].value;
		var inviteObj          = {};
		inviteObj['sender']    = user.fullName;
		inviteObj['senderId']  = user.ident;
		inviteObj['eventId']   = select_eventId;
		inviteObj['eventName'] = select_name;
		this.textContent       = 'invited';
		return user.ref.root().child('invites').child(userId).push(inviteObj);
	}

	return makeInvite;

}(document, window, undefined));