import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSliderModule } from '@angular/material/slider';
import { FeedListComponent } from './feed-list/feed-list.component';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatListModule, MatListIconCssMatStyler } from '@angular/material/list';
import { AngularFireModule } from '@angular/fire';
// import { AngularFirestoreModule } from '@angular/fire/firestore/public_api';
import { environment } from '../environments/environment';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { MatIconModule } from '@angular/material/icon';
import { AngularFireAuthModule, AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database/database';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { AuthService } from './auth.service';
import { FeedsService } from './feeds.service';

@NgModule({
  declarations: [
    AppComponent,
    FeedListComponent,
    PageNotFoundComponent,
    UserProfileComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSliderModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatSnackBarModule,
    DragDropModule,
    MatProgressSpinnerModule,
    MatIconModule,
    AngularFirestoreModule,
    AngularFireAuthModule,

    AngularFireModule.initializeApp(
      environment.firebaseConfig,
      'Rss-Feed-List'
    ),
    // Only required for database features
    // Only required for auth features, // Only required for storage features
    MatListModule,
    // MatListIconCssMatStyler,
  ],
  providers: [AuthService, AngularFireAuth, FeedsService],
  bootstrap: [AppComponent],
})
export class AppModule {}
