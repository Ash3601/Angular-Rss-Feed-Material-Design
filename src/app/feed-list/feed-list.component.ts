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

  /* DRAG AND DROP FUNCTIONS */

  // Drag and Drop
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.savedFeeds, event.previousIndex, event.currentIndex);
    this.feedService.editFeeds(this.savedFeeds, this.feedKeys);
  }

  /* UTILITY FUNCTIONS */

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
    this.feedService.createFeeds(feed);
  }

  edit(id: string, val: string) {
    this.currentFeedKey = id;
    this.isUpdating = true;
    document.getElementById('btn-add').innerHTML = 'Update';
    // this.updateValue.emit('bla');
    this.changeLabelName('text-input', val);
  }

  delete(id: string, idx: number) {
    this.feedService.deleteFeed(id).catch((err) => console.log(err));
    this.feedKeys.splice(idx);
    this.savedFeeds.splice(idx);
    let snackBarRef = this._snackBar.open('URL deleted successfully');
  }

  addFeedToDb(title: string, $event) {
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
      this.feedService.updateFeed(this.currentFeedKey, tmpFeed);
      this.changeLabelName('text-input', '');
      this.isUpdating = false;
      document.getElementById('btn-add').innerHTML = 'Add';
      let snackBarRef = this._snackBar.open('Successfully updated');
    }
  }
  /* --------------------------------------- */
  constructor(
    private feedService: FeedsService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.showSpinner = true;
    this.feeds = this.feedService.getFeeds();
    this.savedFeeds = new Array(this.feeds.length).fill(0);
    this.feedKeys = new Array(this.feeds.length);
    this.feeds.subscribe(
      (res) => {
        var n = res.length;
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
  }

  ngOnDestroy() {
    this.feeds.unsubscribe();
  }
}
