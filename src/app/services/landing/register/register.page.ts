import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { StorageService } from '../../storage.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  name: string;
  register_details = { first_name: '', last_name: '', facility: '', facilitycat: '', email_id: '', phonenumber: ''};
  first_name: any;
  last_name: any;
  facility: any;
  facilitycat: any;
  phonenumber: any;
  email_id: any;
  hubs: string;
  strIntoObj: any[];

  constructor(private storage: StorageService, private alertCtrl: AlertController, private navCtrl: NavController, private http: HttpClient,private loadingCtrl: LoadingController) { }

  ngOnInit() {
    this.getHubData();
  }

  registeruserfac(){
    if(this.first_name=== undefined || this.last_name === undefined || this.facility === undefined || this.facilitycat === undefined || this.email_id=== undefined || this.phonenumber === undefined){
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
      this.storage.setString('name', this.first_name);
      this.storage.setObject('register_details', {
        first_name: this.first_name,
        last_name: this.last_name,
        facility: this.facility.facility,
        facilitycat: this.facilitycat,
        email_id: this.email_id,
        phonenumber: this.phonenumber
      }).then(data=>{
        this.uploaduserdata(this.first_name, this.last_name,this.facility.facility,this.facilitycat,this.email_id,this.phonenumber);
      })    
    }

  } 
  uploaduserdata(first_name,last_name,facility,facilitycat,email_id,phonenumber) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
        })
      };  
      var link = 'https://dashboard.apin.org.ng/stracker/apis/create_user.php';
      var myData = JSON.stringify({
        first_name: first_name,
        last_name: last_name,
        facility: facility,
        facilitycat: facilitycat,
        email_id: email_id,
        phonenumber: phonenumber
        });

        this.http.post(link, myData, {responseType: 'text'}).subscribe(data => {
          if(data =='success'){
            this.alertCtrl.create({
              message: 'User Registration success.',
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
            this.alertCtrl.create({
              message: 'User Registration Failure.',
              cssClass:'my-custom-class',
              buttons: [
                {
                  text: 'OK',
                  role: 'cancel',
                  handler: () => {
                    this.navCtrl.navigateRoot('register');
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
              message: 'Server Cannot be Reached.',
              cssClass:'my-custom-class',
              buttons: [
                {
                  text: 'OK',
                  role: 'cancel',
                  handler: () => {
                    this.navCtrl.navigateRoot('register');
                  },
                  cssClass: 'exit-button'
                }
              ]
            }).then(res=>{
              res.present();
            });
       });
  }
async  getHubData(){
  const loading = await this.loadingCtrl.create({
    message: 'Hubs Loading...',
    cssClass: 'my-custom-class-two'
  });
  await loading.present();
    var apiUrl_x= 'https://dashboard.apin.org.ng/stracker/apis/get_hubs.php';
    this.http.get(apiUrl_x, {responseType: 'text'}).subscribe( data => {
      this.hubs = data; 
      this.strIntoObj = JSON.parse(this.hubs);
      console.log(this.strIntoObj);
      loading.dismiss();
      }, err =>{
      console.log(err); 
      }); 
  }

}