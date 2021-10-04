import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { finalize, map } from 'rxjs/operators';

import { FormGroup, FormControl, Validators } from '@angular/forms'
import { NgbNavConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { FirebaseAuthService } from 'src/app/shared/services/firebase-auth.service';
import { Course, FirestoreService, Student } from 'src/app/shared/services/firestore.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { TableService } from 'src/app/shared/services/table.service';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  private basePath: string = '/student-profile-pic';
  closeResult: string;
  showSpinner: boolean = false;

  rawCourses: Course[] = [];
  courses: Course[] = [];
  courseSearchInput: string;
  noCourseData: Boolean;

  rawStudents: any[] = [];
  students: any[] = [];
  studentSearchInput: string;

  searchToSelectCourses: Course[];

  editableCourse = {
    id: "",
    name: "",
    shortForm: "",
    desc: "",
    eligibility: "",
    duration: "",
    popular: false,
  };

  courseForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    shortForm: new FormControl('', [Validators.required]),
    desc: new FormControl('', [Validators.required]),
    eligibility: new FormControl('', [Validators.required]),
    duration: new FormControl('', [Validators.required]),
    popular: new FormControl('', [Validators.required])
  });

  addStudentForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    fatherName: new FormControl('', [Validators.required]),
    dob: new FormControl('', [Validators.required]),
    courseName: new FormControl('', [Validators.required]),
    courseShortForm: new FormControl('', [Validators.required]),
    enrollmentNo: new FormControl('', [Validators.required]),
    profilePic: new FormControl('', [Validators.required]),
    profilePicSource: new FormControl('', [Validators.required]),
    sessionStart: new FormControl('', [Validators.required]),
    sessionEnd: new FormControl('', [Validators.required]),
  })

  addResultForm = new FormGroup({
    id: new FormControl('', [Validators.required]),
    year: new FormControl('', [Validators.required]),
    certificateNo: new FormControl('', [Validators.required]),
    rollNo: new FormControl('', [Validators.required]),
    totalMarks: new FormControl('', [Validators.required]),
    obtainedMarks: new FormControl('', [Validators.required]),
    percentage: new FormControl('', [Validators.required]),
  })

  editCourseForm = new FormGroup({
    id: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required]),
    shortForm: new FormControl('', [Validators.required]),
    desc: new FormControl('', [Validators.required]),
    eligibility: new FormControl('', [Validators.required]),
    duration: new FormControl('', [Validators.required]),
    popular: new FormControl('', [Validators.required])
  })

  constructor(
    private router: Router,
    private config: NgbNavConfig,
    private modalService: NgbModal,
    private tableService: TableService,
    private toastService: ToastService,
    private storage: AngularFireStorage,
    private authService: FirebaseAuthService,
    private firestoreService: FirestoreService,
  ) {

    // customize default values of navs used by this component tree
    config.destroyOnHide = false;
    config.roles = false;

    this.firestoreService.getCourses().pipe(
      map((actions) => {
        return actions.map((a) => {
          const data = a.payload.doc.data() as Course;
          data.id = a.payload.doc.id;
          return data;
        })
      })
    ).subscribe(
      (courses) => {
        this.rawCourses = this.courses = courses;
      },
      (error) => {
        console.log(error.message);
        this.showDanger(`Error: ${error.message}`);
      }
    );

    this.firestoreService.getStudents().pipe(
      map((actions) => {
        return actions.map((a) => {
          const data = a.payload.doc.data() as Student;
          data.id = a.payload.doc.id;
          return data;
        })
      })
    ).subscribe(
      (students) => {
      this.rawStudents = this.students = students;
      console.log(students);

      },
      (error) => {
        console.log(error.message);
        this.showDanger(`Error: ${error.message}`);
      }
    );

  }

  searchCourse(event) {
    this.courseSearchInput = event.target.value;
    const data = this.rawCourses;
    if (this.tableService.search(this.courseSearchInput, data).length > 0) {
      this.noCourseData = false;
      this.courses = this.tableService.search(this.courseSearchInput, data);
    } else {
      this.noCourseData = true;
      this.courses = this.tableService.search(this.courseSearchInput, data);
    }
  }

  addCourse() {
    if (this.courseForm.valid) {
      this.firestoreService.addCourse(this.courseForm.value).then(() => {
        this.modalService.dismissAll();
        this.showSuccess("Course added Successfully!");
        this.courseForm.reset();
      })
        .catch((error) => {
          console.log(error.message);
          this.showDanger(`Error: ${error.message}`);
        });
    } else {
      console.log("Invalid Form! Please fill all the required fields.");
      this.showDanger("Invalid Form! Please fill all the required fields.");
    }

  }

  deleteCourse(id) {
    this.firestoreService.deleteCourse(id)
      .then(() => this.showSuccess("This course is successfully deleted!"))
      .catch((error: any) => this.showDanger(`Error: ${error.message}`));
  }

  updateCourse() {
    if (this.editCourseForm.valid) {
      this.firestoreService.updateCourse(this.editCourseForm.value.id, this.editCourseForm.value)
        .then(() => {
          this.modalService.dismissAll();
          this.showSuccess("Course is successfully updated!");
          this.editCourseForm.reset();
        })
        .catch((error) => {
          this.modalService.dismissAll();
          this.showDanger(`Error: ${error.message}`);
        });
    } else {
      this.showDanger("Invalid Form! Please fill all the required fields.");
    }
  }

  searchStudent(event) {
    this.studentSearchInput = event.target.value;
    const data = this.rawStudents;
    if (this.tableService.search(this.studentSearchInput, data).length > 0) {
      this.noCourseData = false;
      this.students = this.tableService.search(this.studentSearchInput, data);
    } else {
      this.noCourseData = true;
      this.students = this.tableService.search(this.studentSearchInput, data);
    }
  }

  addStudent() {
    console.log(this.addStudentForm.value);
    if (this.addStudentForm.valid) {
      this.showSpinner = true;
      const file = this.addStudentForm.get("profilePicSource").value;
      const filePath = `${this.basePath}/${new Date().valueOf()}`;
      const storageRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, file);

      task.snapshotChanges().pipe(
        finalize(() => {
          storageRef.getDownloadURL().subscribe(downloadURL => {
            const data = this.addStudentForm.value;
            data.profilePic = downloadURL;
            const studentDetails = this.addStudentForm.value;
            this.firestoreService.addStudent(studentDetails).then(() => {
              this.showSpinner = false;
              this.modalService.dismissAll();
              this.showSuccess("Result added Successfully!");
              this.addStudentForm.reset();
            }).catch((error) => {
              this.showSpinner = false;
              console.log(error.message);
              this.showDanger(`Error: ${error.message}`);
            })
          })
        })
      ).subscribe();

    } else {
      console.log("Invalid Form! Please fill all the required fields.");
      this.showDanger("Invalid Form! Please fill all the required fields.");
    }
  }

  addResult() {
    if (this.addResultForm.valid) {
      this.showSpinner = true;
      const resultDetails = this.addResultForm.value;
      this.firestoreService.addResult(resultDetails).then(() => {
        this.showSpinner = false;
        this.modalService.dismissAll();
        this.showSuccess("Result added Successfully!");
        this.addResultForm.reset();
      }).catch((error) => {
        this.showSpinner = false;
        console.log(error.message);
        this.showDanger(`Error: ${error.message}`);
      })
    } else {
      console.log("Invalid Form! Please fill all the required fields.");
      this.showDanger("Invalid Form! Please fill all the required fields.");
    }
  }

  onFileSelected(event) {
    if(event.target.files.length > 0) {
      const file = event.target.files[0];
      this.addStudentForm.patchValue({
        profilePicSource: file
      });
    }
  }

  selectCourse(event) {
    this.courseSearchInput = event.target.value;
    const data = this.rawCourses;
    if (this.tableService.search(this.courseSearchInput, data).length > 0) {
      this.noCourseData = false;
      this.searchToSelectCourses = this.tableService.search(this.courseSearchInput, data);
    } else {
      this.noCourseData = true;
      this.searchToSelectCourses = this.tableService.search(this.courseSearchInput, data);
    }
  }

  selectedCourse(name, shortForm) {
    this.addStudentForm.patchValue({
      courseName: name,
      courseShortForm: shortForm,
    });
    this.searchToSelectCourses = [];
  }

  generateEnrollmentNo(event) {
    const value = event.target.value;
    this.addStudentForm.patchValue({
      enrollmentNo: `M${value.slice(-2)}0${this.getUniqueId(2)}${this.getUniqueId(5)}`,
    });
  }

  calculatePercentage(event) {
    if(this.addResultForm.get('totalMarks').value) {
      let percentage = (this.addResultForm.get('obtainedMarks').value/this.addResultForm.get('totalMarks').value) * 100;
      this.addResultForm.patchValue({ percentage: percentage.toFixed(1)});
    } else {
      alert("Please fill Total Marks First!!");
    }
  }


  showModal(content, id= "") {
    if(id) { 
      this.addResultForm.patchValue({
        id: id,
        certificateNo: `${this.getUniqueId(4)}${this.getUniqueId(6)}`,
        rollNo: `R${this.getUniqueId(3)}${this.getUniqueId(4)}`,
      });
    }
    this.modalService.open(content, { size: 'lg', centered: true, scrollable: true });
  }

  editCourseModal(content, data) {
    this.editCourseForm.setValue(data);
    this.modalService.open(content, { size: 'lg', centered: true, scrollable: true });
  }

  logout() {
    this.authService.signOut().subscribe(() => {
      this.router.navigate(['admin/login']);
    })
  }

  showSuccess(msg) {
    this.toastService.show(msg, { classname: 'bg-success text-light', delay: 4000 });
  }

  showDanger(msg) {
    this.toastService.show(msg, { classname: 'bg-danger text-light', delay: 4000 });
  }

  getUniqueId(length) {
    return Math.floor(Math.pow(10, length - 1) + Math.random() * 9 * Math.pow(10, length - 1));
  }

  getResultData() {
    return {
      name: this.addResultForm.get('name').value,
      fatherName: this.addResultForm.get('fatherName').value,
      dob: this.addResultForm.get('dob').value,
      courseName: this.addResultForm.get('courseName').value,
      courseShortForm: this.addResultForm.get('courseShortForm').value,
      enrollmentNo: this.addResultForm.get('enrollmentNo').value,
      profilePic: this.addResultForm.get('profilePic').value,
      sessionStart: this.addResultForm.get('sessionStart').value,
      sessionEnd: this.addResultForm.get('sessionEnd').value,
    }
  }

}
