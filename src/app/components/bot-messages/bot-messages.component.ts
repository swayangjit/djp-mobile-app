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
  navigated: boolean = false
  startRecording: boolean = false;
  duration = 0;
  durationDisplay = '';
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
      if(name == "back" && !this.navigated) {
        this.navigated = true;
        console.log('bot message back event ');
        this.handleBackNavigation();
      }
    })
    Keyboard.addListener('keyboardWillShow', () => {
      console.log('keyboard will show');
      this.content.scrollToBottom();
    })  
    this.record.startEndEvent$.subscribe((res: any) => {
      this.startRecording = res;
      this.calculation();
    });
    this.record.botEventRecorded$.subscribe((res: any) => {
      console.log('record event ', res);
      if(res.file) {
        this.chat = {message: '', messageType: '', audio: {file: '', duration: '', play: false}, type: 'sent', time: new Date().toLocaleTimeString('en', {hour: '2-digit', minute:'2-digit'}), timeStamp: ''}
        this.ngZone.run(() => {
          this.chat.messageType = 'audio';
          this.chat.audio = {file: res.file, duration: this.durationDisplay, play: false};
          this.chat.timeStamp = Date.now();
        })
        this.botMessages.push(this.chat);
        this.content.scrollToBottom(100).then(() => {
          this.content.scrollToBottom(100)
        })
        // Api call and response from bot, replace laoding text 
        this.botMessages.push(this.defaultLoaderMsg);
      }
    })
    this.content.scrollToBottom(100).then(() => {
      this.content.scrollToBottom(100)
    })
  }
  
  ionViewWillEnter() {
    this.navigated = false;
  }
  
  ngAfterViewInit(): void {
    this.record.gestureControl(this.recordbtn);
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
    this.chat = {message: '', messageType: 'text', type: 'sent', time: new Date().toLocaleTimeString('en', {hour: '2-digit', minute:'2-digit'}), timeStamp: ''}
    if(this.textMessage.length > 0) {
      Keyboard.hide();
      this.chat.message = this.textMessage;
      this.chat.timeStamp = Date.now()
      this.textMessage = "";
      this.botMessages.push(this.chat);
      this.content.scrollToBottom(100).then(() => {
        this.content.scrollToBottom(100)
      })
      // Api call and response from bot, replace laoding text 
      this.botMessages.push(this.defaultLoaderMsg);
      this.content.scrollToBottom(100).then(() => {
        this.content.scrollToBottom(100)
      })
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

  handleBackNavigation() {
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
    } else {
      this.botMessageEvent.emit({audio: 0, text: 0, totalCount: 0})
    }
  }

  cancelRecording() {
    console.log('cancel recording');
    this.record.stopRecognition('audio');
    this.startRecording = false;
  }

  calculation() {
    if(!this.startRecording) {
      this.duration = 0;
      this.durationDisplay = '';
      return;
    }

    this.duration += 1;
    const min = Math.floor(this.duration / 60);
    const sec = (this.duration %60).toString().padStart(2, '0');
    this.durationDisplay = `${min}:${sec}`;

    setTimeout(() => {
      this.calculation();
    }, 1000);
  }

  onLongPressStart() {
    console.log('long press start');
    this.record.startRecognition();
  }

  onLongPressEnd() {
    console.log('long press end');
    this.record.stopRecognition('audio');
  }
}
