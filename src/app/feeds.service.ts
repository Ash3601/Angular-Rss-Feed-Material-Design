import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Feed } from 'src/app/feed.model';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { AngularFireAuth } from '@angular/fire/auth';

import { auth } from 'firebase/app';

@Injectable({
  providedIn: 'root',
})
export class FeedsService {
  private userPath;
  private dbPath = '/feeds/';
  feeds: AngularFireList<Feed> = null;
  constructor(
    private db: AngularFireDatabase,
    private authService: AuthService,
    public fireAuth: AngularFireAuth // private authService: AuthService
  ) {
    console.log('Feed service', this.authService.getUserId());
    // this.userPath = this.getUserId();
    // console.log('currentUser', this.userPath);
    // this.dbPath = this.userPath + '/feeds';
    // this.feeds = db.list(this.dbPath);
  }

  getFeeds(userId: string) {
    return this.db.list(userId + this.dbPath).snapshotChanges();
  }

  createFeeds(userId: string, feed: Feed) {
    return this.db.list(userId + this.dbPath).push(feed);

    // return this.firestore.collection('feeds').add(feed);
  }

  editFeeds(
    userId: string,
    feeds: Feed[],
    feedKeys: string[],
    prevIdx: number,
    curIdx: number
  ) {
    for (let i = prevIdx; i <= curIdx; i++) {
      let newFeed = {
        id: '1',
        feed: feeds[i],
      };
      this.db.object(userId + '/feeds/' + feedKeys[i]).update(newFeed);
    }
  }

  updateFeed(userId: string, feedKey: string, feed: Feed) {
    this.db.object(userId + '/feeds/' + feedKey).update(feed);
  }

  deleteFeed(userId: string, key: string): Promise<void> {
    return this.db.object(userId + this.dbPath + key).remove();
    // return this.feeds.remove(key);
  }

  getFeedList(): AngularFireList<Feed> {
    return this.feeds;
  }

  login() {
    this.fireAuth.signInWithPopup(new auth.GoogleAuthProvider());
  }
  logout() {
    this.fireAuth.signOut();
  }

  getUserId() {
    return this.authService.currentUserId;
  }
}
