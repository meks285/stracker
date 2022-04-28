import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-recieve-result',
  templateUrl: './recieve-result.page.html',
  styleUrls: ['./recieve-result.page.scss'],
})
export class RecieveResultPage implements OnInit {
  form_version=0;
  resultset: string;
  //strIntoObj_resultset: any[];
  //strIntoObj_resultset: any = [];
  strIntoObj_resultset: any[];
  facility: any;
  useremail: any;
  add_result=0;
  sort_id: any;
  total_entered_result: any;
  totalresult_in_pack: any;
  tag_from: any;
  tag_to: any;
  patient_id: string;
  result: string;
  tag_no: string;

  constructor(public loadingCtrl: LoadingController, public http: HttpClient, private storage: StorageService, public alertCtrl: AlertController, public navCtrl: NavController) { }

  ngOnInit() {
    this.storage.getObject('register_details').then((data: any) => {
      this.facility = data.facility;
      this.useremail = data.email_id;
    }).then(res=>{
      this.getDispatchedResult(this.facility, this.useremail);
    });   
  }
  async getDispatchedResult(facility,email){
    const loading = await this.loadingCtrl.create({
      message: 'Getting Results List...',
      cssClass: 'my-custom-class-two'
    });
    await loading.present();
      var apiUrl_x= 'http://41.242.58.145:88/apindb_vl/stracker/apis/get_dispatched_result.php?facility='+facility+'&email='+email;
      this.http.get(apiUrl_x, {responseType: 'text'}).subscribe( data => {
        //this.resultset = data; 
        this.strIntoObj_resultset = JSON.parse(data);
        console.log(this.strIntoObj_resultset);
        loading.dismiss();
        }, err =>{
        console.log(err); 
        }); 
    } 
  async recResult(id){
      const loading = await this.loadingCtrl.create({
        message: 'Receiving...',
        cssClass: 'my-custom-class-two'
      });
      await loading.present();      
      var apiUrl_x= 'http://41.242.58.145:88/apindb_vl/stracker/apis/recieve_result.php?result_id='+id;
      this.http.get(apiUrl_x, {responseType: 'text'}).subscribe( data => {
          if(data=="success"){
          loading.dismiss();
          this.alertCtrl.create({
              message: 'Result Received.',
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
          else if(data=="fail"){
            loading.dismiss();
            this.alertCtrl.create({
              message: 'Result Receive Failed.',
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
        }, err =>{
          loading.dismiss();
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
