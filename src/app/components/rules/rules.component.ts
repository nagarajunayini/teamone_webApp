import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-rules',
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.scss']
})
export class RulesComponent implements OnInit {
  documentId="";
  nomralUser="0"
  oneStarUser="0"
  twoStarUser="0"
  threeStarUser="0";
  fourStarUser="0"
  fiveStarUser="0"
  nomralUserPostDeduction="0"
  oneStarUserPostDeduction="0"
  twoStarUserPostDeduction="0"
  threeStarUserPostDeduction="0";
  fourStarUserPostDeduction="0"
  fiveStarUserPostDeduction="0";
  teamOneCommission="10"
  postOwner="50";
  postReactUsers="40";
  postexpiryHours="23";
  rules={}
  constructor(private db: AngularFirestore) { }

  ngOnInit(): void {
    this.getRules(); 
  }
  getRules(){
    this.db.collection("rules").get().subscribe(snaphsot=>{
      snaphsot.forEach(doc=>{
      console.log(doc.id)
      this.documentId=doc.id
     this.rules= doc.data();
     console.log(this.rules)
      this.nomralUser= doc.data().nomralUser
     this.oneStarUser= doc.data().oneStarUser
     this.twoStarUser= doc.data().twoStarUser
    this.threeStarUser= doc.data().threeStarUser
    this.fourStarUser= doc.data().fourStarUser
    this.fiveStarUser= doc.data().fiveStarUser
    this.nomralUserPostDeduction= doc.data().nomralUserPostDeduction
     this.oneStarUserPostDeduction= doc.data().oneStarUserPostDeduction
    this.twoStarUserPostDeduction= doc.data().twoStarUserPostDeduction
    this.threeStarUserPostDeduction= doc.data().threeStarUserPostDeduction
    this.fourStarUserPostDeduction= doc.data().fourStarUserPostDeduction
    this.fiveStarUserPostDeduction= doc.data().fiveStarUserPostDeduction
    this.postexpiryHours = doc.data().postexpiryHours;
    this.postOwner = doc.data().postOwner;
    this.teamOneCommission = doc.data().teamOneCommission;
    this.postReactUsers = doc.data().postReactUsers;
      })
    })
  }
  updateRules(){
    this.rules['nomralUser'] =parseInt(this.nomralUser);
    this.rules['oneStarUser'] = parseInt(this.oneStarUser);
    this.rules['twoStarUser'] =parseInt(this.twoStarUser);
    this.rules['threeStarUser'] =parseInt(this.threeStarUser);
    this.rules['fourStarUser'] =parseInt(this.fourStarUser);
    this.rules['fiveStarUser'] =parseInt(this.fiveStarUser);
    this.rules['nomralUserPostDeduction'] =parseInt(this.nomralUserPostDeduction);
    this.rules['oneStarUserPostDeduction'] = parseInt(this.oneStarUserPostDeduction);
    this.rules['twoStarUserPostDeduction'] =parseInt(this.twoStarUserPostDeduction);
    this.rules['threeStarUserPostDeduction'] =parseInt(this.threeStarUserPostDeduction);
    this.rules['fourStarUserPostDeduction'] =parseInt(this.fourStarUserPostDeduction);
    this.rules['fiveStarUserPostDeduction'] =parseInt(this.fiveStarUserPostDeduction);
    this.rules['teamOneCommission']= this.rules['teamOneCommission'];
    this.rules['applyType']=this.rules['applyType'];//percent/facor
    this.rules['multificationFactor']=this.rules['multificationFactor'];
    this.rules['mulificationpercentage']=this.rules['mulificationpercentage'];
    this.rules['postexpiryHours']=parseInt(this.postexpiryHours);
    this.rules['postOwner']=parseInt(this.postOwner);
    this.rules['postReactUsers']=parseInt(this.postReactUsers);
    this.db.collection('rules').doc(this.documentId).set(this.rules);

    Swal.fire({
      title: 'Success!',
      text: 'Updated successfully',
      icon: 'success',
      confirmButtonText: 'OK'
    })
    this.getRules()
  }
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }

}
