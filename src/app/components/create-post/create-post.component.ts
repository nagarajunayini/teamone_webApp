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
  selectedCategories=["All"];
  postIds:any=[]
  selectedImage:any;
  categoreis=[];
  selectedCategory="";
  rules={};
  selectedPostValue;
  selectedPostDeductionValue;
  postValues=[];
  constructor( private route: Router, private emitter: EmitterService, private db: AngularFirestore, private http:HttpClient, private storage: AngularFireStorage) { 
    this.emitter.login.emit("xxxx") 
  
   }

  ngOnInit(): void {
    this.getCategories();
    this.getUserPosts();
    this.getRules();
  }
  getRules(){
    this.db.collection("rules").get().subscribe(snaphsot=>{
      snaphsot.forEach(doc=>{
        this.postValues=[
          {
          "postValue":doc.data().nomralUser,"postDeductionValue":doc.data().nomralUserPostDeduction
        },
        {
          "postValue":doc.data().oneStarUser,"postDeductionValue":doc.data().oneStarUserPostDeduction
        },
        {
          "postValue":doc.data().twoStarUser,"postDeductionValue":doc.data().twoStarUserPostDeduction
        },
        {
          "postValue":doc.data().threeStarUser,"postDeductionValue":doc.data().threeStarUserPostDeduction
        },
        {
          "postValue":doc.data().fourStarUser,"postDeductionValue":doc.data().fourStarUserPostDeduction
        },
        {
          "postValue":doc.data().fiveStarUser,"postDeductionValue":doc.data().fiveStarUserPostDeduction
        }
      ]
      })
    })
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
getCategories(){
  this.db.collection('categories').get().subscribe((querySnapshot)=> {
    querySnapshot.forEach((doc)=> {
        this.categoreis= doc.data().categories;
        console.log(this.categoreis)
    });
}); 
}
selectedValue(x){
if(x=="All"){
  if(this.selectedCategories.indexOf(x)!=-1){
    this.selectedCategories=[];
  }else{
    this.selectedCategories=[];
    this.selectedCategories.push(x)
  }
}else{
  if(this.selectedCategories.indexOf('All')!=-1){
    this.selectedCategories.splice(this.selectedCategories.indexOf('All'), 1);
  }
  if(this.selectedCategories.indexOf(x)!=-1){
    var index = this.selectedCategories.indexOf(x);
    this.selectedCategories.splice(index, 1);
  }else{
    this.selectedCategories.push(x)
  }
}
console.log(this.selectedCategories);
}
choosepostValue(post){
  this.selectedPostValue=post.postValue;
  this.selectedPostDeductionValue=post.postDeductionValue;
}

  getImage(data){
    this.db.collection("users").doc(data.ownerId).get().subscribe((doc) => {
      if(doc.exists){
        data['username']=doc.data().username;
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
    if(this.selectedPostValue!=undefined){
      if(this.imgURL!=null || this.postDescription !=""){
        if(this.imgURL!=null && this.imgURL!==""){
          this.uploadImage(this.imgURL,postId,"image");
        }else{
        this.uploadPost("",postId,"")
        }
      }else{
        Swal.fire({
          title: 'Alert',
          text: 'Please fill all fields',
          icon: 'warning',
          confirmButtonText: 'OK'
        })
      }
    }else{
      alert("Please choose post value")
    }
    

  }
uploadImage(imageFile,postId,image) {
 const filePath = `${"post"}_${postId}_${'.jpg'}`;
 const fileRef = this.storage.ref(filePath);
 var url=""
    this.storage.upload(filePath,this.selectedImage).snapshotChanges().pipe(
      finalize(()=>{
        fileRef.getDownloadURL().subscribe(url=>[
          this.uploadPost(url,postId,image)
        ])
      })
    ).subscribe()
  }

  uploadPost(url,postId,image){
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
        "postValue":this.selectedPostValue,
        "postDeductionValue":this.selectedPostDeductionValue,
        "noComments":{},
        "disLikes":{},
        "comments":{},
        "postType":image,
        "postCategory":this.selectedCategories.length==0?['All']:this.selectedCategories
      }
     
    )
    this.addDebitedAmountToPostPoolingAmount(this.selectedPostValue,postId)

    
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
  addDebitedAmountToPostPoolingAmount(userPostdeductionValue, postId) {
    this.db.collection("poolAmount")
        .doc(postId)
        .set({"postAmount": userPostdeductionValue, "postId": postId});
  }
}
