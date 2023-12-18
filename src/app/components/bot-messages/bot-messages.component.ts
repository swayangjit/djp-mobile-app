import { AfterViewInit, Component, ElementRef, EventEmitter, Input, NgZone, OnInit, Output, ViewChild } from '@angular/core';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { IonContent } from '@ionic/angular';
import { BotMessage, Sakhi } from 'src/app/appConstants';
import { AppHeaderService, RecordingService } from 'src/app/services';
import { Keyboard } from "@capacitor/keyboard";

@Component({
  selector: 'app-bot-messages',
  templateUrl: './bot-messages.component.html',
  styleUrls: ['./bot-messages.component.scss'],
})
export class BotMessagesComponent  implements OnInit, AfterViewInit {
  botMessages!: Array<BotMessage>
  textMessage: string = ''
  chat!: BotMessage;
  defaultLoaderMsg!: BotMessage;
  @Input() config: any;
  @Output() botMessageEvent = new EventEmitter();
  @ViewChild('recordbtn', {read: ElementRef}) recordbtn: ElementRef | any;
  @ViewChild(IonContent, {static: true}) private content: any;
  constructor(
    private record: RecordingService,
    private ngZone: NgZone,
    private headerService: AppHeaderService
  ) { 
    this.defaultLoaderMsg = {message: 'Loading...', messageType: 'text', type: 'received', time: new Date().toLocaleTimeString('en', {hour: '2-digit', minute:'2-digit'}), timeStamp: Date.now()};
    this.botMessages = [];
    this.initialiseBot();
  }

  ngOnInit() {
    this.headerService.headerEventEmitted$.subscribe((name: any) => {
      if(name == "back") {
        console.log('bot message back event ');
        if(this.botMessages.length > 0) {
          let result = {audio: 0, text: 0};
          this.botMessages.forEach(msg => {
            if(msg.messageType == 'text'){
              result.text++;
            } else if(msg.messageType == 'audio'){
              result.audio++;
            }
          });
          console.log('result count ', result);
          this.botMessageEvent.emit({audio: result.audio, text: result.text, totalCount: this.botMessages.length})
        }
      }
    })
    Keyboard.addListener('keyboardWillShow', () => {
      console.log('keyboard will show');
      this.content.scrollToBottom();
    })  
    this.record.botEventRecorded$.subscribe((res: any) => {
      this.chat = {message: '', messageType: '', audio: {file: '', duration: '', play: false}, type: 'sent', time: new Date().toLocaleTimeString('en', {hour: '2-digit', minute:'2-digit'}), timeStamp: ''}
      console.log('message ', res);
      this.ngZone.run(() => {
        console.log("this.botMessages length ", this.botMessages);
        this.chat.messageType = 'audio';
        this.chat.audio = {file: res.file, duration: res.duration, play: false};
        this.chat.timeStamp = Date.now();
        console.log('chat ', this.chat);
        console.log("this.botMessages length ", this.botMessages);
      })
      this.botMessages.push(this.chat);
      // Api call and response from bot, replace laoding text 
      this.botMessages.push(this.defaultLoaderMsg);
    })
    this.content.scrollToBottom(100).then(() => {
      this.content.scrollToBottom(100)
    })
  }
  
  ngAfterViewInit(): void {
    this.record.gestureControl(this.recordbtn, 'audio');
  }

  initialiseBot() {
    this.botMessages.push(this.defaultLoaderMsg);
    if(this.config.type == Sakhi.STORY) {

    } else if(this.config.type == Sakhi.TEACHER) {

    } else if(this.config.type == Sakhi.PARENT) {

    }
    // API call to get the innitial bot messages
  }

  handleMessage() {
    console.log('message ', this.textMessage);
    this.chat = {message: '', messageType: 'text', type: 'sent', time: new Date().toLocaleTimeString('en', {hour: '2-digit', minute:'2-digit'}), timeStamp: ''}
    if(this.textMessage.length > 0) {
      Keyboard.hide();
      this.chat.message = this.textMessage;
      this.chat.timeStamp = Date.now()
      console.log('chat ', this.chat);
      this.textMessage = "";
      this.botMessages.push(this.chat);
      this.content.scrollToBottom(100).then(() => {
        this.content.scrollToBottom(100)
      })
      // Api call and response from bot, replace laoding text 
      this.botMessages.push(this.defaultLoaderMsg);
      console.log("botMessages ", this.botMessages.length);
    }
  }

  async playFile(audio: any) {
    audio.play = !audio.play;
    const audioFile = await Filesystem.readFile({
      path: audio.file,
      directory: Directory.Data
    });
    console.log('audio file', audioFile);
    const base64Sound = audioFile.data;
    const audioRef = new Audio(`data:audio/aac;base64,${base64Sound}`)
    console.log('audio audioRef ', audioRef);
    audioRef.controls = true;
    audioRef.oncanplaythrough = () => audioRef.play();
    audioRef.onended = () => audio.play = false;
    audioRef.load();
  }
}
