import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Router } from '@angular/router';
import { EmitterService } from 'src/app/shared/emitter.service';
import { finalize } from 'rxjs/operators'
import * as uuid from 'uuid';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-create-contest',
  templateUrl: './create-contest.component.html',
  styleUrls: ['./create-contest.component.scss']
})
export class CreateContestComponent implements OnInit {
 
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
       this.db.collection('Contests').get().subscribe((querySnapshot)=> {
         querySnapshot.forEach((doc)=> {
             if(doc.data().contestStatus == 'verified'){
               this.getImage(doc.data())
             } 
         });
     }); 
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
     createContest(){
       var contestId = uuid();
       if(this.imgURL!=null || this.postDescription !=""){
         if(this.imgURL!=null && this.imgURL!==""){
           this.uploadImage(this.imgURL,contestId);
         }else{
         this.uploadPost("",contestId)
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
   uploadImage(imageFile,contestId) {
    const filePath = `${"post"}_${contestId}_${'.jpg'}`;
    const fileRef = this.storage.ref(filePath);
    var url=""
       this.storage.upload(filePath,this.selectedImage).snapshotChanges().pipe(
         finalize(()=>{
           fileRef.getDownloadURL().subscribe(url=>[
             this.uploadPost(url,contestId)
           
           ])
         })
       ).subscribe()
     }
   
     uploadPost(url,contestId){
       this.imgURL=null;
       this.db.collection("Contests").doc(contestId).set(
         {
          "contestId": contestId,
          "ownerId": this.userId,
          "username": "nagaraju",
          "mediaUrl": url,
          "description": this.postDescription,
          "location": "hyd india",
          "timestamp": new Date(),
          "contestStatus":"verified",
          "likes": {},
          "disLikes":{},
          "comments":{},
          "contestType":"",
          "contestExpired":false,
          "contestExpiredIn":7
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
