import { Component } from '@angular/core';
import { AppHeaderService, UtilService } from 'src/app/services';

@Component({
  selector: 'app-story',
  templateUrl: 'story.page.html',
  styleUrls: ['story.page.scss']
})
export class StoryPage {

  constructor(private headerService: AppHeaderService,
    private utilService: UtilService) {
    this.headerService.showHeader(this.utilService.translateMessage("Today's Story"));
  }

}
