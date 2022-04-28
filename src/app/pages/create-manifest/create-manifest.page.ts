import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-create-manifest',
  templateUrl: './create-manifest.page.html',
  styleUrls: ['./create-manifest.page.scss'],
})
export class CreateManifestPage implements OnInit {
  manifest_id: any;
  samplecount: any;
  testtype: any;
  courier: any;
  pcrlab: any;
  facility: any;
  useremail: any;
  next_destination: any;
  hubs: string;
  strIntoObj: any[];
  pcrlab_svr: string;
  strIntoObjpcr: any[];

  constructor(private navCtrl: NavController, private loadingCtrl: LoadingController, private http:HttpClient, private alertCtrl: AlertController, private storage: StorageService) { }

  ngOnInit() {
    this.storage.getObject('register_details').then((data: any) => {
      this.facility = data.facility;
      this.useremail = data.email_id;
      console.log(this.useremail);
    });
    this.getHubData();
  }

async  uploadManifest(){
  if(this.manifest_id=== undefined || this.samplecount === undefined || this.testtype === undefined || this.courier === undefined || this.pcrlab=== undefined || this.facility === undefined || this.useremail === undefined || this.next_destination === undefined){
    this.alertCtrl.create({
      header: 'Missing Data',
      cssClass:'my-custom-class',
      message: 'Required elements missing',
      buttons: [
          {
        text: 'OK',
        role: 'cancel',
        cssClass: 'exit-button'
          }
        ]
    }).then(res=>{
      res.present();
    });
  }
  else{
    const loading = await this.loadingCtrl.create({
      message: 'Creating Manifest...',
      cssClass: 'my-custom-class-two'
    });
    await loading.present();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
        })
      };  
      var link = 'https://dashboard.apin.org.ng/stracker/apis/create_manifest.php';
      var myData = JSON.stringify({
        manifest_id: this.manifest_id,
        samplecount: this.samplecount,
        testtype: this.testtype,
        courier: this.courier,
        pcrlab: this.pcrlab.facility,
        facility: this.facility,
        fac_contact: this.useremail,
        next_destination: this.next_destination.facility
        });

        this.http.post(link, myData, {responseType: 'text'}).subscribe(data => {
          if(data =='success'){
            loading.dismiss();
            this.alertCtrl.create({
              message: 'Manifest Created.',
              cssClass:'my-custom-class',
              buttons: [
                {
                  text: 'OK',
                  role: 'cancel',
                  handler: () => {
                    this.navCtrl.navigateRoot('');
                  },
                  cssClass: 'exit-button'
                }
              ]
            }).then(res=>{
              res.present();
            });
          }
          else if(data =='Record Exists'){
            loading.dismiss();
            this.alertCtrl.create({
              header: 'Duplicate Manifest.',
              message: 'This Manifest has already been uploaded',
              cssClass:'my-custom-class',
              buttons: [
                {
                  text: 'OK',
                  role: 'cancel',
                  handler: () => {
                    this.navCtrl.navigateRoot('');
                  },
                  cssClass: 'exit-button'
                }
              ]
            }).then(res=>{
              res.present();
            });
          }
          else{
            loading.dismiss();
            this.alertCtrl.create({
              message: 'Manifest Creation Failure.'+data,
              cssClass:'my-custom-class',
              buttons: [
                {
                  text: 'OK',
                  role: 'cancel',
                  handler: () => {
                    this.navCtrl.navigateRoot('create-manifest');
                  },
                  cssClass: 'exit-button'
                }
              ]
            }).then(res=>{
              res.present();
            });
          }
        }, error => {
            console.log(error.message);
            this.alertCtrl.create({
              message: 'Server Cannot be Reached... Return to Home',
              cssClass:'my-custom-class',
              buttons: [
                {
                  text: 'OK',
                  role: 'cancel',
                  handler: () => {
                    this.navCtrl.navigateRoot('');
                  },
                  cssClass: 'exit-button'
                }
              ]
            }).then(res=>{
              res.present();
            });
       });
    }
  }
  async getHubData(){
    const loading = await this.loadingCtrl.create({
      message: 'Hubs Loading...',
      cssClass: 'my-custom-class-two'
    });
    await loading.present();
      var apiUrl_x= 'https://dashboard.apin.org.ng/stracker/apis/get_receiving_hubs.php';
      this.http.get(apiUrl_x, {responseType: 'text'}).subscribe( data => {
        this.hubs = data; 
        this.strIntoObj = JSON.parse(this.hubs);
        loading.dismiss();
        this.getPCRLabData();
        }, err =>{
        console.log(err); 
        }); 
    }  
    async getPCRLabData(){
      const loading = await this.loadingCtrl.create({
        message: 'PCR Loading...',
        cssClass: 'my-custom-class-two'
      });
      await loading.present();
        var apiUrl_x= 'https://dashboard.apin.org.ng/stracker/apis/get_pcrlab.php';
        this.http.get(apiUrl_x, {responseType: 'text'}).subscribe( data => {
          this.pcrlab_svr = data; 
          this.strIntoObjpcr = JSON.parse(this.pcrlab_svr);
          loading.dismiss();
          }, err =>{
          console.log(err); 
          }); 
      }  
  }