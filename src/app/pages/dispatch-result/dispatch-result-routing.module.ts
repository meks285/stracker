import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DispatchResultPage } from './dispatch-result.page';

const routes: Routes = [
  {
    path: '',
    component: DispatchResultPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DispatchResultPageRoutingModule {}
