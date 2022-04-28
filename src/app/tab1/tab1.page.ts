import { Component } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { StorageService } from '../services/storage.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  name: string;
  facilitycat: any;
  recieveFac: number;
  returnresult: number;

  constructor(public navController: NavController, public platform: Platform, private storage: StorageService, private http: HttpClient) {
    this.platform.ready().then(() => {
      this.initDB();
    });
  }

initDB(){
 this.storage.getString('name').then((data =>{
   if(data.value){
     this.name = data.value;
     this.navController.navigateRoot('');
     this.storage.getObject('register_details').then((data: any) => {
      this.facilitycat = data.facilitycat;
      if(this.facilitycat=='Spoke'){
        this.recieveFac=0;
      }
      else if(this.facilitycat=='PCRLab'){
        this.recieveFac=1;
        this.returnresult=1;
      }
      else{
        this.recieveFac=1;
      }
    });
   }
   else{
     console.log('New User');
     this.navController.navigateRoot('landing');
   }
 }))
}	 

  createManifest(){
    this.navController.navigateForward('create-manifest');
  }

  dispatchManifest(){
    this.navController.navigateForward('dispatch-manifest');
  }
  receiveManifest(){
    this.navController.navigateForward('receive-manifest');
  }
  trackManifest(){
    this.navController.navigateForward('track-manifest');
  }
  returnResult(){
    this.navController.navigateForward('return-result');
  }
  dispatchResult(){
    this.navController.navigateForward('dispatch-result');
  }
  receiveResult(){
    this.navController.navigateForward('recieve-result');
  }
}
