// 
// 
;$(document).load(makeInvite);
var makeInvite = (function(document,window, undefined) {
	function makeInvite(){
		if (!(this instanceof makeInvite)) { return new makeInvite(); }
		var self = this;
		this._inviteButtonLoc = document.getElementById('dag_invite_button');
		this._selectLoc       = document.getElementById('dag_invite_selector');
		this._userDagDrop     = document.getElementsByClassName('user-dag-invite');
		// this._doMoreShit();
		// this._userDagDrop.forEach(function(el, index, array){
		// 	el.addEventListener("click", self._pushId);
		// });
		$('.user-dag-invite').on('click', _pushId);
		this._inviteButtonLoc.addEventListener('click', _onSubmit);
	}

	makeInvite.prototype._doShit = function(){
		return _doMoreShit();
	};

	function _pushId(){
		// 
		var userId       = this.id;
		console.log(userId);
		document.getElementById('dag_invite_selector').setAttribute("data-invitee", userId);
		console.log('set attribute');
		_doMoreShit();
	}

	function _doMoreShit(){
		var self    = this;
		var selectLoc = document.getElementById('dag_invite_selector');
		selectLoc.innerHTML = '';
		document.getElementById('dag_invite_button').textContent = 'Send Invite';
		// fill drop
		// this._dropList = elt('', content, attrs);
		user.ref.root().child('private').child(user.ident).child('dagz').on('value', function(snap){
			snap.forEach(function(snap2){
				var dagId   = snap2.name();
				var dagName = snap2.child('title').val();
				var el      = elt('option', dagName, {'value' : dagId});
				selectLoc.appendChild(el);
			});
		});
	}

	function _onSubmit(){
		// this element is hidden
		var selectLoc         = document.getElementById('dag_invite_selector');
		var userId            = selectLoc.getAttribute('data-invitee');
		console.log(userId);
		var select_name       = selectLoc.options[selectLoc.selectedIndex].text;
		var select_dagId      = selectLoc.options[selectLoc.selectedIndex].value;
		var inviteObj         = {};
		inviteObj['sender']   = user.fullName;
		inviteObj['senderId'] = user.ident;
		inviteObj['dagId']    = select_dagId;
		inviteObj['dagName']  = select_name;
		this.textContent      = 'invited';
		return user.ref.root().child('invites').child(userId).push(inviteObj);
	}

	return makeInvite;

}(document, window, undefined));

(function () {
	$(document).ready(function(){
		console.log('make invite');
		makeInvite();
	});
	$('.right-off-canvas-toggle').on('click', makeInvite);
})();