import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule }   from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './components/login/login.component';
import { VerifypostsComponent } from './components/verifyposts/verifyposts.component';
import { AngularFireModule } from '@angular/fire';
import { AngularFireStorageModule } from '@angular/fire/storage'
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment} from '../environments/environment';
import { CreatePostComponent } from './components/create-post/create-post.component';
import { CreateContestComponent } from './components/create-contest/create-contest.component';
import { AppControllsComponent } from './components/app-controlls/app-controlls.component';
import { CronsComponent } from './components/crons/crons.component';
import { RulesComponent } from './components/rules/rules.component'

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    VerifypostsComponent,
    CreatePostComponent,
    CreateContestComponent,
    AppControllsComponent,
    CronsComponent,
    RulesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MDBBootstrapModule.forRoot(),
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireStorageModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule { }
