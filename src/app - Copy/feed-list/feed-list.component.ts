import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FeedsService } from '../feeds.service';
import { Feed } from '../feed.model';
import { EventEmitter, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { merge, fromEvent, Observable, Observer } from 'rxjs';
import { filter, map } from 'rxjs/operators';
// import { ConsoleReporter } from 'jasmine';

export interface PeriodicElement {
  feed: string;
}

const ELEMENT_DATA: PeriodicElement[] = [{ feed: 'blah' }];

@Component({
  selector: 'app-feed-list',
  templateUrl: './feed-list.component.html',
  styleUrls: ['./feed-list.component.css'],
})
export class FeedListComponent implements OnInit, OnDestroy {
  @Output() updateValue: EventEmitter<any> = new EventEmitter();

  displayedColumns: string[] = ['URL'];
  dataSource = ELEMENT_DATA;
  showSpinner = false;
  feeds: any;
  savedFeeds;
  feedKeys;
  feedValue = null;
  currentFeedKey = null;
  isOnline = false;
  keyStrokes;
  isUpdating = false;

  showInfo(val) {
    console.log(val);
  }

  // Drag and Drop
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.savedFeeds, event.previousIndex, event.currentIndex);
    this.feedService.editFeeds(this.savedFeeds, this.feedKeys);
  }

  onKey(event: any) {
    this.keyStrokes = event.target.value;
    console.log('Keystrokes', this.keyStrokes);
    if (this.keyStrokes.length == 0) {
      this.isUpdating = false;
      document.getElementById('btn-add').innerHTML = 'Add';
    }
  }

  edit(id: string, val: string) {
    this.currentFeedKey = id;
    this.isUpdating = true;
    document.getElementById('btn-add').innerHTML = 'Update';
    this.updateValue.emit('bla');
    this.changeLabelName('text-input', val);
    console.log(val);
  }
  delete(id: string, idx: number) {
    this.feedService.deleteFeed(id).catch((err) => console.log(err));
    this.feedKeys.splice(idx);
    this.savedFeeds.splice(idx);
    let snackBarRef = this._snackBar.open('URL deleted successfully');
  }
  changeLabelName(lbl, val) {
    var obj: any = document.getElementById(lbl);
    obj.value = val;
  }

  @Output('cdkDropListDropped')
  dropped: EventEmitter<CdkDragDrop<any, any>> = new EventEmitter();

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

  createOnline$() {
    return merge<boolean>(
      fromEvent(window, 'offline').pipe(map(() => false)),
      fromEvent(window, 'online').pipe(map(() => true)),
      new Observable((sub: Observer<boolean>) => {
        sub.next(navigator.onLine);
        sub.complete();
      })
    );
  }

  constructor(
    private feedService: FeedsService,
    private _snackBar: MatSnackBar // private connectionService: Connection
  ) {
    // this.isOnline = navigator.onLine;
  }

  ngOnInit(): void {
    // console.log('this.feedService.editFeeds()');

    // console.log(this.feedService.editFeeds());
    this.createOnline$().subscribe((isOnline) => {
      this.isOnline = isOnline;
    });
    if (!this.isOnline) {
      // alert('You are offline');
      this._snackBar.open('You are offline');
      return;
    }

    this.showSpinner = true;
    this.feeds = this.feedService.getFeeds();
    this.savedFeeds = new Array(this.feeds.length).fill(0);
    this.feedKeys = new Array(this.feeds.length);
    // console.log('before saved feeds');
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

    // this.showSpinner = false;
    // .then((res) => {})
    // .finally((res) => {
    //   this.showSpinner = false;
    // });
    // this.savedFeeds = this.movies;
    // for (let i = 0; i < this.feeds.length; i++) {
    //   console.log('Feed is ', this.feeds[i]['feed']);
    //   this.savedFeeds[i] = this.feeds[i]['feed'];
    // }
    // console.log(this.feeds);
  }
  create(feed: Feed) {
    this.feedService.createFeeds(feed);
  }

  ngOnDestroy() {
    this.feeds.unsubscribe();
    // this.valueChanges.unsubscribe();
    // this.statusChanges.unsubscribe();
  }
}
