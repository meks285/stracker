import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReturnResultPageRoutingModule } from './return-result-routing.module';

import { ReturnResultPage } from './return-result.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReturnResultPageRoutingModule
  ],
  declarations: [ReturnResultPage]
})
export class ReturnResultPageModule {}
