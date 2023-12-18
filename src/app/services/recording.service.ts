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
  
  recording = false;
  storedFileNames:Array<any> = [];
  durationDisplay = '';
  duration = 0;
  constructor(private gestureCtrl: GestureController) {
    VoiceRecorder.requestAudioRecordingPermission();
  }

  ngOnInit() {
    VoiceRecorder.requestAudioRecordingPermission()
  }

  gestureControl(ele: any, type: string) {
    const longpress = this.gestureCtrl.create({
      el: ele.nativeElement,
      threshold: 0,
      gestureName: 'long-press',
      onStart: ev => {
        Haptics.impact({style: ImpactStyle.Light});
        console.log("start record ");
        this.startRecognition();
        if(type == 'audio') {
          this.calculation();
        }
      },
      onEnd: ev => {
        Haptics.impact({style: ImpactStyle.Light});
        console.log("end record ");
        this.stopRecognition(type);
      }
    }, true);

    longpress.enable();
  }

  async startRecognition() {
    if(this.recording) {
      return
    }
    this.recording = true;
    VoiceRecorder.startRecording()
  }

  calculation() {
    if(!this.recording) {
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

  async stopRecognition(type: string) {
    if(!this.recording) {return;}
    VoiceRecorder.stopRecording().then(async (result: RecordingData) => {
      this.recording = false;
      if(result.value && result.value.recordDataBase64) {
        const recordData = result.value.recordDataBase64;
        console.log('..................', recordData);
        if (type == "search") {
          this.searchEvent.next(recordData);
        } else if (type == "audio"){
          const fileName = new Date().getTime() + '.wav';
          await Filesystem.writeFile({
            path: fileName,
            directory: Directory.Data,
            data: recordData
          })
          this.botEvent.next({file: fileName, duration: this.durationDisplay})
        }

      }
    })
  }
}
