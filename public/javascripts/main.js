console.log('Am I even loading???')
var albumBucketName = 'radspotsmedia';
var bucketRegion = 'us-east-2';
var IdentityPoolId = 'us-east-2:acdf72a6-12d0-43a2-8347-6e1d9612562e';


AWS.config.update({
 region: bucketRegion,
 credentials: new AWS.CognitoIdentityCredentials({
   IdentityPoolId: IdentityPoolId
 })
});

var s3 = new AWS.S3({
 apiVersion: '2006-03-01',
 params: {Bucket: albumBucketName}
});

function listAlbums() {
 s3.listObjects({Delimiter: '/'}, function(err, data) {
   if (err) {
     return alert('There was an error listing your albums: ' + err.message);
   } else {
     var albums = data.CommonPrefixes.map(function(commonPrefix) {
       var prefix = commonPrefix.Prefix;
       var albumName = decodeURIComponent(prefix.replace('/', ''));
       return getHtml([
         '<li>',
           '<span onclick="deleteAlbum(\'' + albumName + '\')">X</span>',
           '<span onclick="viewAlbum(\'' + albumName + '\')">',
             albumName,
           '</span>',
         '</li>'
       ]);
     });
     var message = albums.length ?
       getHtml([
         '<p>Click on an album name to view it.</p>',
         '<p>Click on the X to delete the album.</p>'
       ]) :
       '<p>You do not have any albums. Please Create album.';
     var htmlTemplate = [
       '<h2>Albums</h2>',
       message,
       '<ul>',
         getHtml(albums),
       '</ul>',
       '<button onclick="createAlbum(prompt(\'Enter Album Name:\'))">',
         'Create New Album',
       '</button>'
     ]
     document.getElementById('app').innerHTML = getHtml(htmlTemplate);
   }
 });
}

function createAlbum(albumName) {
 albumName = albumName.trim();
 if (!albumName) {
   return alert('Album names must contain at least one non-space character.');
 }
 if (albumName.indexOf('/') !== -1) {
   return alert('Album names cannot contain slashes.');
 }
 var albumKey = encodeURIComponent(albumName) + '/';
 s3.headObject({Key: albumKey}, function(err, data) {
   if (!err) {
     return alert('Album already exists.');
   }
   if (err.code !== 'NotFound') {
     return alert('There was an error creating your album: ' + err.message);
   }
   s3.putObject({Key: albumKey}, function(err, data) {
     if (err) {
       return alert('There was an error creating your album: ' + err.message);
     }
     alert('Successfully created album.');
     viewAlbum(albumName);
   });
 });
}

function viewAlbum(albumName) {
 var albumPhotosKey = encodeURIComponent(albumName) + '//';
 s3.listObjects({Prefix: albumPhotosKey}, function(err, data) {
   if (err) {
     return alert('There was an error viewing your album: ' + err.message);
   }
   // `this` references the AWS.Response instance that represents the response
   var href = this.request.httpRequest.endpoint.href;
   var bucketUrl = href + albumBucketName + '/';

   var photos = data.Contents.map(function(photo) {
     var photoKey = photo.Key;
     var photoUrl = bucketUrl + encodeURIComponent(photoKey);
     return getHtml([
       '<span>',
         '<figure class="image is-128x128">',
           '<img src="' + photoUrl + '"/>',
           '</figure>',
         '</div>',
         '<div>',
           '<button class="button" onclick="deletePhoto(\'' + albumName + "','" + photoKey + '\')">',
             'X',
           '</button>',
           '<span>',
             photoKey.replace(albumPhotosKey, ''),
           '</span>',
         '</div>',
       '<span>',
     ]);
   });
   var message = photos.length ?
     '<p>Click on the X to delete the photo</p>' :
     '<p>You do not have any photos in this album. Please add photos.</p>';
   var htmlTemplate = [
       '<h2>',
         'Album: ' + albumName,
       '</h2>',
       message,
       '<div>',
         getHtml(photos),
       '</div>',
       // '<input id="photoupload" type="file" accept="image/*">',
       '<div class="field">',
            '<div class="file">',
              '<label class="file-label">',
        '<input class="file-input" id="photoupload"  type="file" name="resume">',
        '<span id="filename" class="file-cta">',
          '<span class="file-icon">',
            '<i class="fa fa-upload"></i>',
          '</span>',
          '<span class="file-label">',
            'Choose a Profile Photo..',
          '</span>',
        '</span>',
       '</label>',
            '</div>',
          '</div>',
       '<button class="button" id="addphoto" onclick="addPhoto(\'' + albumName +'\')">',
         'Add Photo',
       '</button>',
       '<button class="button" onclick="listAlbums()">',
         'Back To Albums',
       '</button>',
     ]
   document.getElementById('app').innerHTML = getHtml(htmlTemplate);
 });
}

function addPhoto(albumName) {
var location;
 var files = document.getElementById('photoupload').files;
 alert(files);
 if (!files.length) {
   return alert('Please choose a file to upload first.');
 }

 var file = files[0];
 var fileName = file.name;
 var albumPhotosKey = encodeURIComponent(albumName) + '//';

 var photoKey = albumPhotosKey + fileName;
 s3.upload({
   Key: photoKey,
   Body: file,
   ACL: 'public-read'
 }, function(err, data) {
   if (err) {
     return alert('There was an error uploading your photo: ', fileName);
   }
   alert('Successfully uploaded photo.');
   location = data.Location;
   viewAlbum(albumName);
 });
}

function deletePhoto(albumName, photoKey) {
 s3.deleteObject({Key: photoKey}, function(err, data) {
   if (err) {
     return alert('There was an error deleting your photo: ', err.message);
   }
   alert('Successfully deleted photo.');
   viewAlbum(albumName);
 });
}

function deleteAlbum(albumName) {
 var albumKey = encodeURIComponent(albumName) + '/';
 s3.listObjects({Prefix: albumKey}, function(err, data) {
   if (err) {
     return alert('There was an error deleting your album: ', err.message);
   }
   var objects = data.Contents.map(function(object) {
     return {Key: object.Key};
   });
   s3.deleteObjects({
     Delete: {Objects: objects, Quiet: true}
   }, function(err, data) {
     if (err) {
       return alert('There was an error deleting your album: ', err.message);
     }
     alert('Successfully deleted album.');
     listAlbums();
   });
 });
}
// $.ajax({
//     'type':'GET',
//     'url':'https://s3-us-west-1.amazonaws.com/radspotsmedia/sO-67NimQbbq5E4HZQuEVPTmJ2F36b0NAYtGh30Tevk.jpg',
//     'success':function(msg) {
//         alert(msg);
//     }
//
// });
// var upload_file = function(path,file_field) {
//     var file = file_field[0].files[0];
//     var fd = new FormData();
//     fd.append('key', file.name);
//     fd.append('acl', 'bucket-owner-full-control');
//     fd.append('Content-Type', file.type);
//     fd.append("file",file);
//
//
//     return $.ajax({
//         type : 'POST',
//         url : path,
//         data : fd,
//         processData: false,  // Don't process the data
//         contentType: false,  // Don't set contentType
//         success: function(json) { console.log('Upload complete!') },
//         error: function (XMLHttpRequest, textStatus, errorThrown) {
//             alert('Upload error: ' + XMLHttpRequest.responseText);
//         }
//     });
// };
//
//
//
// file.onchange = function(){
//     if(file.files.length > 0)
//     {
//
//       document.getElementById('filename').innerHTML = 					file.files[0].name;
// upload_file('http://radspotsmedia.s3-website-us-west-1.amazonaws.com',file)
//     }
// };

// HELP ME!
// Configure our app with our settings.

// AWS.config.update({
//   accessKeyId: "AKIAJ2T4P4PLPEPN526Q",
//   secretAccessKey: "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",
//   region: 'us-west-1'
// });
// s3 = new AWS.S3({
//   apiVersion: '2006-03-01'
// });
// var bucketParams = {
//   Bucket: 'radspotsmedia'
// };

// On form submit, we will first grab the image picked and upload it to s3, if the upload is successful, we will take the returned url and pass that, along with our other user data collected from the form and pass that to our database.



// function upload_file(path,file_field) {
//     var file = file_field[0].files[0];
//     var fd = new FormData();
//     fd.append('key', file.name);
//     fd.append('acl', 'bucket-owner-full-control');
//     fd.append('Content-Type', file.type);
//     fd.append("file",file);
//
//
//     return $.ajax({
//         type : 'POST',
//         url : path,
//         data : fd,
//         processData: false,  // Don't process the data
//         contentType: false,  // Don't set contentType
//         success: function(json) { console.log('Upload complete!') },
//         error: function (XMLHttpRequest, textStatus, errorThrown) {
//             console.log('Upload error: ' + XMLHttpRequest.responseText);
//         }
//     });
// };
// function uploadVideo () {
//   var file_field = $('#file');
//   upload_file('http://radspotsmedia.s3-website-us-west-1.amazonaws.com/', file_field);
// };