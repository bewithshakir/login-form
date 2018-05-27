import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-userlogin',
  templateUrl: './userlogin.component.html',
  styleUrls: ['./userlogin.component.css']
})
export class UserloginComponent implements OnInit {
  constructor(private auth: AuthService) { }

  ngOnInit() {
    
  }
  onSubmit(form) {
    // console.log()
    const user = {
      username: form.value.username,
      password: form.value.password
    }
    this.auth.signinUser(user);
  }
}
