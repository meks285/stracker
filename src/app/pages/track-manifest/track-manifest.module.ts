import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TrackManifestPageRoutingModule } from './track-manifest-routing.module';

import { TrackManifestPage } from './track-manifest.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TrackManifestPageRoutingModule
  ],
  declarations: [TrackManifestPage]
})
export class TrackManifestPageModule {}
