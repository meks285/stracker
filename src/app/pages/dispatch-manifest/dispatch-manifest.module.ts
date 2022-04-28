import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DispatchManifestPageRoutingModule } from './dispatch-manifest-routing.module';

import { DispatchManifestPage } from './dispatch-manifest.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DispatchManifestPageRoutingModule
  ],
  declarations: [DispatchManifestPage]
})
export class DispatchManifestPageModule {}
