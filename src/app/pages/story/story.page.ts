import { Component, OnInit } from '@angular/core';
import { AppHeaderService, UtilService } from '../../../app/services';

@Component({
  selector: 'app-story',
  templateUrl: 'story.page.html',
  styleUrls: ['story.page.scss']
})
export class StoryPage implements OnInit{

  constructor(private headerService: AppHeaderService,
    private utilService: UtilService) {
    }

    ngOnInit() {
    }
    
    ionViewWillEnter()  {
      this.headerService.showHeader("Stories");
    }

}
