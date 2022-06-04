import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NavComponent } from './component/nav/nav.component';
import { SeMedComponent } from './pages/se-med/se-med.component';
import { ElMedComponent } from './pages/el-med/el-med.component';

const routes: Routes = [
  {
    path: '',
    component: NavComponent,
    // canActivate: [AuthGuard],
    children: [   
      {
        path: 'se-med',
        component: SeMedComponent,
      },
      {
        path: 'el-med',
        component: ElMedComponent,
      },
      {
        path: '',
        redirectTo: 'se-med',
        pathMatch: 'full',
      }
    ],
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
