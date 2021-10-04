import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FirebaseAuthService } from 'src/app/shared/services/firebase-auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  private admin = {
    email: "admin@svppi.org",
    password: ""
  }
  submitError: string;
  authRedirectResult: Subscription;

  constructor(
    public router: Router,
    private ngZone: NgZone,
    private authService: FirebaseAuthService
  ) { 
    // Get firebase authentication redirect result invoken when using signInWithRedirect()
    // signInWithRedirect() is only used when client is in web but not desktop
    this.authRedirectResult = this.authService.getRedirectResult()
      .subscribe(result => {
        if (result.user) {
          this.redirectLoggedUserToProfilePage();
        } else if (result.error) {
          this.submitError = result.error;
        }
      });
  }

  signInWithEmail() {
    if(this.admin.password) {
    console.log(this.admin.password);
    this.authService.signInWithEmail(this.admin.email, this.admin.password)
      .then(user => {
        // navigate to user profile
        this.redirectLoggedUserToProfilePage();
      })
      .catch(error => {
        this.submitError = error.message;
      });
    } else {
      this.submitError = "Please enter password!";
    }  
  }

  // Once the auth provider finished the authentication flow, and the auth redirect completes,
  // redirect the user to the profile page
  redirectLoggedUserToProfilePage() {
    // As we are calling the Angular router navigation inside a subscribe method, the navigation will be triggered outside Angular zone.
    // That's why we need to wrap the router navigation call inside an ngZone wrapper
    this.ngZone.run(() => {
      this.router.navigate(['admin/dashboard']);
    });
  }

  onKeyupEvent(event: any): void {
    this.admin.password = event.target.value;
  }

}
