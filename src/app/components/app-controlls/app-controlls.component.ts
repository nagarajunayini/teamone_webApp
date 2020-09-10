import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import Swal from 'sweetalert2'
@Component({
  selector: 'app-app-controlls',
  templateUrl: './app-controlls.component.html',
  styleUrls: ['./app-controlls.component.scss']
})
export class AppControllsComponent implements OnInit {
  signUpPoints=10;
  silverPoints;
  bronzePoints;
  rcPoints;
  goldmebershipPoints;
  goldPoints;
  documentId;
  creditsAndPoints={}
  constructor(private db: AngularFirestore) { }

  ngOnInit(): void {
    this.getCreditsAndPoints();
  }
  update(){
    this.creditsAndPoints['bronzePoints'] =this.bronzePoints;
    this.creditsAndPoints['goldMembership'] = this.goldmebershipPoints;
    this.creditsAndPoints['goldPoints'] =this.goldPoints;
    this.creditsAndPoints['rcship'] =this.rcPoints;
    this.creditsAndPoints['signupPoints'] =this.signUpPoints;
    this.creditsAndPoints['silverPoints'] =this.silverPoints;
    this.db.collection('creditsandpoints').doc(this.documentId).set(this.creditsAndPoints);
    Swal.fire({
      title: 'Success!',
      text: 'Updated successfully',
      icon: 'success',
      confirmButtonText: 'OK'
    })
    this.getCreditsAndPoints()
  }

  getCreditsAndPoints(){
    this.db.collection("creditsandpoints").get().subscribe(snaphsot=>{
      snaphsot.forEach(doc=>{
        console.log(doc.id)
        this.documentId=doc.id
        this.creditsAndPoints= doc.data();
       this.bronzePoints = doc.data().bronzePoints
        this.goldmebershipPoints= doc.data().goldMembership
        this.goldPoints= doc.data().goldPoints
        this.rcPoints= doc.data().rcship
        this.signUpPoints= doc.data().signupPoints
        this.silverPoints= doc.data().silverPoints
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
