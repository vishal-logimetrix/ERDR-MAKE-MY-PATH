import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InstituteConstantsService } from '../../../services/institute-constants.service';
import { InstituteService } from '../../../services/institute.service';

@Component({
  selector: 'app-create-student',
  templateUrl: './create-student.component.html',
  styleUrls: ['./create-student.component.scss']
})
export class CreateStudentComponent implements OnInit {
  stu_package=[{"number":"V","package":"Word Meaning"},
  {"number":"VI","package":"English"},
  {"number":"IX","package":"Word "},
  {"number":"V","package":"Word Meaning"},
  {"number":"VI","package":"English"},
  {"number":"IX","package":"Word "},
  {"number":"V","package":"Word Meaning"},
  {"number":"VI","package":"English"},
  {"number":"IX","package":"Word "},
  {"number":"V","package":"Word Meaning"},
  {"number":"VI","package":"English"},
  {"number":"IX","package":"Word "}]  
  constructor(
    private fb: FormBuilder,
    private consts: InstituteConstantsService,
    private instituteService: InstituteService
  ) { }

  createStudentForm: FormGroup;
  successMsg;
  errors;

  submitForm() {
    this.successMsg = null;
    this.errors = null;
    const username = this.createStudentForm.value.username;
    const email = this.createStudentForm.value.email;
    const phonenumber = this.createStudentForm.value.phonenumber;
    const password = this.createStudentForm.value.password;
    const confirmPassword = this.createStudentForm.value.confirmPassword;
    if (password != confirmPassword) {
      this.errors = "Password and Confirm Password do not match";
      return;
    }

    const formData = {
      email: email,
      username: username,
      phonenumber: phonenumber,
      password: password
    }

    console.log("formData ", formData);
    this.instituteService.createStudent(formData).subscribe(
      data => {
        console.log("student created successfully ", data);
        this.successMsg = "student created successfully";
      },
      error => {
        console.log("error ", error);
        this.errors = error['error'];
      }
    )

  }

  studentForm() {
    this.createStudentForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(2), Validators.pattern("^[a-zA-Z\-\']+")]],
      email: ['', [Validators.required, Validators.pattern(this.consts.EMAIL_REGEXP)]],
      password: ['', [Validators.required, Validators.minLength(4)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(4)]],
      phonenumber: ['', [Validators.required, Validators.pattern(this.consts.PHONE.pattern)]],
    });
  }

  ngOnInit(): void {
    this.studentForm();
  }

}
