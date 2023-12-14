import { ElementRef, Injectable, OnInit, ViewChild } from '@angular/core';
import { GestureController } from '@ionic/angular';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { RecordingData, VoiceRecorder } from 'capacitor-voice-recorder';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

@Injectable({
  providedIn: 'root'
})
export class RecordingService implements OnInit {
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
        this.startRecognition()
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

  async stopRecognition(type: string) {
    if(!this.recording) {return;}
    VoiceRecorder.stopRecording().then(async (result: RecordingData) => {
      this.recording = false;
      if(result.value && result.value.recordDataBase64) {
        const recordData = result.value.recordDataBase64;
        console.log('..................', recordData);
        if (type == "base64") {
          const fileName = new Date().getTime() + '.txt';
          await Filesystem.writeFile({
            path: fileName,
            directory: Directory.Data,
            data: recordData
          })
        } else  {
          const fileName = new Date().getTime() + '.wav';
          await Filesystem.writeFile({
            path: fileName,
            directory: Directory.Data,
            data: recordData
          })
        }

      }
    })
  }
}
