import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateManifestPageRoutingModule } from './create-manifest-routing.module';

import { CreateManifestPage } from './create-manifest.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateManifestPageRoutingModule
  ],
  declarations: [CreateManifestPage]
})
export class CreateManifestPageModule {}
