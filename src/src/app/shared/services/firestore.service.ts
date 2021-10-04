import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

export interface Course {
    id: string;
    name: string;
    shortForm: string;
    desc: string;
    eligibility: string;
    duration: number;
    popular: string;
}

export interface Student {
    id: string;
    enrollmentNo: string;
    name: string;
    fatherName: string;
    dob: string;
    courseName: string;
    courseShortForm: string;
    sessionStart: string;
    sessionEnd: string;
    profilePic: string;
    profilePicSource: any;
}

@Injectable()
export class FirestoreService {
    constructor(private firestore: AngularFirestore) {}

    getCourses() {
        return this.firestore.collection('courses').snapshotChanges();
    }

    getStudents() {
        return this.firestore.collection('students').snapshotChanges();
    }

    getStudentbyId(id) {
        return this.firestore.doc('students/' + id).snapshotChanges();
    }

    addCourse(course: Course) {
        return this.firestore.collection('courses').add(course);
    }

    updateCourse(id: string, course: Course) {
        return this.firestore.doc('courses/' + id).update(course);
    }

    deleteCourse(id: string) {
        return this.firestore.doc('courses/' + id).delete();
    }

    // STUDENT

    addStudent(student: Student) {
        delete student.profilePicSource;
        return this.firestore.collection('students').add(student);
    }

    addResult( result: any) {
        const id = result.id;
        delete result.id;

        if(result.year == "1") {
            return this.firestore.doc('students/' + id).set({ result1: result }, { merge: true });
        } else {
            return this.firestore.doc('students/' + id).set({ result2: result }, { merge: true });
        }
    }
}