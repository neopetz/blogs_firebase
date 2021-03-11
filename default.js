function upload(){

    let image = document.querySelector('#image').files[0];
    let post = document.querySelector('#post').value;
    let imageName = image.name;

    let storageRef = firebase.storage().ref('images/'+imageName);
    let uploadTask = storageRef.put(image);
    uploadTask.on('state_change',function(snapshot){
        let progress = (snapshot.bytesTransferred/snapshot.totalBytes)*100;
        console.log("upload is "+progress+" done");
    },function(error){
        console.log(error.message);
    },function(){
        uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL){
            firebase.database().ref('blogs/').push().set({
                text:post,
                imageURL:downloadURL
            },function(error){
                if(error){
                    alert("error while uploading");
                }else{
                    alert("Successfully Uploaded");
                    document.querySelector('#post-form').reset();
                    getData();
                }
            });
        });
    });
}

window.onload = function(){
    this.getData();
}

function getData(){
     firebase.database().ref('blogs/').once('value').then(function(snapshot){
        let posts_div = document.querySelector('#posts');
        posts.innerHTML = "";
        let data = snapshot.val();
        console.log(data);

        for(let[key,value] of Object.entries(data)){
            posts_div.innerHTML="<div class='col-sm-4 mt-2 mb-1'>"+"<div class='card'>"+"<img src='"+value.imageURL+"' style='height:250px;'>"+"<div class='card-body'><p class='card-text'>"+value.text+"</p>"+"<button class='btn btn-danger' id='"+key+"' onclick='delete_post(this.id)'>Delete</button>"+"</div></div></div>"+posts_div.innerHTML;
        }
       
    });
}

function delete_post(key){
    firebase.database().ref('blogs/'+key).remove();
    getData();
}