import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { StorageService } from '../../storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  email_id: any;
  password: any;
  data_output: any;

  constructor(private http: HttpClient, private alertCtrl: AlertController, private storage: StorageService, private navCtrl: NavController, private loadingCtrl: LoadingController) { }

  ngOnInit() {
  }

  async loginuser(){
    const loading = await this.loadingCtrl.create({
      message: 'sending request',
      cssClass: 'my-custom-class-two'
    });
    await loading.present();
    if(this.email_id===undefined || this.password===undefined){
      loading.dismiss();
      this.alertCtrl.create({
        header: 'Missing Data',
        cssClass:'my-custom-class',
        message: 'Provide email & password',
        buttons: [{
          text: 'OK',
          cssClass: 'exit-button'
        }]
      }).then(res=>{
        res.present();
      });
    }
    else{
      loading.dismiss();      
      this.getLoginUser(this.email_id, this.password);
    }
  }

  async getLoginUser(email_id, password) {
    const loading = await this.loadingCtrl.create({
      message: 'receiving...',
      cssClass: 'my-custom-class-two'
    });
    await loading.present();    
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
        })
      };  
      var link = 'https://dashboard.apin.org.ng/stracker/apis/get_user.php';
      var myData = JSON.stringify({
        email_id: email_id,
        password: password
        });
        this.http.post(link, myData, {responseType: 'text'}).subscribe(data =>{
          this.data_output = JSON.parse(data);
          var report_status = this.data_output.report;

          if(report_status == 'success_1'){
            this.storage.setString('name', this.data_output.first_name);
            this.storage.setObject('register_details', {
              first_name: this.data_output.first_name,
              last_name: this.data_output.last_name,
              facility: this.data_output.facility,
              facilitycat: this.data_output.facilitycat,
              email_id: this.data_output.email_id,
              phonenumber: this.data_output.phonenumber
            }).then(res=>{
              loading.dismiss();
              this.navCtrl.navigateRoot('');
            });
          }
          else{
            loading.dismiss();
            this.alertCtrl.create({
              header: 'Login Failed',
              cssClass:'my-custom-class',
              message: 'Wrong email/Password',
              buttons: [{
                text: 'OK',
                cssClass: 'exit-button'
              }]
            }).then(res=>{
              res.present();
            });
          }

        }, error => {
          loading.dismiss();
          console.log(error.message);
          this.alertCtrl.create({
            message: 'Server Cannot be Reached.',
            cssClass:'my-custom-class',
            buttons: [
              {
                text: 'OK',
                role: 'cancel',
                handler: () => {
                  this.navCtrl.navigateRoot('login');
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
