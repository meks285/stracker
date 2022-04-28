import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReceiveManifestPage } from './receive-manifest.page';

const routes: Routes = [
  {
    path: '',
    component: ReceiveManifestPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReceiveManifestPageRoutingModule {}
