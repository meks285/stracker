import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-dispatch-manifest',
  templateUrl: './dispatch-manifest.page.html',
  styleUrls: ['./dispatch-manifest.page.scss'],
})
export class DispatchManifestPage implements OnInit {
  manifest: string;
  strIntoObj: any;
  facility: any;
  useremail: any;
  manifestDownload: number;
  manifest_details: string;
  strIntoObjMan: any[];
  button_type=0;
  form_version=0;
  manifest_id: any;
  manifest_idx: any;
  facility_list: string;
  strIntoObjdest: any[];
  next_destination: any;

  courier: any;
  courier_phone: any;
  destination_type: any;
  dispatch_date: any;
  nextDestPhone: any;

  constructor(private navCtrl: NavController, private loadingCtrl: LoadingController, private http:HttpClient, private alertCtrl: AlertController, private storage: StorageService) { }

  ngOnInit() {
    this.storage.getObject('register_details').then((data: any) => {
      this.facility = data.facility;
      this.useremail = data.email_id;
    }).then(res=>{
      this.getActiveManifest(this.facility, this.useremail);
    });
  }

  async getActiveManifest(facility,email){
    const loading = await this.loadingCtrl.create({
      message: 'Active Manifests Loading...',
      cssClass: 'my-custom-class-two'
    });
    await loading.present();
      var apiUrl_x= 'https://dashboard.apin.org.ng/stracker/apis/get_active_manifest.php?facility='+facility+'&email='+email;
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
  async  getDestination(destination_type){
    this.next_destination="";
      const loading = await this.loadingCtrl.create({
        message: 'Loading...',
        cssClass: 'my-custom-class-two'
      });
      await loading.present();
        var apiUrl_x= 'https://dashboard.apin.org.ng/stracker/apis/get_receiving_hubs.php?fac_type='+destination_type;
        this.http.get(apiUrl_x, {responseType: 'text'}).subscribe( data => {
          this.facility_list = data; 
          this.strIntoObjdest = JSON.parse(this.facility_list);
          loading.dismiss();
          }, err =>{
          console.log(err); 
          });       
    }

    async  dispatchManifest(){
      this.button_type=1;
      if(this.manifest_id===undefined || this.courier === undefined || this.courier_phone === undefined || this.destination_type === undefined || this.next_destination === undefined || this.dispatch_date === undefined){
        this.button_type=0;
        this.alertCtrl.create({
          message: 'Please complete the Form.',
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
      else{
        const loading = await this.loadingCtrl.create({
          message: 'Dispatching Manifest...',
          cssClass: 'my-custom-class-two'
        });
        await loading.present();
          var apiUrl_x= 'https://dashboard.apin.org.ng/stracker/apis/dispatch_manifest.php?manifest_id='+this.manifest_id+'&courier='+this.courier+'&courier_phone='+this.courier_phone+'&destination_type='+this.destination_type+'&next_destination='+this.next_destination.facility+'&dispatch_date='+this.dispatch_date+'&orig_facility='+this.facility;
          this.http.get(apiUrl_x, {responseType: 'text'}).subscribe( data => {
              if(data=="success"){
                this.getNextDestinationContact(this.next_destination.facility);
                loading.dismiss();
                this.button_type=0;
                this.alertCtrl.create({
                  message: 'Manifest Dispatched.',
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
                  message: 'Manifest Dispatch Failed.',
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
    }
    sendSMS(phonenumber,manifest_id, courier, destination,dispatch_date){
      var smsMessage = "Manifest: "+manifest_id+" has been dispatched to facility: "+destination+" by: "+courier+" on: "+dispatch_date;
      var apiUrl = "https://www.bulksmsnigeria.com/api/v1/sms/create?api_token=2n3a60wMhr1eS31OtMoo7ez8t4n89Mxn5mxaWB2GQsPpbgcWqFwbBEJPi422&from=STracker&to="+phonenumber+"&body="+smsMessage+"&dnd=2"
      this.http.get(apiUrl).subscribe(data =>{
        console.log('SMS Sent: '+data);
      });
    }

    getNextDestinationContact(next_destination){
      var apiUrl_x= 'https://dashboard.apin.org.ng/stracker/apis/get_destinationcontact.php?facility='+next_destination;
      this.http.get(apiUrl_x, {responseType: 'text'}).subscribe( data => {
        var phonenumber_data = JSON.parse(data);
        if(phonenumber_data.report=='success_1'){
          var nextFacPhone = phonenumber_data.phonenumber;   
          this.sendSMS(nextFacPhone, this.manifest_id,this.courier, this.next_destination.facility,this.dispatch_date); 
        }else{
          console.log('error: '+data);
        }

        }, err =>{
        console.log(err); 
        });       
  }
}
