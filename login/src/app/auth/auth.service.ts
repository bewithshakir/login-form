import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { ConfigService } from '../shared/config.service';
import { Http } from '@angular/http';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class AuthService {
    token: string;
    islogedIn = new Subject<any>();

    constructor(private router: Router, private configSrv: ConfigService, private http: Http) { }

    signinUser(user) {
        const url = this.configSrv.getLoginApi();
        this.http.post('http://localhost:5000/login', user)
            .subscribe(res => {
                this.router.navigate(['dashboard']);
                this.islogedIn.next(true);
                localStorage.setItem('token', JSON.parse(res['_body']).token);
            }, error => {
                this.islogedIn.next(false);
                localStorage.removeItem('token');
                alert("Wrong credential")
            })
    }

    logout() {
        this.token = null;
        localStorage.removeItem('token');
        this.router.navigate(['/']);
        this.islogedIn.next(false);
    }

    getToken() {
        if (!localStorage.getItem('token')) {
            this.token = null;
        } else {
            this.token = localStorage.getItem('token');
        }
        return this.token;
    }

    isAuthenticated() {
        return this.getToken() != null;
    }
}
