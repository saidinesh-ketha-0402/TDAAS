import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { jwtDecode } from "jwt-decode";
import { getItemFromLocalStorage } from '../../utils/localstorage-utils';


@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css']
})
export class MainMenuComponent {
  public userDisplayPicturePath: string = 'data:image/svg+xml,<svg width="32" height="32" viewBox="0 0 32 32" fill="f1f1f6" xmlns="http://www.w3.org/2000/svg"><path d="M18.15 15.3C17.25 15.9 16.85 16 16.15 16H15.85C15.15 16 14.75 15.95 13.85 15.3C12.9 14.55 12.1 13.85 11.45 12.8C10.7 11.75 10.4 10.8 10.4 9.6V5.6C10.4 2.5 12.9 0 16 0C19.1 0 21.6 2.5 21.6 5.6V9.6C21.6 10.8 21.25 11.75 20.55 12.8C19.9 13.85 19.1 14.6 18.15 15.3Z" fill="0e416c"/><path d="M20 16.7C22.95 17.45 26.15 18.4 26.15 18.4C29.6 19.35 32 22.5 32 26.1V30.4C32 31.3 31.3 32 30.4 32H1.6C0.7 32 0 31.3 0 30.4V26.1C0 22.5 2.4 19.35 5.85 18.4C5.85 18.4 9.05 17.4 12 16.7C12.55 18.25 14.3 19.2 16 19.2C17.7 19.2 19.45 18.2 20 16.7Z" fill="0e416c"/></svg>'
  public userEmailID: string = "modus_user@trimble.com"
  public userInitials: string = "MU"
  public userName: string = "Modus User"

  public visibleComponent: string = "prompt2code";
  public prompt2CodeId = "prompt2code"
  public code2CodeId = "code2code"
  public image2CodeId = "image2code"

  constructor(private router: Router, private authService: AuthenticationService) {

  }

  ngOnInit() {
    let tidIdToken = getItemFromLocalStorage("idToken")
    if (tidIdToken) {
      let tidIdTokenDecoded: any = jwtDecode(tidIdToken)
      console.log(tidIdTokenDecoded);
      this.userEmailID = tidIdTokenDecoded.email;
      this.userName = tidIdTokenDecoded.given_name + " " + tidIdTokenDecoded.family_name;
      this.userDisplayPicturePath = tidIdTokenDecoded.picture;
    }
    this.initNavBar();
    this.initTabs();
  }

  initNavBar() {
    const element: any = document.querySelector('modus-navbar');
    element.logoOptions = {
      primary: {
        url: './assets/Images/Logo.png',
        height: 24,
      },
      secondary: { url: 'https://modus.trimble.com/favicon.svg', height: 24 },
    };
    element.profileMenuOptions = {
      avatarUrl: this.userDisplayPicturePath,
      email: this.userEmailID,
      initials: this.userInitials,
      username: this.userName,
    };
  }

  initTabs() {
    const modusTabs: any = document.querySelector('modus-tabs');
    modusTabs.tabs = [
      {
        active: true,
        id: this.prompt2CodeId,
        label: 'Prompt 2 Code',
      },
      {
        id: this.image2CodeId,
        label: 'Image 2 Code',
      },
      {
        id: this.code2CodeId,
        label: 'Code 2 Code',
      },
    ];
  }

  OnTabChange(eventParams: any) {
    this.visibleComponent = eventParams.detail;
    console.log('Selected Tab:', eventParams.detail);
  }

  OnSignoutClick(eventParams: any) {
    this.router.navigate(['/logout']);
  }
}
