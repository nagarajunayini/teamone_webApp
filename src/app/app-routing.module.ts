import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { VerifypostsComponent } from './components/verifyposts/verifyposts.component';
import { CreatePostComponent } from './components/create-post/create-post.component';
import { AppControllsComponent } from './components/app-controlls/app-controlls.component';


const routes: Routes = [
      { path: '', component: LoginComponent,pathMatch: 'full'  },
      { path: 'login', component: LoginComponent  },
      { path: 'verifyPost', component: VerifypostsComponent },
      { path: 'createpost', component: CreatePostComponent },
      { path: 'createcontest', component: CreatePostComponent },
      { path: 'appcontrolls', component: AppControllsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
