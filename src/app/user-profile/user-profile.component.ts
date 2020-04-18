import {
  Component,
  OnInit,
  AfterViewInit,
  AfterContentInit,
} from '@angular/core';
import { AuthService } from '../auth.service';
// import { AngularFireAuth } from '@angular/fire/auth/auth';
import { AngularFireAuth } from '@angular/fire/auth';

import { auth } from 'firebase/app';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent
  implements OnInit, AfterViewInit, AfterContentInit {
  userId = null;
  constructor(
    public auth: AngularFireAuth,
    private authService: AuthService,
    private router: Router
  ) {
    setTimeout(() => {
      if (this.authService.isAuthenticated) {
        this.router.navigate(['feedlist']);
      }
    }, 1000);
  }

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.userId = this.authService.currentUserId;

    console.log(this.userId);
    if (this.userId) {
      this.router.navigate['feedlist'];
    }
  }

  ngAfterContentInit() {
    this.userId = this.authService.currentUserId;

    console.log(this.userId);
    if (this.userId) {
      this.router.navigate['feedlist'];
    }
  }

  login() {
    this.auth.signInWithPopup(new auth.GoogleAuthProvider()).then(() => {
      setTimeout(() => {
        this.router.navigate(['/feedlist']);
      }, 1000);
    });
  }
  logout() {
    this.auth.signOut();
  }

  getUserId() {
    // this.authService.setUserId(this.authService.currentUserId);
    this.userId = this.authService.currentUserId;
    return this.userId;
  }
}
