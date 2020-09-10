import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  registrationDetails:any=[];
  loginUser:any;
  userName:any;
  getAllUsers=[]
  isLoggedIn=false;
  constructor() { }
}
