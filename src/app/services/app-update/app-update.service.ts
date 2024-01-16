import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AppUpdate, AppUpdateAvailability } from '@capawesome/capacitor-app-update';
import { AlertController, Platform } from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class AppUpdateService {
    forDeepLink: boolean = false;
    showListPage: boolean = false;

    constructor(
        public router: Router,
        public platform: Platform,
        private alertController: AlertController
    ) { }

    async checkForUpdate() {
        const result = await AppUpdate.getAppUpdateInfo();
        // const result = await this.simulateCheckForUpdate(); // for testing
        console.log('Update available:', result.updateAvailability === AppUpdateAvailability.UPDATE_AVAILABLE);

        if (result.updateAvailability === AppUpdateAvailability.UPDATE_AVAILABLE) {
            if (this.platform.is('android')) {
                if (result.immediateUpdateAllowed) {
                    await AppUpdate.performImmediateUpdate();
                } else if (result.flexibleUpdateAllowed) {
                    await AppUpdate.startFlexibleUpdate();
                    AppUpdate.addListener('onFlexibleUpdateStateChange', async () => {
                        const alert = await this.alertController.create({
                            header: 'Update Downloaded',
                            message: 'The update has been downloaded. Would you like to restart the app to complete the update now?',
                            buttons: [
                                {
                                    text: 'Later',
                                    role: 'cancel',
                                },
                                {
                                    text: 'Restart Now',
                                    handler: () => {
                                        AppUpdate.completeFlexibleUpdate();
                                    }
                                }
                            ]
                        });

                        await alert.present();
                    });
                } else {
                    // Handle the case where an update is not allowed
                }
            }
        }
    }
    // async simulateCheckForUpdate() {
    //     return {
    //         updateAvailability: AppUpdateAvailability.UPDATE_AVAILABLE,
    //         immediateUpdateAllowed: true,
    //         flexibleUpdateAllowed: true,
    //         currentVersion: '1.0.0',
    //         availableVersion: '2.0.0'
    //     };
    // }
}