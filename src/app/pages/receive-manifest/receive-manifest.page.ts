import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-receive-manifest',
  templateUrl: './receive-manifest.page.html',
  styleUrls: ['./receive-manifest.page.scss'],
})
export class ReceiveManifestPage implements OnInit {
  facility: any;
  useremail: any;
  manifest: string;
  strIntoObj: any[];
  form_version=0;
  manifest_id: any;
  manifest_details: string;
  strIntoObjMan: any[];
  button_type=0;
  recieve_date: string;
  facilitycat: any;
  first_name: any;
  last_name: any;

  constructor(private navCtrl: NavController, private loadingCtrl: LoadingController, private http:HttpClient, private alertCtrl: AlertController, private storage: StorageService) { }

  ngOnInit() {
    this.storage.getObject('register_details').then((data: any) => {
      this.facility = data.facility;
      this.first_name = data.first_name;
      this.last_name = data.last_name;
      this.useremail = data.email_id;
      this.facilitycat = data.facilitycat;
    }).then(res=>{
      this.getActiveManifest(this.facility);
    });
  }

  async getActiveManifest(facility){
    const loading = await this.loadingCtrl.create({
      message: 'Active Manifests Loading...',
      cssClass: 'my-custom-class-two'
    });
    await loading.present();
      var apiUrl_x= 'https://dashboard.apin.org.ng/stracker/apis/get_active_manifest.php?facility='+facility;
      this.http.get(apiUrl_x, {responseType: 'text'}).subscribe( data => {
        this.manifest = data; 
        this.strIntoObj = JSON.parse(this.manifest);
        loading.dismiss();
        }, err =>{
        console.log(err); 
        }); 
    } 
    async  loadManifest(manifest_id){
      if(manifest_id===undefined){
          console.log('Initializing...: '+manifest_id);
      }
      else{
        this.manifest_id = manifest_id;
        const loading = await this.loadingCtrl.create({
          message: 'Selected Manifest Loading...',
          cssClass: 'my-custom-class-two'
        });
        await loading.present();
          var apiUrl_x= 'https://dashboard.apin.org.ng/stracker/apis/load_manifest.php?manifest_id='+manifest_id;
          this.http.get(apiUrl_x, {responseType: 'text'}).subscribe( data => {
            this.manifest_details = data; 
            this.strIntoObjMan = JSON.parse(this.manifest_details);
            this.form_version=1;
            loading.dismiss();
            }, err =>{
            console.log(err); 
            });      
          }
        }
        async  receiveManifest(){
          this.button_type=1;
          const loading = await this.loadingCtrl.create({
            message: 'Changing Manifest Status...',
            cssClass: 'my-custom-class-two'
          });
          await loading.present();
            var apiUrl_x= 'https://dashboard.apin.org.ng/stracker/apis/dispatch_manifest.php?manifest_id='+this.manifest_id+'&receive_date='+this.recieve_date+'&facility='+this.facility+'&facilitycat='+this.facilitycat;
            this.http.get(apiUrl_x, {responseType: 'text'}).subscribe( data => {
                if(data=="success"){
                  loading.dismiss();
                  this.getOrigFacContact(this.manifest_id);
                  this.button_type=0;
                  this.alertCtrl.create({
                    message: 'Manifest Received.',
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
                else if(data=="failure"){
                  loading.dismiss();
                  this.button_type=0;
                  this.alertCtrl.create({
                    message: 'Manifest Receive Failed.',
                    cssClass:'my-custom-class',
                    buttons: [
                      {
                        text: 'OK',
                        role: 'cancel',
                        handler: () => {
                        },
                        cssClass: 'exit-button'
                      }
                    ]
                  }).then(res=>{
                    res.present();
                  });
                }
              }, err =>{
              console.log(err); 
              this.button_type=0;
              this.alertCtrl.create({
                message: 'Server cannot be reached.',
                cssClass:'my-custom-class',
                buttons: [
                  {
                    text: 'OK',
                    role: 'cancel',
                    handler: () => {
                    },
                    cssClass: 'exit-button'
                  }
                ]
              }).then(res=>{
                res.present();
              });
              }); 
        }  
        sendSMS(facility,manifest_id,first_name, last_name,phonenumber){
          var smsMessage = "Manifest: "+manifest_id+" has been received at facility: "+facility+" by: "+first_name+" "+last_name;
          var apiUrl = "https://www.bulksmsnigeria.com/api/v1/sms/create?api_token=2n3a60wMhr1eS31OtMoo7ez8t4n89Mxn5mxaWB2GQsPpbgcWqFwbBEJPi422&from=STracker&to="+phonenumber+"&body="+smsMessage+"&dnd=2"
          this.http.get(apiUrl).subscribe(data =>{
            console.log('SMS Sent: '+data);
          });
        }
    
        getOrigFacContact(manifest_id){
          var apiUrl_x= 'https://dashboard.apin.org.ng/stracker/apis/get_originfaccontact.php?manifest_id='+manifest_id;
          this.http.get(apiUrl_x, {responseType: 'text'}).subscribe( data => {
            var phonenumber_data = JSON.parse(data);
            if(phonenumber_data.report=='success_1'){
              var nextFacPhone = phonenumber_data.phonenumber;   
              this.sendSMS(this.facility,this.manifest_id,this.first_name,this.last_name,nextFacPhone); 
            }else{
              console.log('error: '+data);
            }
    
            }, err =>{
            console.log(err); 
            });       
      }              
}
