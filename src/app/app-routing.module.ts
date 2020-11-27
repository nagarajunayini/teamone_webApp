import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { VerifypostsComponent } from './components/verifyposts/verifyposts.component';
import { CreatePostComponent } from './components/create-post/create-post.component';
import { AppControllsComponent } from './components/app-controlls/app-controlls.component';
import { CronsComponent } from './components/crons/crons.component';
import { CreateContestComponent } from './components/create-contest/create-contest.component';
import { RulesComponent } from './components/rules/rules.component';


const routes: Routes = [
      { path: '', component: LoginComponent,pathMatch: 'full'  },
      { path: 'login', component: LoginComponent  },
      { path: 'verifyPost', component: VerifypostsComponent },
      { path: 'createpost', component: CreatePostComponent },
      { path: 'createcontest', component: CreateContestComponent },
      { path: 'appcontrolls', component: AppControllsComponent },
      { path: 'rules', component: RulesComponent },
      { path: 'crons', component: CronsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
