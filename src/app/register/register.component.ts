import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  token: null;

  constructor(private formBuilder: FormBuilder, private httpClient: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.token = null;
    this.registerForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit() {
    this.httpClient.post('https://tt.augmentedciso.com/register', this.registerForm.value).subscribe((resp) => {
      this.token = resp['token']
      this.registerForm.reset()
      this.router.navigate(['game'], {
        queryParams: {
          "token": this.token
        }
      });
    })
  }

}
