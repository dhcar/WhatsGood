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
// function fileSelect(evt) {
//     if (window.File && window.FileReader && window.FileList && window.Blob) {
//         var files = evt.target.files;
 
//         var result = '';
//         var file = files[0];
//         // for (var i = 0; file = files[0]; i++) {
//         //     // if the file is not an image, continue
//         //     var flag=0;
//         //    if (!file.type.match('image.*')) {
//         //        flag = 1;
//         //    }
 
//             reader = new FileReader();
//             reader.onload = (function (tFile) {
//                 return function (evt) {

//                     document.getElementById('newPick').src = evt.target.result;
//                 };
//             }(file));
//             reader.readAsDataURL(file);
//         //     if (flag == 0){
//         //     	break;
//         //     }
//         // }
//     } else {
//         alert('The File APIs are not fully supported in this browser.');
//     }
// }
 
// document.getElementById('filesToUpload').addEventListener('change', fileSelect, false);




// for image resizing
if (window.File && window.FileReader && window.FileList && window.Blob) {
    document.getElementById('filesToUpload').onchange = function(){
        var files = document.getElementById('filesToUpload').files;
        for(var i = 0; i < files.length; i++) {
            resizeAndUpload(files[i], 'newPic');
        }
    };
    document.getElementById('filesToUpload2').onchange = function(){
        var files = document.getElementById('filesToUpload2').files;
        for(var i = 0; i < files.length; i++) {
            resizeAndUpload(files[i], 'eventImage');
        }
    };
} else {
    alert('The File APIs are not fully supported in this browser.');
}
 


function resizeAndUpload(file, id) {
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

        document.getElementById(id).src = dataURL;
 		


// do firebase instead of this bullshit

  //      var xhr = new XMLHttpRequest();
  //      xhr.onreadystatechange = function(ev){
  //          document.getElementById('newPick').innerHTML = 'Done!';
  //      };
  //
  //      xhr.open('POST', 'uploadResized.php', true);
  //      xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
  //      var data = 'image=' + dataURL;
  //      xhr.send(data);
      };
 



   };
   reader.readAsDataURL(file);
}








