import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import Swal from 'sweetalert2'
@Component({
  selector: 'app-app-controlls',
  templateUrl: './app-controlls.component.html',
  styleUrls: ['./app-controlls.component.scss']
})
export class AppControllsComponent implements OnInit {
  signUpPoints="10";
  oneStarUser="0";
  twoStarUser="0";
  threeStarUser="0";
  fourStarUser="0";
  fiveStarUser="0";
  rcPoints="0";
  referalPoints="10";
  documentId;
  creditsAndPoints={}
  constructor(private db: AngularFirestore) { }

  ngOnInit(): void {
    this.getCreditsAndPoints();
  }
  update(){
    this.creditsAndPoints['referalPoints'] = parseInt(this.referalPoints);
    this.creditsAndPoints['rcship'] = parseInt(this.rcPoints);
    this.creditsAndPoints['signupPoints'] =parseInt(this.signUpPoints);
    this.creditsAndPoints['oneStarUser'] =parseInt(this.oneStarUser);
    this.creditsAndPoints['twoStarUser'] =parseInt(this.twoStarUser);
    this.creditsAndPoints['threeStarUser'] =parseInt(this.threeStarUser);
    this.creditsAndPoints['fourStarUser'] =parseInt(this.fourStarUser);
    this.creditsAndPoints['fiveStarUser'] =parseInt(this.fiveStarUser);

    this.db.collection('userLevels').doc(this.documentId).set(this.creditsAndPoints);
    Swal.fire({
      title: 'Success!',
      text: 'Updated successfully',
      icon: 'success',
      confirmButtonText: 'OK'
    })
    this.getCreditsAndPoints()
  }

  getCreditsAndPoints(){
    this.db.collection("userLevels").get().subscribe(snaphsot=>{
      snaphsot.forEach(doc=>{
        console.log(doc.id)
        this.documentId=doc.id
        this.creditsAndPoints= doc.data();
        this.oneStarUser = doc.data().oneStarUser
        this.twoStarUser= doc.data().twoStarUser
        this.threeStarUser= doc.data().threeStarUser
        this.fourStarUser= doc.data().fourStarUser
        this.fiveStarUser= doc.data().fiveStarUser
        this.rcPoints= doc.data().rcship
        this.signUpPoints= doc.data().signupPoints;
        this.referalPoints = doc.data().referalPoints
      })
    })
  }
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }

}
