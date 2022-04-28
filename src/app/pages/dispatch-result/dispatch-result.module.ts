import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DispatchResultPageRoutingModule } from './dispatch-result-routing.module';

import { DispatchResultPage } from './dispatch-result.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DispatchResultPageRoutingModule
  ],
  declarations: [DispatchResultPage]
})
export class DispatchResultPageModule {}
