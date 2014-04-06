//var input      = document.getElementById('imageInput');
//var imgPreview = document.getElementById('imagePreview');
//
//// this is for the preview
//var input = document.getElementById('input'); // <input type="file">
//var imgPreview = document.getElementById('imgPreview'); // <img src=''>
//input.addEventListener('change', function(){
//imgPreview.src = this.value;
//});
//

// for image preview
function fileSelect(evt) {
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        var files = evt.target.files;
 
        var result = '';
        var file;
        for (var i = 0; file = files[i]; i++) {
            // if the file is not an image, continue
            if (!file.type.match('image.*')) {
                continue;
            }
 
            reader = new FileReader();
            reader.onload = (function (tFile) {
                return function (evt) {
                    var div = document.createElement('div');
                    div.innerHTML = '<img style="max-width: 400px; max-height: 400px;" src="' + evt.target.result + '" />';
                    document.getElementById('filesInfo').appendChild(div);
                };
            }(file));
            reader.readAsDataURL(file);
        }
    } else {
        alert('The File APIs are not fully supported in this browser.');
    }
}
 
document.getElementById('filesToUpload').addEventListener('change', fileSelect, false);




// for image resizing
if (window.File && window.FileReader && window.FileList && window.Blob) {
    document.getElementById('filesToUpload').onchange = function(){
        var files = document.getElementById('filesToUpload').files;
        for(var i = 0; i < files.length; i++) {
            resizeAndUpload(files[i]);
        }
    };
} else {
    alert('The File APIs are not fully supported in this browser.');
}
 


function resizeAndUpload(file) {
var reader = new FileReader();
    reader.onloadend = function() {
 
    var tempImg = new Image();
    tempImg.src = reader.result;
    tempImg.onload = function() {
 
        var MAX_WIDTH = 400;
        var MAX_HEIGHT = 300;
        var tempW = tempImg.width;
        var tempH = tempImg.height;
        if (tempW > tempH) {
            if (tempW > MAX_WIDTH) {
               tempH *= MAX_WIDTH / tempW;
               tempW = MAX_WIDTH;
            }
        } else {
            if (tempH > MAX_HEIGHT) {
               tempW *= MAX_HEIGHT / tempH;
               tempH = MAX_HEIGHT;
            }
        }
 
        var canvas = document.createElement('canvas');
        canvas.width = tempW;
        canvas.height = tempH;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(this, 0, 0, tempW, tempH);
        var dataURL = canvas.toDataURL("image/jpeg");
 

// do firebase instead of this bullshit

  //      var xhr = new XMLHttpRequest();
  //      xhr.onreadystatechange = function(ev){
  //          document.getElementById('filesInfo').innerHTML = 'Done!';
  //      };
  //
  //      xhr.open('POST', 'uploadResized.php', true);
  //      xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
  //      var data = 'image=' + dataURL;
  //      xhr.send(data);
      }
 



   }
   reader.readAsDataURL(file);
}








