import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FeedsService } from '../feeds.service';
import { Feed } from '../feed.model';
import { EventEmitter, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { merge, fromEvent, Observable, Observer } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import {
  AngularFireList,
  AngularFireObject,
} from '@angular/fire/database/database';
import { ConnectionService } from 'ng-connection-service';
// import { auth } from 'firebase/app';
// import { AngularFireAuth } from '@angular/fire/auth';
import { AuthService } from '../auth.service';
// import * as firebase from 'firebase';
import { firebase } from '@firebase/app';

import { AngularFireAuth } from '@angular/fire/auth';

import { auth } from 'firebase/app';
import { Router } from '@angular/router';

// import { AngularFireAuth } from '@angular/fire/auth';

// import { auth } from 'firebase/app';

@Component({
  selector: 'app-feed-list',
  templateUrl: './feed-list.component.html',
  styleUrls: ['./feed-list.component.css'],
})
export class FeedListComponent implements OnInit, OnDestroy {
  /* VARIABLES */
  showSpinner = false;
  feeds: any;
  savedFeeds: Feed[];
  feedKeys: string[];
  feedValue: string = ''; // used to get the value from the Input
  currentFeedKey: string = null; // used to update the feed
  keyStrokes: string;
  isUpdating: boolean = false;
  isConnected = true;
  status: string;
  userId: string;

  /* DRAG AND DROP FUNCTIONS */

  // Drag and Drop
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.savedFeeds, event.previousIndex, event.currentIndex);
    this.feedService.editFeeds(
      this.userId,
      this.savedFeeds,
      this.feedKeys,
      event.previousIndex,
      event.currentIndex
    );
  }

  /* UTILITY FUNCTIONS */
  isOnline(): boolean {
    if (!this.isConnected || this.status === 'OFFLINE') {
      console.log('Offline');
      this._snackBar.open('You are offline!');
      return false;
    }
    return true;
  }

  clearInputField() {
    // this.
    this.changeLabelName('text-input', '');
  }

  changeLabelName(lbl, val) {
    var obj: any = document.getElementById(lbl);
    obj.value = val;
  }

  validURL(str) {
    var pattern = new RegExp(
      '^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$',
      'i'
    ); // fragment locator
    return !!pattern.test(str);
  }

  onKey(event: any) {
    this.keyStrokes = event.target.value;
    if (this.keyStrokes.length == 0) {
      this.isUpdating = false;
      document.getElementById('btn-add').innerHTML = 'Add';
    }
  }
  /* ------------------------ */

  /* CRUD OPERATIONS */

  create(feed: Feed) {
    this.feedService.createFeeds(this.userId, feed);
  }

  edit(id: string, val: string) {
    if (!this.isOnline()) {
      return;
    }
    this.currentFeedKey = id;
    this.isUpdating = true;
    document.getElementById('btn-add').innerHTML = 'Update';
    // this.updateValue.emit('bla');
    this.changeLabelName('text-input', val);
  }

  delete(id: string, idx: number) {
    if (!this.isOnline()) {
      return;
    }
    this.feedService
      .deleteFeed(this.userId, id)
      .catch((err) => console.log(err));
    this.feedKeys.splice(idx);
    this.savedFeeds.splice(idx);
    let snackBarRef = this._snackBar.open('URL deleted successfully');
  }

  addFeedToDb(title: string, $event) {
    if (!this.isOnline()) {
      return;
    }
    event.preventDefault();
    this.feedValue = title;
    if (this.validURL(this.feedValue) == false) {
      let snackBarRef = this._snackBar.open('URL is not valid');
      return;
    }
    var tmpFeed = { id: title, feed: title };
    if (this.isUpdating == false) {
      if (title.length > 0) {
        this.create(tmpFeed);

        // Simple message.
        let snackBarRef = this._snackBar.open('Added to the list');
        this.changeLabelName('text-input', '');
      }
    } else {
      this.feedService.updateFeed(this.userId, this.currentFeedKey, tmpFeed);
      this.changeLabelName('text-input', '');
      this.isUpdating = false;
      document.getElementById('btn-add').innerHTML = 'Add';
      let snackBarRef = this._snackBar.open('Successfully updated');
    }
  }
  /* --------------------------------------- */

  login() {
    this.fireAuth.signInWithPopup(new auth.GoogleAuthProvider());
  }
  logout() {
    this.fireAuth.signOut();
  }

  getUserId() {
    return this.authService.currentUserId;
  }
  constructor(
    private feedService: FeedsService,
    private _snackBar: MatSnackBar,
    private connectionService: ConnectionService,
    public fireAuth: AngularFireAuth,
    private authService: AuthService,
    private router: Router
  ) {
    this.connectionService.monitor().subscribe((isConnected) => {
      this.isConnected = isConnected;
      if (this.isConnected) {
        this.status = 'ONLINE';
      } else {
        this.status = 'OFFLINE';
      }
      // this.userId = this.getUserId();
      this.userId = authService.getUserId();
      console.log('Constructor uid', this.userId);
    });
    // this.fireAuth.signInWithPopup(new auth.GoogleAuthProvider());
    // this.fireAuth.signInWithPopup(new auth.GoogleAuthProvider());
  }

  ngOnInit(): void {
    // Check if the application is online or not
    if (!this.isOnline()) {
      return;
    }
    this.userId = this.authService.getUserId();
    this.userId = this.getUserId();
    // Use auth service to check auth
    if (!this.authService.isAuthenticated) {
      console.log('User is not auth');
      this.router.navigate(['']);
      // this.fireAuth.signInWithPopup(new auth.GoogleAuthProvider());
      // this.login();
    }
    this.showSpinner = true;
    console.log('This is the user id', this.userId);
    this.feeds = this.feedService.getFeeds(this.userId);
    console.log(this.feeds);
    // this.savedFeeds = new Array(this.feeds.length).fill(0);
    this.savedFeeds = new Array();

    this.feedKeys = new Array(this.feeds.length);

    this.feeds.subscribe(
      (res) => {
        var n = res.length;
        if (n == 0) {
          this._snackBar.open('No feeds available');
          this.showSpinner = false;
          return;
        }
        for (let i = 0; i < n; i++) {
          this.feedKeys[i] = res[i].key;
          this.savedFeeds[i] = res[i].payload.val().feed;
          // console.log(res[i].payload.val().feed);
          if (i == n - 1) {
            this.showSpinner = false;
          }
        }
      },
      (err) => {
        // console.log('Error in fetching data');
        this._snackBar.open('An error occured');
        this.showSpinner = false;
      },
      () => {
        this.showSpinner = false;
      }
    );

    // if (!this.feeds[0]) {
    //   this._snackBar.open('No feeds available');
    //   this.showSpinner = false;
    //   // return;
    // }
  }

  ngOnDestroy() {
    // this.feeds.unsubscribe();
  }
}
