import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isLogedIn: boolean;
  constructor(private auth: AuthService) { }

  ngOnInit() {
    // this.isLogedIn = this.auth.isAuthenticated();
    this.auth.islogedIn.subscribe(
      (data)=>{
        this.isLogedIn = data;
      }
    )
  }

  onLogout() {
    this.auth.logout();
  }
}
