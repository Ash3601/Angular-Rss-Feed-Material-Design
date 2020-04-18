import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model'; // optional

// import { auth } from 'firebase';
import { AngularFireAuth } from '@angular/fire/auth';
// import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';

import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';

import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
// @Injectable()
export class AuthService {
  user$: Observable<User>;
  // feed: User;

  // constructor(
  //   private afAuth: AngularFireAuth,
  //   private afs: AngularFirestore,
  //   private router: Router
  // ) {
  //   this.user$ = this.afAuth.authState.pipe(
  //     switchMap((user) => {
  //       // Logged in
  //       if (user) {
  //         return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
  //       } else {
  //         // Logged out
  //         return of(null);
  //       }
  //     })
  //   );
  // }

  authState: any = null;
  userId;

  constructor(private firebaseAuth: AngularFireAuth, private router: Router) {
    this.firebaseAuth.authState.subscribe((authState) => {
      this.authState = authState;
    });
  }

  get isAuthenticated(): boolean {
    return this.authState !== null;
  }

  get isEmailVerified(): boolean {
    return this.isAuthenticated ? this.authState.emailVerified : false;
  }

  get currentUserId(): string {
    return this.isAuthenticated ? this.authState.uid : null;
  }

  setUserId(userId: string) {
    this.userId = userId;
  }

  getUserId() {
    return this.userId;
  }

  get userData(): any {
    if (!this.isAuthenticated) {
      return [];
    }

    return [
      {
        id: this.authState.uid,
        displayName: this.authState.displayName,
        email: this.authState.email,
        phoneNumber: this.authState.phoneNumber,
        photoURL: this.authState.photoURL,
      },
    ];
  }

  // login() {
  //   this.afAuth.signInWithPopup(new auth.GoogleAuthProvider());
  //   const provider = new auth.GoogleAuthProvider();
  //   // const credential = await this.afAuth.auth().signInWithPopup(provider);
  //   // return this.updateUserData(credential.user);
  // }

  // login() {
  //   this.afAuth.signInWithPopup(new auth.GoogleAuthProvider());
  // }
  // logout() {
  //   this.afAuth.signOut();
  // }

  // private updateUserData(user) {
  //   // Sets user data to firestore on login
  //   const userRef: AngularFirestoreDocument<User> = this.afs.doc(
  //     `users/${user.uid}`
  //   );

  //   const data = {
  //     uid: user.uid,
  //     email: user.email,
  //     displayName: user.displayName,
  //     photoURL: user.photoURL,
  //   };

  //   return userRef.set(data, { merge: true });
  // }

  // async signOut() {
  //   // this.afAuth.
  //   // await this.afAuth.auth.signOut();
  //   this.afAuth.signOut();
  //   this.router.navigate(['/']);
  // }

  // Get the auth state, then fetch the Firestore user document or return null
}
