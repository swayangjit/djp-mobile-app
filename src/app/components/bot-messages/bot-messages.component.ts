import { AfterViewInit, Component, ElementRef, EventEmitter, Input, NgZone, OnInit, Output, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { BotMessage, Sakhi } from 'src/app/appConstants';
import { AppHeaderService, BotApiService, RecordingService } from 'src/app/services';
import { Keyboard } from "@capacitor/keyboard";
import { Directory, Filesystem } from '@capacitor/filesystem';
import { TranslateService } from '@ngx-translate/core';
import { ApiModule } from 'src/app/services/api/api.module';
import { VoiceRecorder } from 'capacitor-voice-recorder';
import { TelemetryGeneratorService } from 'src/app/services/telemetry/telemetry.generator.service';

@Component({
  selector: 'app-bot-messages',
  templateUrl: './bot-messages.component.html',
  styleUrls: ['./bot-messages.component.scss'],
})
export class BotMessagesComponent  implements OnInit, AfterViewInit {
  botMessages: Array<any> = [];
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
  audioRef!: HTMLAudioElement;
  constructor(
    private record: RecordingService,
    private ngZone: NgZone,
    private headerService: AppHeaderService,
    private messageApi: BotApiService,
    private translate: TranslateService,
    private telemetryGeneratorService: TelemetryGeneratorService
  ) { 
    this.defaultLoaderMsg = {message: this.translate.instant('Loading...'), messageType: 'text', displayMsg: this.translate.instant('Loading...'), type: 'received', time: '', timeStamp: '', readMore: false, likeMsg: false, dislikeMsg: false};
    this.botMessages = [];
    this.audioRef = new Audio();
  }

  ngOnInit() {
    this.initialiseBot();
    this.headerService.headerEventEmitted$.subscribe((name: any) => {
      if (name == "back" && !this.navigated) {
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

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        if(this.audioRef) {
          this.botMessages.forEach(msg => {
            if(msg.audio) {
              msg.audio.play = false;
            }
          })
          this.audioRef.pause();
        }
      }
    });
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
      if(this.botMessages.length === 0)
        this.botMessages.push({ messageType: 'text', displayMsg: "WELCOME_TO_STORY_SAKHI", type: 'received', time: new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' }), timeStamp: Date.now()})
    } else if (this.config.type == Sakhi.TEACHER) {
      this.botMessages = botRes?.teacherSakhi ? botRes.teacherSakhi : [];
      if(this.botMessages.length === 0)
        this.botMessages.push({ messageType: 'text', displayMsg: "WELCOME_TO_TEACHER_SAKHI", type: 'received', time: new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' }), timeStamp: Date.now()})
    } else if (this.config.type == Sakhi.PARENT) {
      this.botMessages = botRes?.paretSakhi ? botRes.paretSakhi : [];
      if(this.botMessages.length === 0)
        this.botMessages.push({ messageType: 'text', displayMsg: "WELCOME_TO_PARENT_SAKHI", type: 'received', time: new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' }), timeStamp: Date.now()})
    }
    this.content.scrollToBottom(300).then(() => {
      this.content.scrollToBottom(300)
    })
  }

  async handleMessage() {
    this.chat = { message: '', messageType: 'text', type: 'sent', displayMsg: "", time: new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' }), timeStamp: '', readMore: false, likeMsg: false, dislikeMsg: false}
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

  async makeBotAPICall(text: string, audio: string) {
    this.textMessage = "";
    this.disabled = true;
    // Api call and response from bot, replace laoding text
    let index = this.botMessages.length;
    await this.messageApi.getBotMessage(text, audio, this.config.type).then(result => {
    this.botMessages = JSON.parse(JSON.stringify(this.botMessages));
      this.botMessages.forEach(async (msg, i) => {
        if (result.responseCode === 200) {
          let data = result.body;
          if(i == index-1 && msg.type === 'received') {
            msg.time = new Date().toLocaleTimeString('en', {hour: '2-digit', minute:'2-digit'})
            msg.timeStamp = Date.now();
            if (data?.output) {
              this.disabled = false;
              msg.message = data.output?.text;
              if (data?.output?.text.length > 200 && (data?.output.text.length - 200 > 100)) {
                msg.displayMsg = data.output.text.substring(0, 200);
                msg.readMore = true;
              } else {
                msg.displayMsg = data.output?.text;
              }
              this.content.scrollToBottom(300).then(() => {
                this.content.scrollToBottom(300)
              })
              if (data?.output?.audio) {
                let duration = await this.fetchAudioDuration(data.output.audio);
                console.log("duration ", duration);
                let audioMsg = { message: '', messageType: '', displayMsg: "", audio: { file: '', duration: '', play: false }, type: 'received', time: new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' }), timeStamp: Date.now(), readMore: false, likeMsg: false, dislikeMsg: false }
                audioMsg.audio = { file: data.output?.audio, duration: duration, play: false }
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
          this.disabled = false;
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
    this.botMessages.forEach((audioMsg) => {
      if (audioMsg.audio?.play && msg.timeStamp !== audioMsg.timeStamp) {
        audioMsg.audio.play = false;
      }
    })
    if (msg.type === 'sent') {
      const audioFile = await Filesystem.readFile({
        path: audio.file,
        directory: Directory.Data
      });
      const base64Sound: any = audioFile.data;
      url = `data:audio/aac;base64,${base64Sound}`
      audio.play = !audio.play;
    } else if (msg.type === "received") {
      url = audio.file;
      audio.play = !audio.play;
    }
    this.audioRef.src = url;
    this.audioRef.load();
    this.audioRef.preload = "auto"
    this.audioRef.controls = true;
    this.audioRef.oncanplaythrough = () => { 
      if(!audio.play) {
        this.audioRef.pause();
      } else {
        this.audioRef.play();
      }
    };
    this.audioRef.ondurationchange = (ev: Event) => {
      console.log("ondurationchange ", ev);
    }
    this.audioRef.ontimeupdate = (ev: Event) => {
      this.audioRef.currentTime = (ev.target as any)?.currentTime
    }
    this.audioRef.onended = () => {audio.play = false; this.audioRef.pause();}
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
          if(this.audioRef) {
            if(msg.audio) {
              msg.audio.play = false;
            }
            this.audioRef.pause();
          }
        }
      });
      console.log('result count ', result);
      this.botMessageEvent.emit({ audio: result.audio, text: result.text, duration: botDuration/1000 })
    } else {
      this.botMessageEvent.emit({ audio: 0, text: 0, duration: botDuration/1000 })
    }
    this.botMessages = [];
  }

  async cancelRecording() {
    console.log('cancel recording');
    await this.record.stopRecognition('audio').then(res => {
      console.log('res on recorded data ', res);
    });
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

  async onLongPressStart() {
    console.log('long press start');
    if(await (await VoiceRecorder.hasAudioRecordingPermission()).value) {
      this.record.startRecognition('');
    } else {
      await VoiceRecorder.requestAudioRecordingPermission();
    }
  }

  async onLongPressEnd() {
    console.log('long press end');
    await this.record.stopRecognition('audio').then(async result => {
      console.log('result on recorded data ', result);
      if(result.value && result.value.recordDataBase64) {
        this.chat = { message: '', messageType: '', displayMsg: "", audio: { file: '', duration: '', play: false }, type: 'sent', time: new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' }), timeStamp: '', readMore: false, likeMsg: false, dislikeMsg: false }
        const recordData = result.value.recordDataBase64;
        console.log('..................', result, this.durationDisplay);
        const fileName = new Date().getTime() + '.wav';
        await Filesystem.writeFile({
          path: fileName,
          directory: Directory.Data,
          data: recordData
        })
        this.ngZone.run(() => {
          this.chat.messageType = 'audio';
          this.chat.audio = { file: fileName, base64Data: recordData, duration: this.getTimeString(result.value.msDuration), play: false };
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
        this.makeBotAPICall('', recordData);
      }
    });
  }

  getTimeString(duration: any) {
    let minutes = Math.floor(duration / 1000 / 60);
    let seconds = Math.floor((duration / 1000) - (minutes * 60));
    return minutes.toString().padStart(2, '0') + ":" + seconds.toString().padStart(2, '0');
  }

  fetchAudioDuration(url: string): Promise<any> {
    const audioContext = new AudioContext(); 
    return fetch(url)
    .then(response => response.arrayBuffer())
    .then(buffer => audioContext.decodeAudioData(buffer)) 
    .then(audioBuffer => { 
      const duration = audioBuffer.duration; 
      console.log(`The audio file duration is ${duration} seconds`); 
      let minute = (Math.floor(duration/ 60)).toString().padStart(2, '0');
      let seconds = Math.floor(duration % 60).toString().padStart(2, '0');
      return minute + ':' + seconds;
    }).catch (e => {
      return '';
    }); 
  }

  msgLiked(msg: BotMessage, type: string) {
    this.botMessages.forEach(bot => {
      if(msg.timeStamp == bot.timeStamp) {
        if(type == 'like') {
          bot.likeMsg = true;
          bot.dislikeMsg = false;
          this.telemetryGeneratorService.generateInteractTelemetry('TOUCH', 'message-liked', 'bot', 'bot');
        } else {
          msg.dislikeMsg = true;
          msg.likeMsg = false;
          this.telemetryGeneratorService.generateInteractTelemetry('TOUCH', 'message-disliked', 'bot', 'bot');
        }
      }
    })
  }
}
