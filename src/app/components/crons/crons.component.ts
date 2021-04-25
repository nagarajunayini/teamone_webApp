import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmitterService } from 'src/app/shared/emitter.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { UtilityService } from 'src/app/shared/utility.service';
import { IfStmt } from '@angular/compiler';

@Component({
  selector: 'app-crons',
  templateUrl: './crons.component.html',
  styleUrls: ['./crons.component.scss']
})
export class CronsComponent implements OnInit {
  goldmebershipPoints;
  creditsAndPoints = {};
  rules:any={};
  constructor(private route: Router, private emitter: EmitterService, private db: AngularFirestore, private utilityService: UtilityService) { }

  ngOnInit(): void {
    this.db.collection("creditsandpoints").get().subscribe(snaphsot => {
      snaphsot.forEach(doc => {
        this.creditsAndPoints = doc.data();
        this.goldmebershipPoints = doc.data().goldMembership
      })
    })
    this.db.collection("rules").get().subscribe(snaphsot=>{
      snaphsot.forEach(doc=>{
        this.rules= doc.data();
      })
    })
  }


  //Start post expiry and winner list 
  anounceWinner(){
    this.getlastWeekPostDetails();
  }
   getlastWeekPostDetails() {
    var currentDate = new Date();
    var time = currentDate.setHours(currentDate.getHours()-10);
    let finalDate = new Date(time);
    this.db.collection('userPosts', ref => ref
    .where('postStatus','==','verified')
      .where('timestamp', '<', finalDate)
    ).get().subscribe((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        if(doc.data().postStatus=="verified"){
          console.log(doc.data().postId);
          console.log("setp1 >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
          this.getPostPoolingAmount(doc.data().ownerId,doc.data(),doc.data().postId);
        }
      })
    })
  }
  getPostPoolingAmount(postOwnerid,document,documentId){
    this.db.collection("poolAmount").doc(documentId).get().subscribe((doc) => {
      if(doc.exists){
        console.log("setp2 pooling Amount >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")

        this.updatePost(document,documentId,doc.data().postAmount);
      }  
   });
  }
  updatePost(document,documentId,postValue){
    this.db.doc("userPosts/" + documentId).update({
      "postStatus": "expired",
    });
    let likes=[];
    let disLikes =[];
    for (const [key, value] of Object.entries(document.likes)) {
      if(value==true){
        likes.push(key)
      }
    }
    for (const [key, value] of Object.entries(document.disLikes)) {
      if(value==true){
        disLikes.push(key)
      }
    }

    if(likes.length == disLikes.length){
      console.log("setp3 nuetral >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")


      var temaOneCommission = (this.rules ['teamOneCommission'] *postValue)/100;
      var postOwnerWinningPoints =  (this.rules ['postOwner'] *postValue)/100;
      var remaingingPoints = postValue - temaOneCommission - postOwnerWinningPoints;
      var finalTemOneAmount = remaingingPoints + temaOneCommission
      this.updateTeamOneWallet(finalTemOneAmount);
      this.updatePostUserWallet("nuetral",document.ownerId,postOwnerWinningPoints)

    }if( likes.length > disLikes.length){
      console.log("setp3 likes >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")

      var temaOneCommission = (this.rules ['teamOneCommission'] *postValue)/100;
      var postOwnerWinningPoints =  (this.rules ['postOwner'] *postValue)/100;
      var remaingingPoints = postValue - temaOneCommission - postOwnerWinningPoints;
      var eachUserPoint = Math.round(remaingingPoints/likes.length);
      this.updateTeamOneWallet(temaOneCommission);
      this.updatePostUserWallet("win",document.ownerId,postOwnerWinningPoints)
      likes.forEach(id=>{
        this.updateUserWallet(id,"Likers",eachUserPoint);
      })
    }if(likes.length < disLikes.length){
      console.log("setp4 dislikes >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")

      var temaOneCommission = (this.rules ['teamOneCommission'] *postValue)/100;
      var postOwnerWinningPoints =  (this.rules ['postOwner'] *postValue)/100;
      var remaingingPoints = postValue - temaOneCommission - postOwnerWinningPoints;
      var eachUserPoint = Math.round(remaingingPoints/disLikes.length);
      this.updateTeamOneWallet(temaOneCommission);
      // this.updatePostUserWallet("win",document.ownerId,postOwnerWinningPoints)
      disLikes.forEach(id=>{
        this.updateUserWallet(id,"disLikers",postValue);
      })
    }
  
  }
  
  updatePostUserWallet(status,ownerId,postValue){

    this.db.collection("users").doc(ownerId).get().subscribe((doc) => {
      if(doc.exists){
        console.log("setp4 post user wallet  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", ownerId)
        console.log(doc.data().referralPoints,"doc.data().referralPoints")
        var points = postValue + doc.data().referralPoints;
        this.db.doc("users/" + ownerId).update({
          "referralPoints": points
        });
      }  
   });
  }

  updateTeamOneWallet(winAmount){ 
    // this.db.collection("teamoneWallet").get().subscribe(snaphsot=>{
    //   snaphsot.forEach(doc=>{
    //     this.rules= doc.data();
    //     this.db.doc('teamoneWallet'+doc.data().userId).update({
    //       "walletAmount":doc.data().walletAmount + winAmount,
    //       "userId":doc.data().userId
    //     })
    //   })
    // })
  }

  updateUserWallet(ownerId,winnerList,postValue) {
    console.log("ownerId",ownerId)
    console.log(winnerList,"winnerList")
    this.db.collection("users").doc(ownerId).get().subscribe((doc) => {
      if(doc.exists){
        var points = postValue+ doc.data().referralPoints;
        this.db.doc("users/" + ownerId).update({
          "referralPoints": points
        });
      }  
   });
  }

  // end anounce post expiry and winners list
 

  // start for assigning badges to the users based on likes and comments
 
  getInfluencers(){
    let userLikesAndComments = []
    var prevMonday = new Date();
    prevMonday.setDate(prevMonday.getDate() - (prevMonday.getDay() + 6) % 7);
    this.db.collection('userPosts', ref => ref
      .where('timestamp', '<', new Date())
      .where('timestamp', '>', prevMonday)
    ).get().subscribe((querySnapshot) => {
        var groupByOwner = {};
        querySnapshot.forEach((doc) => {
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
        var values = []
        values = Object.values(groupByOwner);
        console.log(values,"values")
        values.forEach((data, i) => {
          userLikesAndComments=[];
          data.forEach(element => {
            var noOfLikesAndComments = Object.keys(element.comments).length + Object.keys(element.likes).length;
            userLikesAndComments.push(noOfLikesAndComments)
          })
          console.log("#################################")
          var maxNoOfCommentsAndLikes = Math.max(...userLikesAndComments);
          console.log(maxNoOfCommentsAndLikes, "maxNoOfCommentsAndLikes")
          console.log("*********************************")
          if (maxNoOfCommentsAndLikes >= this.creditsAndPoints['oneStarUser']) {
            this.updateUser(data[i].ownerId, "1");
          }else if (maxNoOfCommentsAndLikes >= this.creditsAndPoints['twoStarUser']) {
            this.updateUser(data[i].ownerId, "2");
          } else if (maxNoOfCommentsAndLikes >= this.creditsAndPoints['threeStarUser']) {
            this.updateUser(data[i].ownerId, "3");
          }else if (maxNoOfCommentsAndLikes >= this.creditsAndPoints['fourStarUser']) {
            this.updateUser(data[i].ownerId, "4");
          }else if (maxNoOfCommentsAndLikes >= this.creditsAndPoints['fiveStarUser']) {
            this.updateUser(data[i].ownerId, "5");
            this.currentWeekInfluences(data[i].ownerId, Object.keys(data[i].comments).length, Object.keys(data[i].likes).length);
          }else {
            this.updateUser(data[i].ownerId, "0");
          }
        })
    
    })

  }
  updateUser(ownerId, credits) {
    this.db.doc("users/" + ownerId).update({
      "credits": credits
    });
  }
  currentWeekInfluences(userId, comments, likes) {
    console.log(userId)
    const userDocument = this.db.collection("users").doc(userId);
    userDocument.get().subscribe((doc) => {
      const result = doc.exists ? doc.data() : null;
      console.log(result);
      this.db.collection("currentWeekInfluencers").add({
        id: result.id,
        photoUrl: result.photoUrl,
        email: result.email,
        displayName: result.displayName,
        credits: "1",
        referralPoints: result.referralPoints,
        timestamp: new Date(),
        username: result.username,
        reason: likes + " likes " + comments + " comments"
      })
      this.db.collection("influencers").add({
        id: result.id,
        photoUrl: result.photoUrl,
        email: result.email,
        displayName: result.displayName,
        credits: "1",
        referralPoints: result.referralPoints,
        timestamp: new Date(),
        username: result.username,
        reason: likes + " likes " + comments + " comments"
      })
    });
  }

  // end assign badges
  
}
