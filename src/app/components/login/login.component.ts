import { Component, OnInit } from '@angular/core';
import { UtilityService } from 'src/app/shared/utility.service';
import { Router } from '@angular/router';
import { EmitterService } from 'src/app/shared/emitter.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  userName="";
  password="";
  registeredUsers:any=[]
  constructor(private util:UtilityService, private route: Router, private emitter:EmitterService) { }
  ngOnInit() {
    this.emitter.login.emit("loginPage");
    
  }
  login(userName,pwd){
  //  this.endPoint.getAllRegisterUsers().subscribe(resp=>{
     this.registeredUsers= [{"email":"nagaraju","password":"123456"}];
     let flag= false;
     this.registeredUsers.forEach(element => {
      console.log(userName,pwd)
     
      if(element.email ==userName && element.password==pwd){ 
        flag=true
        this.util.userName=element.firstName;
        console.log("login",this.util.userName,element.firstName)
        this.emitter.userName.emit(element.firstName)
        
        this.route.navigate(['/createpost'])
        this.util.isLoggedIn=true;
      }
     
      
    });
    if(!flag){
     alert("Please enter valid details");
     this.util.isLoggedIn=false;
    }

  //  })
   
  }
}
