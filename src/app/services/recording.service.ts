import { Injectable, OnInit } from '@angular/core';
import { GestureController } from '@ionic/angular';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { RecordingData, VoiceRecorder } from 'capacitor-voice-recorder';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Subject } from 'rxjs/internal/Subject';

@Injectable({
  providedIn: 'root'
})
export class RecordingService implements OnInit {
  private searchEvent = new Subject<any>();
  searchEventRecorded$ = this.searchEvent.asObservable();

  private botEvent = new Subject<any>();
  botEventRecorded$ = this.botEvent.asObservable();

  private recordEvent = new Subject<any>();
  startEndEvent$ = this.recordEvent.asObservable();
  
  recording = false;
  cancelRecording = false;
  constructor(private gestureCtrl: GestureController) {}

  ngOnInit() {}

  gestureControl(ele: any) {
    const swipeLeft = this.gestureCtrl.create({
      el: ele.nativeElement,
      threshold: 0,
      gestureName: 'swipe-left',
      direction: 'x',
      onStart: (ev) => { 
        console.log('swipe left start ', ev); 
        Haptics.impact({style: ImpactStyle.Light});
      },
      onMove: (detail) => { 
        console.log('swipe left ', detail);
        Haptics.impact({style: ImpactStyle.Light});
        this.recordEvent.next(false);
        this.cancelRecording = true;
      },
      onEnd: ev => {
        console.log('swipe left end ', ev);
        Haptics.impact({style: ImpactStyle.Light});
        this.recordEvent.next(false);
      }
    }, true);
    swipeLeft.enable();
  }

  async startRecognition() {
    await VoiceRecorder.requestAudioRecordingPermission();
    Haptics.impact({style: ImpactStyle.Light});
    this.recordEvent.next(true);
    if(this.recording) {
      return
    }
    this.recording = true;
    if(await (await VoiceRecorder.hasAudioRecordingPermission()).value) {
      VoiceRecorder.startRecording()
    } else {
      await VoiceRecorder.requestAudioRecordingPermission();
      VoiceRecorder.startRecording();
    }
  }

  async stopRecognition(type: string) {
    Haptics.impact({style: ImpactStyle.Light});
    this.recordEvent.next(false);
    if(!this.recording) {return;}
    VoiceRecorder.stopRecording().then(async (result: RecordingData) => {
      this.recording = false;
      if(result.value && result.value.recordDataBase64) {
        const recordData = result.value.recordDataBase64;
        console.log('..................', result);
        if (type == "search") {
          this.searchEvent.next(recordData);
        } else if (type == "audio"){
          const fileName = new Date().getTime() + '.wav';
          await Filesystem.writeFile({
            path: fileName,
            directory: Directory.Data,
            data: recordData
          })
          if(this.cancelRecording) {
            this.botEvent.next({file: ''})
          } else {
            this.botEvent.next({file: fileName})
          }
        }
      }
    })
  }
}
