import {Injectable} from '@angular/core';

@Injectable()
export class TabsService {
  constructor() {}

  public hide() {
    let tabs: any = document.querySelectorAll('.tabbar');
    let tabsHome = document.querySelectorAll('.home-screen');
    let scrollContent = document.querySelectorAll('.scroll-content');
    if (tabs !== null && tabsHome !== null) {
      Object.keys(tabs).map((key: any) => {
        (tabs[key] as any).style.transform = 'translateY(5rem)';
      });
      Object.keys(tabsHome).map((key: any) => {
        (tabsHome[key] as any).style.transform = 'translateY(5.2rem)';
      });
      // fix for removing the margin if you got scorllable content
      setTimeout(() =>{
        Object.keys(scrollContent).map((key: any) => {
          (scrollContent[key] as any).style.marginBottom = '0';
        });
      })
    }
  }

  public show() {
    let tabs = document.querySelectorAll('.tabbar');
    let tabsHome = document.querySelectorAll('.home-screen');
    if (tabs !== null && tabsHome !== null) {
      Object.keys(tabsHome).map((key: any) => {
        (tabsHome[key] as any).style.transform = 'rotate(-45deg)';
      });
      Object.keys(tabs).map((key: any) => {
        (tabs[key] as any).style.transform = 'translateY(0px)';
      });
    }
  }
}