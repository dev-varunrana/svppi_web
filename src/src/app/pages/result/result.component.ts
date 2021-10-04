import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { FirestoreService } from 'src/app/shared/services/firestore.service';
import { ToastService } from 'src/app/shared/services/toast.service';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent {

  searchResultForm = new FormGroup({
    enrollmentNo: new FormControl('', [Validators.required]),
    dob: new FormControl('', [Validators.required]),
  })

  constructor(
    private router: Router,
    private toastService: ToastService,
    private firestore: FirestoreService,
  ) { }

  searchResult() {
    if(this.searchResultForm.valid) {
      const enrollmentNo = this.searchResultForm.get('enrollmentNo').value;
      const dob = this.searchResultForm.get('dob').value;

      this.firestore.getStudents().pipe(
        map((actions) => {
          return actions.map((a) => {
            const data = a.payload.doc.data() as any;
            data.id = a.payload.doc.id;
            return data;
          })
        })
      ).subscribe((students) => {
        const student = students.find((student) => (student.enrollmentNo == enrollmentNo && student.dob == dob));
        if(student && student.result2) {
          this.router.navigate(['student-details', student.id]);
        } else {
          alert("Result is not present yet!!!");
        }
      })

    } else {
      console.log("Invalid Form! Please fill all the required fields.");
      this.showDanger("Invalid Form! Please fill all the required fields.");
    }
  }

  showSuccess(msg) {
    this.toastService.show(msg, { classname: 'bg-success text-light', delay: 4000 });
  }

  showDanger(msg) {
    this.toastService.show(msg, { classname: 'bg-danger text-light', delay: 4000 });
  }

}
