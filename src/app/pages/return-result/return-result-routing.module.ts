import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReturnResultPage } from './return-result.page';

const routes: Routes = [
  {
    path: '',
    component: ReturnResultPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReturnResultPageRoutingModule {}
