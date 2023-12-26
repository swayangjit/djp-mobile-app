import { AfterViewInit, Component, ElementRef, EventEmitter, Input, NgZone, OnInit, Output, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { BotMessage, Sakhi } from 'src/app/appConstants';
import { AppHeaderService, BotApiService, RecordingService } from 'src/app/services';
import { Keyboard } from "@capacitor/keyboard";
import { Directory, Filesystem } from '@capacitor/filesystem';
import { TranslateService } from '@ngx-translate/core';
import { ApiModule } from 'src/app/services/api/api.module';

@Component({
  selector: 'app-bot-messages',
  templateUrl: './bot-messages.component.html',
  styleUrls: ['./bot-messages.component.scss'],
})
export class BotMessagesComponent  implements OnInit, AfterViewInit {
  botMessages: Array<BotMessage> = [];
  textMessage: string = ''
  chat!: BotMessage;
  defaultLoaderMsg!: BotMessage;
  botStartTimeStamp = Date.now();
  @Input() config: any = {};
  @Output() botMessageEvent = new EventEmitter();
  @ViewChild('recordbtn', { read: ElementRef }) recordbtn: ElementRef | any;
  @ViewChild(IonContent, { static: true }) private content: any;
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
    private translate: TranslateService,
  ) { 
    this.defaultLoaderMsg = {message: this.translate.instant('Loading...'), messageType: 'text', displayMsg: this.translate.instant('Loading...'), type: 'received', time: '', timeStamp: '', readMore: false};
    this.botMessages = [];
  }

  ngOnInit() {
    this.initialiseBot();
    this.headerService.headerEventEmitted$.subscribe((name: any) => {
      if (name == "back" && !this.navigated) {
        this.navigated = true;
        console.log('bot message back event ');
        this.handleBackNavigation();
        this.botMessages = [];
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
      if (res?.file) {
        this.chat = { message: '', messageType: '', displayMsg: "", audio: { file: '', duration: '', play: false }, type: 'sent', time: new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' }), timeStamp: '', readMore: false }
        this.ngZone.run(() => {
          this.chat.messageType = 'audio';
          this.chat.audio = { file: res.file, base64Data: res.data, duration: res.duration, play: false };
          this.chat.timeStamp = Date.now();
          this.botMessages.push(this.chat);
          this.content.scrollToBottom(300).then(() => {
            this.content.scrollToBottom(300)
          })
          this.botMessages.push(this.defaultLoaderMsg);
          this.content.scrollToBottom(300).then(() => {
            this.content.scrollToBottom(300)
          })
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
    // get the prevoius msg based on config type
    let botRes: any = ApiModule.getInstance().getSakhiResponse();
    this.botMessages = [];
    if (this.config.type == Sakhi.STORY) {
      this.botMessages = botRes?.storySakhi ? botRes?.storySakhi : [];
    } else if (this.config.type == Sakhi.TEACHER) {
      this.botMessages = botRes?.teacherSakhi ? botRes.teacherSakhi : [];
    } else if (this.config.type == Sakhi.PARENT) {
      this.botMessages = botRes?.paretSakhi ? botRes.paretSakhi : [];
    }
  }

  async handleMessage() {
    this.chat = { message: '', messageType: 'text', type: 'sent', displayMsg: "", time: new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' }), timeStamp: '', readMore: false }
    if (this.textMessage.replace(/\s/g, '').length > 0) {
      Keyboard.hide();
      this.chat.message = this.textMessage;
      this.chat.displayMsg = this.textMessage;
      this.chat.timeStamp = Date.now()
      this.botMessages.push(this.chat);
      this.content.scrollToBottom(300).then(() => {
        this.content.scrollToBottom(300)
      })
      this.botMessages.push(this.defaultLoaderMsg);
      this.content.scrollToBottom(300).then(() => {
        this.content.scrollToBottom(300)
      })
      await this.makeBotAPICall(this.textMessage, '');
    }
  }

  makeBotAPICall(text: string, audio: string) {
    this.textMessage = "";
    this.disabled = true;
    // Api call and response from bot, replace laoding text
    let index = this.botMessages.length;
    this.botMessages = JSON.parse(JSON.stringify(this.botMessages));
    this.messageApi.getBotMessage(text, audio).then(result => {
      this.disabled = false;
      this.botMessages.forEach((msg, i) => {
        if (result.responseCode === 200) {
          let data = result.body;
          if(i == index-1 && msg.type === 'received') {
            msg.time = new Date().toLocaleTimeString('en', {hour: '2-digit', minute:'2-digit'})
            msg.timeStamp = Date.now();
            if (!!data.output) {
              msg.message = data.output?.text;
              if (data.output?.text.length > 200 && (data.output.text.length - 200 > 100)) {
                msg.displayMsg = data.output.text.substring(0, 200);
                msg.readMore = true;
              } else {
                msg.displayMsg = data.output?.text;
              }
              if (data.output?.audio) {
                let audioMsg = { message: '', messageType: '', displayMsg: "", audio: { file: '', duration: '', play: false }, type: 'received', time: new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' }), timeStamp: Date.now(), readMore: false }
                audioMsg.audio = { file: data.output?.audio, duration: "", play: false }
                audioMsg.messageType = 'audio';
                this.ngZone.run(() => {
                  this.botMessages.push(audioMsg);
                  this.content.scrollToBottom(300).then(() => {
                    this.content.scrollToBottom(300).then()
                  });
                })
              }
              this.content.scrollToBottom(300).then(() => {
                this.content.scrollToBottom(300).then()
              });
            }
          }
        } else {
          msg.message = result.errorMesg ? result.errorMesg : result.data?.detail ? result.data?.detail : "No Response";
          msg.displayMsg = msg.message;
          msg.time = new Date().toLocaleTimeString('en', {hour: '2-digit', minute:'2-digit'});
          msg.timeStamp = Date.now();
        }
      })
    }).catch(e => {
      this.disabled = false;
      console.log('catch error ', e);
      this.botMessages[index-1].message = "No Response";
      this.botMessages[index-1].displayMsg = "No Response";
      this.botMessages[index-1].time = new Date().toLocaleTimeString('en', {hour: '2-digit', minute:'2-digit'});
      this.botMessages[index-1].timeStamp = Date.now();
    })
  }

  readmore(msg: any) {
    let textDisplayed = msg.displayMsg;
    let prevLeng = msg.displayMsg.length
    if (msg.message !== textDisplayed) {
      if (msg.message.length < prevLeng + 200) {
        msg.displayMsg = textDisplayed + msg.message.substring(prevLeng, msg.message.length);
      } else {
        msg.displayMsg = textDisplayed + msg.message.substring(prevLeng, prevLeng + 200);
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
    let url = '';
    this.botMessages.forEach((msg) => {
      if (msg.audio?.play) {
        msg.audio.play = false;
      }
    })
    let audioRef: HTMLAudioElement;
    if (msg.type === 'sent') {
      const audioFile = await Filesystem.readFile({
        path: audio.file,
        directory: Directory.Data
      });
      console.log('audio file', audioFile);
      const base64Sound = audioFile.data;
      url = `data:audio/aac;base64,${base64Sound}`
      audio.play = !audio.play;
    } else if (msg.type === "received") {
      url = audio.file;
      audio.play = !audio.play;
    }
    audioRef = new Audio(url);
    audioRef.controls = true;
    audioRef.oncanplaythrough = () => audioRef.play();
    audioRef.onended = () => audio.play = false;
    audioRef.load();
  }

  handleBackNavigation() {
    let res = ApiModule.getInstance().getSakhiResponse();
    let sakiResp = {
      story: res.storySakhi,
      teacher: res.teacherSakhi,
      parent: res.paretSakhi
    }
    if(this.config.type == 'story') {
      sakiResp.story = this.botMessages
    } else if(this.config.type == 'teacher') {
      sakiResp.teacher = this.botMessages;
    } else if(this.config.type == 'parent') {
      sakiResp.parent = this.botMessages;
    }
    ApiModule.getInstance().setSakhiResponse(sakiResp);
    let botDuration = Date.now() - this.botStartTimeStamp;
    if (this.botMessages.length > 0) {
      let result = { audio: 0, text: 0 };
      this.botMessages.forEach(msg => {
        if (msg.messageType == 'text') {
          result.text++;
        } else if (msg.messageType == 'audio') {
          result.audio++;
        }
      });
      console.log('result count ', result);
      this.botMessageEvent.emit({ audio: result.audio, text: result.text, duration: botDuration/1000 })
    } else {
      this.botMessageEvent.emit({ audio: 0, text: 0, duration: botDuration/1000 })
    }
  }

  cancelRecording() {
    console.log('cancel recording');
    this.record.stopRecognition('audio');
    this.startRecording = false;
  }

  calculation() {
    if (!this.startRecording) {
      this.duration = 0;
      this.durationDisplay = '';
      return;
    }

    this.duration += 1;
    const min = Math.floor(this.duration / 60);
    const sec = (this.duration % 60).toString().padStart(2, '0');
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
