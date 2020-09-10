import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmitterService } from 'src/app/shared/emitter.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { AngularFireStorage } from '@angular/fire/storage'
import { finalize } from 'rxjs/operators'
import * as uuid from 'uuid';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss']
})
export class CreatePostComponent implements OnInit {
  postDescription="";
  posts=[]
  postIds:any=[]
  selectedImage:any;
  constructor( private route: Router, private emitter: EmitterService, private db: AngularFirestore, private http:HttpClient, private storage: AngularFireStorage) { 
    this.emitter.login.emit("xxxx") 
  
   }

  ngOnInit(): void {
    this.getUserPosts();
  }
  getUserPosts(){
    this.db.collection('userPosts').get().subscribe((querySnapshot)=> {
      querySnapshot.forEach((doc)=> {
          if(doc.data().postStatus == 'verified'){
            this.getImage(doc.data())
          } 
      });
  }); 
}

  getImage(data){
    this.db.collection("users").doc(data.ownerId).get().subscribe((doc) => {
      if(doc.exists){
       data['userPhoto']=doc.data().photoUrl
       this.posts.push(data)
       this.posts= this.posts.sort(function(x, y){
        return y.timestamp - x.timestamp;
    })
      }  
   });      
}
  public imagePath;
  userId="104011745619806363479";
  imgURL: any;
  public message: string;
 
  preview(files) {
    if (files.length === 0)
      return;
    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.message = "Only images are supported.";
      return;
    }
    var reader = new FileReader();
    this.imagePath = files;
    this.selectedImage=files[0];
    reader.readAsDataURL(files[0]); 
    reader.onload = (_event) => { 
      this.imgURL = reader.result; 
    }
  }
  createPost(){
    var postId = uuid();
    if(this.imgURL!=null || this.postDescription !=""){
      if(this.imgURL!=null && this.imgURL!==""){
        this.uploadImage(this.imgURL,postId);
      }else{
      this.uploadPost("",postId)
      }
    }else{
      Swal.fire({
        title: 'Alert',
        text: 'Please fill all fields',
        icon: 'warning',
        confirmButtonText: 'OK'
      })
    }

  }
uploadImage(imageFile,postId) {
 const filePath = `${"post"}_${postId}_${'.jpg'}`;
 const fileRef = this.storage.ref(filePath);
 var url=""
    this.storage.upload(filePath,this.selectedImage).snapshotChanges().pipe(
      finalize(()=>{
        fileRef.getDownloadURL().subscribe(url=>[
          this.uploadPost(url,postId)
        
        ])
      })
    ).subscribe()
  }

  uploadPost(url,postId){
    this.imgURL=null;
    this.db.collection("userPosts").doc(postId).set(
      {
        "postId": postId,
        "ownerId": this.userId,
        "username": "nagaraju",
        "mediaUrl": url,
        "description": this.postDescription,
        "location": "hyd india",
        "timestamp": new Date(),
        "postStatus":"verified",
        "userPhote":"https://lh3.googleusercontent.com/a-/AOh14GjXXp_duWBSrHY3Tu4c7cVbPUGqYEAELKXsv62s=s96-c",
        "likes": {},
        "disLikes":{},
        "comments":{}
      }
     
    )
    setTimeout(function(){ 
      this.posts=[]
      this.getUserPosts(); }.bind(this), 3000);

    Swal.fire({
      title: 'Approved',
      text: 'Approved successfully',
      icon: 'success',
      confirmButtonText: 'OK'
    }) 
  }
}
