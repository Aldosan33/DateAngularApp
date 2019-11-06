import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { tokenGetter } from '../app.module';
import { BsDatepickerConfig } from 'ngx-bootstrap';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Output() cancelRegister = new EventEmitter();
  model: any = {};
  registerForm: FormGroup;
  dpConfig: Partial<BsDatepickerConfig>;

  constructor(private authService: AuthService, private alertifyService: AlertifyService,
              private fb: FormBuilder) { }

  ngOnInit() {
    this.dpConfig = {
      containerClass: 'theme-red'
    };
    this.createRegisterForm();
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password').value === g.get('confirmPassword').value ? null : {'mismatch': true};
  }

  createRegisterForm() {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      gender: ['male'],
      knownAs: ['', Validators.required],
      dateOfBirth: [null, Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
      confirmPassword: ['', Validators.required],
    }, {validator: this.passwordMatchValidator});
  }

  register() {
    // this.authService.register(this.model).subscribe(() => {
    //   this.alertifyService.success('registration successful');
    // }, error => {
    //   this.alertifyService.error(error);
    // });
  }

  cancel() {
    this.cancelRegister.emit(false);
  }
}
