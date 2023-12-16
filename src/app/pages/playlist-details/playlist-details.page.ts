import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PlayerType } from 'src/app/appConstants';
import { AppHeaderService } from 'src/app/services';

@Component({
  selector: 'app-playlist-details',
  templateUrl: './playlist-details.page.html',
  styleUrls: ['./playlist-details.page.scss'],
})
export class PlaylistDetailsPage implements OnInit {
  playContentObject: any;
  playlists: Array<any> = [];
  mimeType = PlayerType;

  constructor(private router: Router,
    private headerService: AppHeaderService) {
    let extras = this.router.getCurrentNavigation()?.extras;
    if (extras) {
      this.playContentObject = extras.state?.['playlist'];
      this.playlists = this.playContentObject['playListcontentList'];
      console.log('playlists', this.playlists)
    }
  }

  ngOnInit() {
    this.headerService.showHeader('My Playlist', true, ['edit'])
    this.headerService.headerEventEmitted$.subscribe((event) => {
      if (event === 'edit') {
        this.router.navigate(['/create-playlist'], {state: {playlists: this.playContentObject, islocal: true}})
      }
    })
  }

  ionViewWillEnter() {
  }

  async playContent(content: any) {
    await this.router.navigate(['/player'], {state: {content}});
  }

  moreOtions(content: any) {}

}
