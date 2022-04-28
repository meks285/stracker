import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TrackManifestPage } from './track-manifest.page';

const routes: Routes = [
  {
    path: '',
    component: TrackManifestPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TrackManifestPageRoutingModule {}
