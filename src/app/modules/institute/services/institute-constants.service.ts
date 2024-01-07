import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InstituteConstantsService {

  constructor() { }

  PHONE = {
    // pattern: /^([0|\+[0-9]{1,5})?([6-9][0-9]{9})$/,
    pattern: /^[6-9]\d{9}$/,
    length: 10,
    otpLength: 6
  }

  EMAIL_REGEXP = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  packageAssessmentQuestionCheckApiUrl = `${environment.BASE_URL}/api/institute_package_assessment_test_self_questionwise_check`;
  packageAssessmentTestSelfApiUrl = `${environment.BASE_URL}/api/institute_package_assessment_test_self`;
  packageAssessmentTestSelfQuesApiUrl = `${environment.BASE_URL}/api/institute_package_assessment_test_self_questionwise`;
  packageAssessmentStudentReportApiUrl = `${environment.BASE_URL}/api/institute_package_assessment_test_student_report`;
  packageMockTestSelfQuesApiUrl = `${environment.BASE_URL}/api/institute_package_mock_test_self`;
  
  
  // need to remove these api method
  studentsListApiUrl = `${environment.BASE_URL}/api/institute_studentlist`;
  createStudentApiUrl = `${environment.BASE_URL}/api/institute_createstudent`;
  uploadStudentApiUrl = `${environment.BASE_URL}/api/institute_uploadstudent`;
  updateBulkStudentPackageApiUrl = `${environment.BASE_URL}/api/institute_updatestudentspackagecsv`;
  addStandardApiUrl = `${environment.BASE_URL}/api/institute_standard`;
  addSubjectApiUrl = `${environment.BASE_URL}/api/institute_create_subject`;


  // new api
  listSubjectsApiUrl = `${environment.BASE_URL}/api/institute_list_subjects/`;
  createSubjectApiUrl = `${environment.BASE_URL}/api/institute_create_subject/`;
  subjectApiUrl = `${environment.BASE_URL}/api/institute_subject/`;
  listStandardsApiUrl = `${environment.BASE_URL}/api/institute_list_standards/`;
  createStandardApiUrl = `${environment.BASE_URL}/api/institute_create_standard/`;
  standardsApiUrl = `${environment.BASE_URL}/api/institute_standard/`;
  listSubstdsApiUrl = `${environment.BASE_URL}/api/institute_list_substds/`;
  createSubstdsApiUrl = `${environment.BASE_URL}/api/institute_create_substds/`;
  substdApiUrl = `${environment.BASE_URL}/api/institute_substd/`;
  listChaptersApiUrl = `${environment.BASE_URL}/api/institute_list_chapters/`;
  createChapterApiUrl = `${environment.BASE_URL}/api/institute_create_chapter/`;
  chapterApiUrl = `${environment.BASE_URL}/api/institute_chapter/`;
  listTopicsApiUrl = `${environment.BASE_URL}/api/institute_list_topics/`;
  createTopicApiUrl = `${environment.BASE_URL}/api/institute_create_topic/`;
  topicApiUrl = `${environment.BASE_URL}/api/institute_topic/`;
  listQuestionsApiUrl = `${environment.BASE_URL}/api/institute_list_questions/`;
  createQuestionApiUrl = `${environment.BASE_URL}/api/institute_create_question/`;
  institute_questionApiUrl = `${environment.BASE_URL}/api/institute_question/`;
  bulkUploadQuestionsApiUrl = `${environment.BASE_URL}/api/institute_bulk_upload_questions/`;
  createstudentApiUrl = `${environment.BASE_URL}/api/institute_createstudent/`;
  uploadstudentApiUrl = `${environment.BASE_URL}/api/institute_uploadstudent/`;
  getupdatestudentpackageApiUrl = `${environment.BASE_URL}/api/institute_getupdatestudentpackage/`;
  StudentlistApiUrl = `${environment.BASE_URL}/api/institute_studentlist/`;
}
