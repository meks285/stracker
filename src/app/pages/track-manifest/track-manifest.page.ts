import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-track-manifest',
  templateUrl: './track-manifest.page.html',
  styleUrls: ['./track-manifest.page.scss'],
})
export class TrackManifestPage implements OnInit {

form_version=0;
button_type=0;
manifest_id: any;
  manifest_details: string;
  strIntoObjMan: any[];

  constructor(private alertCtrl: AlertController, private loadingCtrl: LoadingController, private navCtrl: NavController, private http: HttpClient) { }

  ngOnInit() {
  }

 async trackManifest(){
  this.button_type=1;
   if(this.manifest_id === undefined){
    this.alertCtrl.create({
      message: 'Enter Manifest ID.',
      cssClass:'my-custom-class',
      buttons: [
        {
          text: 'OK',
          role: 'cancel',
          handler: () => {
            this.button_type=0;
          },
          cssClass: 'exit-button'
        }
      ]
    }).then(res=>{
      res.present();
    });
   }
   else{
    var manifest_id = this.manifest_id;
      if(this.manifest_id===undefined){
        this.button_type=0;
        console.log('Initializing...: '+this.manifest_id);
    }
    else{
        var apiUrl_x= 'https://dashboard.apin.org.ng/stracker/apis/track_manifest.php?manifest_id='+manifest_id;
        this.http.get(apiUrl_x, {responseType: 'text'}).subscribe( data => {
          if(data == 'No Rows'){
            this.alertCtrl.create({
              message: 'Wrong Manifest ID.',
              cssClass:'my-custom-class',
              buttons: [
                {
                  text: 'OK',
                  role: 'cancel',
                  handler: () => {
                    this.button_type=0;
                  },
                  cssClass: 'exit-button'
                }
              ]
            }).then(res=>{
              res.present();
            });
          }
          else{
            this.manifest_details = data; 
            this.strIntoObjMan = JSON.parse(this.manifest_details);
            this.form_version=1;
            this.button_type=1;          
          }

          }, err =>{
          console.log(err); 
          });      
        }
   }
  }
}
