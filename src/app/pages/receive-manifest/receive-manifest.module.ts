import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReceiveManifestPageRoutingModule } from './receive-manifest-routing.module';

import { ReceiveManifestPage } from './receive-manifest.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReceiveManifestPageRoutingModule
  ],
  declarations: [ReceiveManifestPage]
})
export class ReceiveManifestPageModule {}
