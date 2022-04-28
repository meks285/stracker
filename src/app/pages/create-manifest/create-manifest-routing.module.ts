import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateManifestPage } from './create-manifest.page';

const routes: Routes = [
  {
    path: '',
    component: CreateManifestPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateManifestPageRoutingModule {}
