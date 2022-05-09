import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-return-result',
  templateUrl: './return-result.page.html',
  styleUrls: ['./return-result.page.scss'],
})
export class ReturnResultPage implements OnInit {
  state_list: string;
  strIntoObj_state: any;
  lga_list: string;
  strIntoObj_lga: any;
  facility_list: string;
  strIntoObj_facility: any;
  facility: any;
  useremail: any;
  dispatching_officer: any;
  tag_no_to: number;
  num_of_results: number;
  tag_no_from: number;
  sort_date: string;
  state: any;
  lga: any;
  test_type: string;
  pending_results: string;
  receiving_officer: string;
  remarks: string;
  pcrlab: any;

  constructor(public loadingCtrl: LoadingController, public http: HttpClient, private storage: StorageService,public alertCtrl: AlertController, public navCtrl: NavController) { }

  ngOnInit() {

    this.storage.getObject('register_details').then((data: any) => {
      this.facility = data.facility;
      this.pcrlab = data.facility;
      this.useremail = data.email_id;
      this.dispatching_officer = data.email_id;
    }).then(res=>{
      this.loadState();
    });  
  }

  async loadState(){
      const loading = await this.loadingCtrl.create({
        message: 'Getting State Data...',
        cssClass: 'my-custom-class-two'
      });
      await loading.present();
        var apiUrl_x= 'https://dashboard.apin.org.ng/stracker/apis/loadstate.php';
        this.http.get(apiUrl_x, {responseType: 'text'}).subscribe( data => {
          this.state_list = data; 
          this.strIntoObj_state = JSON.parse(this.state_list);
          loading.dismiss();
          }, err =>{
          console.log(err); 
          });       
    }

    async load_lgas(state){

      const loading = await this.loadingCtrl.create({
        message: 'Getting LGA List...',
        cssClass: 'my-custom-class-two'
      });
      await loading.present();
        var apiUrl_x= 'https://dashboard.apin.org.ng/stracker/apis/loadlgas.php?state='+state;
        this.http.get(apiUrl_x, {responseType: 'text'}).subscribe( data => {
          this.lga_list = data; 
          this.strIntoObj_lga = JSON.parse(this.lga_list);
          loading.dismiss();
          }, err =>{
          console.log(err); 
          });       
 
}
async load_facility(lga){
  const loading = await this.loadingCtrl.create({
    message: 'Getting Facility List...',
    cssClass: 'my-custom-class-two'
  });
  await loading.present();
    var apiUrl_x= 'https://dashboard.apin.org.ng/stracker/apis/loadfacility.php?lga='+lga;
    this.http.get(apiUrl_x, {responseType: 'text'}).subscribe( data => {
      this.facility_list = data; 
      this.strIntoObj_facility = JSON.parse(this.facility_list);
      loading.dismiss();
      }, err =>{
      console.log(err); 
      });  
    }

    getTagNoLimit(numresult,ev){
      this.tag_no_to = parseInt(numresult)+parseInt(ev.target.value)-1;
    }

  async  uploadResult(){
    const loading = await this.loadingCtrl.create({
      message: 'Validating...',
      cssClass: 'my-custom-class-two',
      duration: 3000
    });
    await loading.present();
      if(this.sort_date == '' || this.state=='' || this.lga=='' || this.facility=='' || this.test_type=='' || this.num_of_results===undefined || this.tag_no_from===undefined || this.tag_no_to===undefined || this.dispatching_officer=='' || this.receiving_officer==''){
        loading.dismiss();
        this.alertCtrl.create({
          message: 'Valiation Failed. Emply Input Fields Detected',
          cssClass:'my-custom-class',
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
          var apiUrl_x= 'http://105.113.2.249:88/apindb_vl/stracker/apis/create_result.php?sort_date='+this.sort_date+'&state='+this.state.state+'&lga='+this.lga.lga+'&facility='+this.facility.facility+'&test_type='+this.test_type+'&num_of_results='+this.num_of_results+'&tag_no_from='+this.tag_no_from+'&tag_no_to='+this.tag_no_to+'&pcrlab='+this.pcrlab+'&pending_results='+this.pending_results+'&dispatching_officer='+this.dispatching_officer+'&receiving_officer='+this.receiving_officer+'&remarks='+this.remarks+'&data_clerk='+this.useremail;
          this.http.get(apiUrl_x, {responseType: 'text'}).subscribe( data => {
              if(data=="success"){
                loading.dismiss();
                this.alertCtrl.create({
                  message: 'Batch Result Created.',
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
                  message: 'Result Creation Failed.',
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
              else if(data=="duplicate"){
                loading.dismiss();
                this.alertCtrl.create({
                  message: 'Tag # matches existing result tag no. Review the Tag Numbers & try again',
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
}
