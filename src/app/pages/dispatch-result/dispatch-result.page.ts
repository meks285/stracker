import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-dispatch-result',
  templateUrl: './dispatch-result.page.html',
  styleUrls: ['./dispatch-result.page.scss'],
})
export class DispatchResultPage implements OnInit {
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
      this.getActiveResult(this.facility, this.useremail);
    });  
  }
  async getActiveResult(facility,email){
    const loading = await this.loadingCtrl.create({
      message: 'Getting Results List...',
      cssClass: 'my-custom-class-two'
    });
    await loading.present();
      var apiUrl_x= 'http://41.242.58.145:88/apindb_vl/stracker/apis/get_active_result.php?facility='+facility+'&email='+email;
      this.http.get(apiUrl_x, {responseType: 'text'}).subscribe( data => {
        //this.resultset = data; 
        this.strIntoObj_resultset = JSON.parse(data);
        console.log(this.strIntoObj_resultset);
        loading.dismiss();
        }, err =>{
        console.log(err); 
        }); 
    } 
    addResult(sort_id,total_entered_result,totalresult_in_pack,tag_from,tag_to){
      this.sort_id=sort_id;
      this.total_entered_result=total_entered_result;
      this.totalresult_in_pack = totalresult_in_pack;
      this.tag_from = tag_from;
      this.tag_to = tag_to;
      if(this.add_result==0){
        this.add_result=1;
      }
      else if(this.add_result==1){
        this.add_result=0;
      }
    }
    submitResult(rec_facility,patient_id,tag_no,result,id,total_entered_result,no_resultsdispatched,tag_no_from,tag_no_to){
      this.patient_id = patient_id;
      this.tag_no = tag_no;
      this.result=result;
      if((parseInt(total_entered_result) < parseInt(no_resultsdispatched)) && (tag_no !== undefined || result !== undefined || patient_id !== undefined)){
        if((tag_no >= tag_no_from) && (tag_no <= tag_no_to)){
          var apiUrl_x= 'http://41.242.58.145:88/apindb_vl/stracker/apis/add_result.php?patient_id='+patient_id+'&tag_no='+tag_no+'&result='+result+'&id='+id+'&tag_no_from='+tag_no_from+'&tag_no_to='+tag_no_to+'&pcrlab='+this.facility+'&rec_facility='+rec_facility;
          this.http.get(apiUrl_x, {responseType: 'text'}).subscribe( data => {
              if(data=="success"){
                this.getRecFacility_Contact(rec_facility);

              this.alertCtrl.create({
                  message: 'Result Added.',
                  cssClass:'my-custom-class',
                  buttons: [
                    {
                      text: 'OK',
                      role: 'cancel',
                      handler: () => {
                        this.getActiveResult(this.facility, this.useremail);
                      },
                      cssClass: 'exit-button'
                    }
                  ]
                }).then(res=>{
                  res.present();
                });
              }
              else if(data=="fail"){
                this.alertCtrl.create({
                  message: 'Result Add Failed.',
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
                this.alertCtrl.create({
                  message: 'Error: Duplicate Result/Patient.',
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
        else{
          this.alertCtrl.create({
            message: 'Result Tag-No Falls out of Range.',
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
        }
        else{
          this.alertCtrl.create({
            message: 'Missing Data Elements OR Full Slot',
            cssClass:'my-custom-class',
            buttons: [
              {
                text: 'OK',
                role: 'cancel',
                handler: () => {
                  console.log(tag_no, result,patient_id,total_entered_result,no_resultsdispatched);
                },
                cssClass: 'exit-button'
              }
            ]
          }).then(res=>{
            res.present();
          });        
        }
    }
    dispatchResult(sort_id,entered_result,num_resultsdispatched){
      if(parseInt(entered_result) < parseInt(num_resultsdispatched)){
        this.alertCtrl.create({
          message: 'Alert!... You have not entered all the results in this batch.',
          cssClass:'my-custom-class',
          buttons: [
            {
              text: 'DISPATCH',
              role: 'cancel',
              handler: () => {
                this.commence_dispatch(sort_id);
              },
              cssClass: 'exit-button'
            },
            {
              text: 'Cancel',
              cssClass: 'exit-button'
            }
          ]
        }).then(res=>{
          res.present();
        });       
      }
      else{
        this.commence_dispatch(sort_id);
      }
    }

  async  commence_dispatch(sort_id){
      const loading = await this.loadingCtrl.create({
        message: 'Dispatching...',
        cssClass: 'my-custom-class-two'
      });
      await loading.present();
      var apiUrl_x= 'http://41.242.58.145:88/apindb_vl/stracker/apis/dispatch_result.php?sort_id='+sort_id;
      this.http.get(apiUrl_x, {responseType: 'text'}).subscribe( data => {
          if(data=="success"){
            loading.dismiss();
            this.alertCtrl.create({
              message: 'Result Dispatched.',
              cssClass:'my-custom-class',
              buttons: [
                {
                  text: 'OK',
                  role: 'cancel',
                  handler: () => {
                    this.getActiveResult(this.facility, this.useremail);
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
              message: 'Result already Dispatched.',
              cssClass:'my-custom-class',
              buttons: [
                {
                  text: 'OK',
                  role: 'cancel',
                  handler: () => {
                    this.getActiveResult(this.facility, this.useremail);
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
    getRecFacility_Contact(rec_facility){
      var apiUrl_x= 'https://dashboard.apin.org.ng/stracker/apis/get_destinationcontact.php?facility='+rec_facility;
      this.http.get(apiUrl_x, {responseType: 'text'}).subscribe( data => {
        var phonenumber_data = JSON.parse(data);
        if(phonenumber_data.report=='success_1'){
          var facilitycontact = phonenumber_data.phonenumber;   
          this.sendSMS(facilitycontact, this.patient_id,this.tag_no, this.result,this.facility); 
        }else{
          console.log('error: '+data);
        }

        }, err =>{
        console.log(err); 
        });  
    }
    sendSMS(phonenumber,patient_id, tag_no, result,pcrlab){
      var smsMessage = "VL Result For Patient: "+patient_id+" is ready. Result: "+result+". Sample Tag No: "+tag_no+". Lab: "+pcrlab;
      var apiUrl = "https://www.bulksmsnigeria.com/api/v1/sms/create?api_token=2n3a60wMhr1eS31OtMoo7ez8t4n89Mxn5mxaWB2GQsPpbgcWqFwbBEJPi422&from=STracker&to="+phonenumber+"&body="+smsMessage+"&dnd=2"
      this.http.get(apiUrl).subscribe(data =>{
        console.log('SMS Sent: '+data);
        this.patient_id='';
        this.result='';
        this.tag_no='';
        this.add_result=0;

      });
    }
}
