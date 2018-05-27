import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map'
import { Router } from '@angular/router';

import { ConfigService } from '../shared/config.service';


@Injectable()
export class LoginService {
    
    constructor(private configSrv: ConfigService, private http: Http, private router: Router) { }
    signIn(user){
        const url = this.configSrv.getLoginApi();
        this.http.post('http://localhost:5000/login', user)
            .subscribe(data=>{
                this.router.navigate(['dashboard']);
            }, error => console.log("there was an error!"))
    }
}
