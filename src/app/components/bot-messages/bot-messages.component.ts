import { AfterViewInit, Component, ElementRef, EventEmitter, Input, NgZone, OnInit, Output, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { BotMessage, Sakhi } from 'src/app/appConstants';
import { AppHeaderService, BotApiService, RecordingService } from 'src/app/services';
import { Keyboard } from "@capacitor/keyboard";
import { Directory, Filesystem } from '@capacitor/filesystem';
import { TranslateService } from '@ngx-translate/core';

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
  disabled = false;
  constructor(
    private record: RecordingService,
    private ngZone: NgZone,
    private headerService: AppHeaderService,
    private messageApi: BotApiService,
    private translate: TranslateService
  ) { 
    this.defaultLoaderMsg = {message: this.translate.instant('Loading...'), messageType: 'text', displayMsg: this.translate.instant('Loading...'), type: 'received', time: '', timeStamp: '', readMore: false};
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
        this.chat = {message: '', messageType: '', displayMsg:"", audio: {file: '', duration: '', play: false}, type: 'sent', time: new Date().toLocaleTimeString('en', {hour: '2-digit', minute:'2-digit'}), timeStamp: '', readMore: false}
        this.ngZone.run(() => {
          this.chat.messageType = 'audio';
          this.chat.audio = {file: res.file, base64Data: res.data, duration: res.duration, play: false};
          this.chat.timeStamp = Date.now();
        })
        this.botMessages.push(this.chat);
        this.content.scrollToBottom(100).then(() => {
          this.content.scrollToBottom(100)
        })
        this.botMessages.push(this.defaultLoaderMsg);
        this.content.scrollToBottom(100).then(() => {
          this.content.scrollToBottom(100)
        })
        // Api call and response from bot, replace laoding text 
        this.makeBotAPICall('', res.data);
      }
    })
  }
  
  ionViewWillEnter() {
    this.botMessages = [];
    this.navigated = false;
  }
  
  ngAfterViewInit(): void {
    this.record.gestureControl(this.recordbtn);
  }

  initialiseBot() {
    // this.botMessages.push(this.defaultLoaderMsg);
    if(this.config.type == Sakhi.STORY) {

    } else if(this.config.type == Sakhi.TEACHER) {

    } else if(this.config.type == Sakhi.PARENT) {

    }
    // API call to get the innitial bot messages
  }

  async handleMessage() {
    this.chat = {message: '', messageType: 'text', type: 'sent', displayMsg:"", time: new Date().toLocaleTimeString('en', {hour: '2-digit', minute:'2-digit'}), timeStamp: '', readMore: false}
    if(this.textMessage.replace(/\s/g, '').length > 0) {
      Keyboard.hide();
      this.chat.message = this.textMessage;
      this.chat.displayMsg = this.textMessage;
      this.chat.timeStamp = Date.now()
      this.botMessages.push(this.chat);
      this.content.scrollToBottom(100).then(() => {
        this.content.scrollToBottom(100)
      })
      this.botMessages.push(this.defaultLoaderMsg);
      this.content.scrollToBottom(100).then(() => {
        this.content.scrollToBottom(100)
      })
      await this.makeBotAPICall(this.textMessage, '');
    }
  }

  async makeBotAPICall(text: string, audio: string) {
    this.textMessage = "";
    this.disabled = true;
    // Api call and response from bot, replace laoding text
    await this.messageApi.getBotMessage(text, audio).then(data => {
      let index = this.botMessages.length;
      this.botMessages = JSON.parse(JSON.stringify(this.botMessages))
      console.log('length ', index, index-1);
      this.disabled = false;
      if(data.output) {
        this.botMessages.forEach((msg, i) => {
          if(i == index-1 && msg.type === 'received') {
            msg.time = new Date().toLocaleTimeString('en', {hour: '2-digit', minute:'2-digit'})
            msg.timeStamp = Date.now();
            if(data.output?.text) {
              msg.message = data.output.text;
              if(data.output.text.length > 200 && (data.output.text.length-200 > 100)) {
                msg.displayMsg = data.output.text.substring(0, 200);
                msg.readMore = true;
              }
              if(data.output?.audio) {
                let audioMsg = {message: '', messageType: '', displayMsg: "", audio: {file: '', duration: '', play: false}, type: 'received', time: new Date().toLocaleTimeString('en', {hour: '2-digit', minute:'2-digit'}), timeStamp: Date.now(), readMore: false}
                audioMsg.audio = {file: data.output?.audio, duration: "", play: false}
                audioMsg.messageType = 'audio';
                this.botMessages.push(audioMsg);
                this.content.scrollToBottom(300).then(() => {
                  this.content.scrollToBottom(300).then()
                });
              }
            } else if(data.detail) {
              msg.message = data.detail;
            }
            console.log('botmessage ', this.botMessages);
          } 
        })
      }
    })
  }

  readmore(msg: any) {
    let textDisplayed = msg.displayMsg;
    let prevLeng = msg.displayMsg.length
    if(msg.message !== textDisplayed) {
      console.log("next msg ", msg.message.length, msg.displayMsg.length,textDisplayed.length,  msg.message.substring((textDisplayed.length-1), 200));
      if(msg.message.length < prevLeng+200) {
        msg.displayMsg = textDisplayed + msg.message.substring(prevLeng, msg.message.length);
      } else {
        msg.displayMsg = textDisplayed + msg.message.substring(prevLeng, prevLeng+200);
      }
      msg.readMore = true;
      this.content.scrollToBottom(300).then(() => {
        this.content.scrollToBottom(300).then()
      });
    } else {
      msg.readMore = false;
    }
  }

  async playFile(msg: any) {
    let audio = msg.audio;
    audio.play = !audio.play;
    let url = '';
    this.botMessages.forEach((msg) => {
      if(msg.audio?.play) {
        msg.audio.play = false;
      }
    })
    let audioRef: HTMLAudioElement;
    if(msg.type === 'sent') {
      const audioFile = await Filesystem.readFile({
        path: audio.file,
        directory: Directory.Data
      });
      console.log('audio file', audioFile);
      const base64Sound = audioFile.data;
      url = `data:audio/aac;base64,${base64Sound}`
    } else if(msg.type === "received") {
      url = audio.file;
    }
    audioRef = new Audio(url);
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
