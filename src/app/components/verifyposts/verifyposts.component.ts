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
  posts = [];
  goldmebershipPoints;
  creditsAndPoints = {};
  postIds: any = []
  constructor(private route: Router, private emitter: EmitterService, private db: AngularFirestore, private UtilityService: UtilityService) {
    this.emitter.login.emit("xxxx")

  }

  ngOnInit() {
    this.getUserPosts();
  }
  getUserPosts() {
    this.db.collection('userPosts').get().subscribe((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        if (doc.data().postStatus == 'pending') {
          this.getImage(doc.data())
        }
      });
    });
  }
  getImage(data) {
    this.db.collection("users").doc(data.ownerId).get().subscribe((doc) => {
      if (doc.exists) {
        data['username'] = doc.data().username;
        data['userPhoto'] = doc.data().photoUrl
        this.posts.push(data)
        this.posts = this.posts.sort(function (x, y) {
          return x.timestamp - y.timestamp;
        })
      }
    });

  }
 
  acceptOrReject(postDetails, actionStatus) {
    postDetails.postStatus = actionStatus;
    this.db.collection('userPosts').doc(postDetails.postId).set(postDetails);
    this.posts = []
    if (actionStatus == "rejected") {
      this.updatePostUserWallet(postDetails.ownerId,postDetails.postValue)
      Swal.fire({
        title: 'Rejected',
        text: 'Rejected successfully',
        icon: 'success',
        confirmButtonText: 'OK'
      })
    } else {
      Swal.fire({
        title: 'Approved',
        text: 'Approved successfully',
        icon: 'success',
        confirmButtonText: 'OK'
      })

    }
    this.getUserPosts();
  }
  updatePostUserWallet(ownerId,postValue){
    this.db.collection("users").doc(ownerId).get().subscribe((doc) => {
      if(doc.exists){
        console.log(doc.data().referralPoints,"doc.data().referralPoints")
        var points = postValue + doc.data().referralPoints;
        this.db.doc("users/" + ownerId).update({
          "referralPoints": points
        });
      }  
   });
  }
  
}
