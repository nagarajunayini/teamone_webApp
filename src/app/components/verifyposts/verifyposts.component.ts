import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmitterService } from 'src/app/shared/emitter.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Posts } from '../post';
import { UtilityService } from 'src/app/shared/utility.service';
import Swal from 'sweetalert2'
import { element } from 'protractor';
@Component({
  selector: 'app-verifyposts',
  templateUrl: './verifyposts.component.html',
  styleUrls: ['./verifyposts.component.scss']
})
export class VerifypostsComponent implements OnInit {
  posts=[];
  goldmebershipPoints;
  creditsAndPoints={};
  postIds:any=[]
  constructor( private route: Router, private emitter: EmitterService, private db: AngularFirestore,private UtilityService: UtilityService) { 
    this.emitter.login.emit("xxxx") 
  
   }

  ngOnInit() {
    this.getUserPosts();
    this.db.collection("creditsandpoints").get().subscribe(snaphsot=>{
      snaphsot.forEach(doc=>{
        console.log(doc.id)
        this.creditsAndPoints= doc.data();
        this.goldmebershipPoints= doc.data().goldMembership
      })
    })

  }
  getUserPosts(){
    this.db.collection('userPosts').get().subscribe((querySnapshot)=> {
      querySnapshot.forEach((doc)=> {
          if(doc.data().postStatus == 'pending'){
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
      return x.timestamp - y.timestamp;
  })
   }
    
});
     
}
getUserPosts1(){ 
  let userLikesAndComments=[]
  this.db.collection('userPosts').get().subscribe((querySnapshot)=> {
    var groupByOwner = {};
    querySnapshot.forEach((doc)=> {
      groupByOwner[doc.data().ownerId] = groupByOwner[doc.data().ownerId] || [];
      groupByOwner[doc.data().ownerId].push({ 
        comments: doc.data().comments,
        description: doc.data().description,
        likes: doc.data().likes,
        location: doc.data().location,
        mediaUrl: doc.data().mediaUrl,
        ownerId: doc.data().ownerId,
        postId: doc.data().postId,
        postStatus: doc.data().postStatus,
        timestamp: doc.data().timestamp,
        username: doc.data().username   
       });
    });
    var values=[] 
    values=Object.values(groupByOwner);
    values.forEach((data,i)=>{
      data.forEach(element=>{
        var noOfLikesAndComments= Object.keys(element.comments).length + Object.keys(element.likes).length;
         userLikesAndComments.push(noOfLikesAndComments)
      })
      console.log("#################################")
      var maxNoOfCommentsAndLikes = Math.max(...userLikesAndComments);
      console.log(maxNoOfCommentsAndLikes,"maxNoOfCommentsAndLikes")
      console.log("*********************************")
      if(maxNoOfCommentsAndLikes >= 1){
        this.updateUser(data[i].ownerId,"1");
        this.currentWeekInfluences(data[i].ownerId,Object.keys(data[i].comments).length,Object.keys(data[i].likes).length)

       }
       else if(maxNoOfCommentsAndLikes >= this.creditsAndPoints['silverPoints']){
        this.updateUser(data[i].ownerId,"2");
       }
       else if(maxNoOfCommentsAndLikes >= this.creditsAndPoints['bronzePoints']){
        this.updateUser(data[i].ownerId,"3");
       }
       else{
        this.updateUser(data[i].ownerId,"0");
       }
    })
    console.log("groupByType", Object.values(groupByOwner));

}); 
}
acceptOrReject(postDetails,actionStatus){
  postDetails.postStatus=actionStatus;
  this.db.collection('userPosts').doc(postDetails.postId).set(postDetails);
  this.posts=[]
  if(actionStatus=="rejected"){
    Swal.fire({
      title: 'Rejected',
      text: 'Rejected successfully',
      icon: 'success',
      confirmButtonText: 'OK'
    })
  }else{
    Swal.fire({
      title: 'Approved',
      text: 'Approved successfully',
      icon: 'success',
      confirmButtonText: 'OK'
    })

  }
  this.getUserPosts();
}
updateUser(ownerId,credits){
  if(credits =="1"){
    this.db.doc("users/"+ownerId).update({
      "credits":credits,
      "referralPoints":this.goldmebershipPoints
      
    });
  }else{
    this.db.doc("users/"+ownerId).update({
      "credits":credits
    });
  }
  
}

getinfluencers(){
  this.getUserPosts1();
}
currentWeekInfluences(userId,comments,likes){
  console.log(userId)
  const userDocument = this.db.collection("users").doc(userId);
     userDocument.get().subscribe((doc) => {
         const result = doc.exists ? doc.data(): null;
         console.log(result);
    this.db.collection("currentWeekInfluencers").add({
    id:result.id,
    photoUrl:result.photoUrl,
    email:result.email,
    displayName:result.displayName,
    credits:"1",
    referralPoints:result.referralPoints,
    timestamp:new Date(),
    username:result.username,
    reason: likes + " likes "+comments+" comments" 
  })
  this.db.collection("influencers").add({
    id:result.id,
    photoUrl:result.photoUrl,
    email:result.email,
    displayName:result.displayName,
    credits:"1",
    referralPoints:result.referralPoints,
    timestamp:new Date(),
    username:result.username,
    reason: likes + " likes "+comments+" comments"
  })
    });
}
}
