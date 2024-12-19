import {afterNextRender, Component, DestroyRef, inject, Signal, viewChild} from '@angular/core';
import {FormGroup, FormsModule, NgForm} from "@angular/forms";
import {debounceTime} from "rxjs";

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  imports: [
    FormsModule
  ]
})
export class LoginComponent {

  private form: Signal<NgForm>= viewChild.required<NgForm>('loginForm');
  private destroyRef = inject(DestroyRef)

  constructor() {

    const savedLoginForm = window.localStorage.getItem('loginForm');
    if(savedLoginForm) {
      const loadedLoginForm = JSON.parse(savedLoginForm);
      const savedEmail: string = loadedLoginForm.email;
      // this is to update the entire form
      // this.form().setValue({email: savedEmail,
      // password: ''});

      // this is update only a specific value in the form
      setTimeout(() => {
        // we are doing this within the timeout method to give one millisecond
        // for angular to fully initialize the form controls
        // without this timeout, it will result in error since
        // the controls are not initialized
        this.form().controls['email'].setValue(savedEmail);
      }, 1)
    }

    const subscription = afterNextRender(()=>{
      this.form().valueChanges?.pipe(debounceTime(500)).subscribe({
        next: afterNextRender => {
          console.log(afterNextRender.email);
          window.localStorage.setItem('saved-login-form',
            JSON.stringify({email: afterNextRender.email}));
        }

      });
      this.destroyRef.onDestroy(() => subscription?.destroy());
    });
  }

  onLogin(loginForm: NgForm): void {
    if(!loginForm.valid){
      return;
    }
    console.log(loginForm);
    console.log(loginForm.value.email);
    const enteredEmail = loginForm.form.value.email;
    const enteredPassword = loginForm.form.value.password;

    console.log(enteredEmail);
    console.log(enteredPassword);

    loginForm.reset();
  }
}
