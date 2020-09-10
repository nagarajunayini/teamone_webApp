import { Component } from '@angular/core';
import { UtilityService } from './shared/utility.service';
import { EmitterService } from './shared/emitter.service';
import { Router } from '@angular/router';
import { AngularFirestore} from '@angular/fire/firestore'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'modulator';
  loggedIn=""
  value="";
  showDiv=false;
  dataaaa= true;
  selectedTheme=1;
  value1=true
  value2=false
  value3=false
  dataaaa1='Theme1'
  slectedTheme="Theme1"
  opened: boolean = false;
  showSidebar=true;
  showFullsreen=true
  showtoolTip=false;
  showtoolTipUser=false;
  showtoolTipUser1=false;
  constructor(private util:UtilityService, private emitter:EmitterService, private router: Router,private db: AngularFirestore){
this.emitter.login.subscribe(value=>{
  this.loggedIn=value;

})
this.emitter.userName.subscribe(value=>{ 
  this.value=value;

})
 
this.value= this.util.userName;



this.router.navigate(['/login']);
var toggler = document.getElementsByClassName("caret");
var i;

for (i = 0; i < toggler.length; i++) {
  toggler[i].addEventListener("click", function() {
    this.parentElement.querySelector(".nested").classList.toggle("active");
    this.classList.toggle("caret-down");
  });
}
  }

  changeTeme(){
    // console.log(typeof value)
    // if(value==1){
    //   console.log(value)
    //   this.value1=true;
    //   this.value2=false;
    //   this.value3=false;
    // }
    // if(value==2){
    //   this.value1=false;
    //   this.value2=true;
    //   this.value3=false;
    // }
    // if(value==3){
    //   this.value1=false;
    //   this.value2=false;
    //   this.value3=true;
    // }
    this.dataaaa =!this.dataaaa;
    // this.emitter.theme.emit(this.dataaaa)
    }
    onChange(value){
      this.dataaaa1 = value;
      this.emitter.theme.emit(this.dataaaa1)
    }
    private _toggleSidebar() {
      this.opened = !this.opened;
    }
    collapseSide(){
      this.showSidebar = ! this.showSidebar
    }
    fullScreen() {
      this.showFullsreen=false;
      let elem = document.documentElement;
      let methodToBeInvoked = elem.requestFullscreen ||
        elem['webkitRequestFullScreen'] || elem['mozRequestFullscreen']
        ||
        elem['msRequestFullscreen'];
      if (methodToBeInvoked) methodToBeInvoked.call(elem);
  }
  closeFullscreen() {
    this.showFullsreen=true;
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document['mozCancelFullScreen']) { /* Firefox */
      document['mozCancelFullScreen']();
    } else if (document['webkitExitFullscreen']) { /* Chrome, Safari and Opera */
      document['webkitExitFullscreen']();
    } else if (document['msExitFullscreen']) { /* IE/Edge */
      document['msExitFullscreen']();
    }
  }
  //   if (this.document.exitFullscreen) {
  //     this.document.exitFullscreen();
  //   } else if (this.document.mozCancelFullScreen) {
  //     /* Firefox */
  //     this.document.mozCancelFullScreen();
  //   } else if (this.document.webkitExitFullscreen) {
  //     /* Chrome, Safari and Opera */
  //     this.document.webkitExitFullscreen();
  //   } else if (this.document.msExitFullscreen) {
  //     /* IE/Edge */
  //     this.document.msExitFullscreen();
  //   }
  // }
  clickUser(){
    this.showtoolTip=!this.showtoolTip;
    this.showtoolTipUser1=false;
  }
  clickUser1(){
    this.showtoolTipUser=!this.showtoolTipUser;
    this.showtoolTipUser1=false
    this.showtoolTip=false;
  }
  clickUser2(){
    this.showtoolTipUser1=!this.showtoolTipUser1;
    this.showtoolTipUser=false;
    this.showtoolTip=false;
  }
   inspect(e) {
      document.addEventListener("contextmenu", function(e){
        e.preventDefault();
      }, false);
      document.addEventListener("keydown", function(e) {
      //document.onkeydown = function(e) {
        // "I" key
        if (e.ctrlKey && e.shiftKey && e.keyCode == 73) {
          disabledEvent(e);
        }
        // "J" key
        if (e.ctrlKey && e.shiftKey && e.keyCode == 74) {
          disabledEvent(e);
        }
        // "S" key + macOS
        if (e.keyCode == 83 && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) {
          disabledEvent(e);
        }
        // "U" key
        if (e.ctrlKey && e.keyCode == 85) {
          disabledEvent(e);
        }
      }, false);
      function disabledEvent(e){
        if (e.stopPropagation){
          e.stopPropagation();
        } else if (window.event){
          window.event.cancelBubble = true;
        }
        e.preventDefault();
        return false;
      }
    };
    logout(){

    }
    
}
