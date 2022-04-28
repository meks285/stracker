import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecieveResultPage } from './recieve-result.page';

const routes: Routes = [
  {
    path: '',
    component: RecieveResultPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecieveResultPageRoutingModule {}
