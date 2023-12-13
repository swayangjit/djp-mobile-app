import { Location } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AppHeaderService } from 'src/app/services';
import { RecordingService } from 'src/app/services/recording.service';
import { OnTabViewWillEnter } from 'src/app/tabs/on-tabs-view-will-enter';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit, OnTabViewWillEnter, AfterViewInit {
  @ViewChild('searchInput', { static: false }) searchBar: any;
  @ViewChild('recordbtn', {read: ElementRef}) recordbtn: ElementRef | any;
  constructor(
    private headerService: AppHeaderService,
    private location: Location,
    private record: RecordingService
  ) { }
  
  ngAfterViewInit(): void {
    this.record.gestureControl(this.recordbtn, 'base64');
  }

  tabViewWillEnter(): void {
    this.headerService.hideHeader();
    this.headerService.showStatusBar();
  }

  ngOnInit() {
    this.headerService.headerEventEmitted$.subscribe((name: any) => {
      if(name == "back") {
        this.location.back();
      } else if(name == "record") {
        this.record.startRecognition()
      }
    })
  }

  navigateBack() {
    this.location.back();
  }
  ionViewWillEnter() {
    this.headerService.hideHeader();
    this.headerService.showStatusBar();
  }
}
