import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecieveResultPageRoutingModule } from './recieve-result-routing.module';

import { RecieveResultPage } from './recieve-result.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecieveResultPageRoutingModule
  ],
  declarations: [RecieveResultPage]
})
export class RecieveResultPageModule {}
