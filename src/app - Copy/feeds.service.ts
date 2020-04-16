import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Feed } from 'src/app/feed.model';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FeedsService {
  private dbPath = '/feeds';
  feeds: AngularFireList<Feed> = null;
  constructor(private db: AngularFireDatabase) {
    this.feeds = db.list(this.dbPath);
  }

  getFeeds() {
    return this.db.list('feeds').snapshotChanges();
  }
  createFeeds(feed: Feed) {
    return this.db.list('feeds').push(feed);

    // return this.firestore.collection('feeds').add(feed);
  }

  editFeeds(feeds: Feed[], feedKeys: string) {
    for (let i = 0; i < feeds.length; i++) {
      let newFeed = {
        id: '1',
        feed: feeds[i],
      };
      this.db.object('/feeds/' + feedKeys[i]).set(newFeed);
    }
  }

  updateFeed(feedKey: string, feed: Feed) {
    this.db.object('/feeds/' + feedKey).update(feed);
  }

  deleteFeed(key: string): Promise<void> {
    return this.feeds.remove(key);
  }

  getFeedList(): AngularFireList<Feed> {
    return this.feeds;
  }
}
