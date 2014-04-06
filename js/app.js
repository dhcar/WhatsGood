// App logic

var fbUrl = 'https://whatsgood.firebaseio.com/';
var fbRef = new Firebase(fburl);

var user  = {};

if (!auth) {
	var auth = new FirebaseSimpleLogin(fbUrl, function(error, userSnap) {
		if (error){
			console.log(error);
		} else {
			user = userSnap;
		}
	});
}


// utils
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

 function randomString(length, chars) {
    var mask = '';
    if (chars.indexOf('a') > -1) mask += 'abcdefghijklmnopqrstuvwxyz';
    if (chars.indexOf('A') > -1) mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (chars.indexOf('#') > -1) mask += '0123456789';
    var result = '';
    for (var i = length; i > 0; --i) result += mask[Math.round(Math.random() * (mask.length - 1))];
    return result;
}