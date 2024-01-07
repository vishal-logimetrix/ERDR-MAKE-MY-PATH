import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InstituteComponent } from './institute.component';
import { InstituteHomeComponent } from './components/institute-home/institute-home.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppBootStrapModule } from 'src/app/bootstrap-module';
import { PipeListModule } from 'src/app/shared/modules/pipe-list.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SearchPipe } from './components/get-create-upload-students/students-list/search.pipe';
import { CKEditorModule } from 'ng2-ckeditor';
import { EditQuestionComponent } from './components/institute-question/edit-question/edit-question.component';
import { EditTopicTopicComponent } from './components/institute-topic/edit-topic-topic/edit-topic-topic.component';
import { CreateStudentComponent } from './components/get-create-upload-students/create-student/create-student.component';
import { AddStudentsComponent } from './components/get-create-upload-students/add-students/add-students.component';
import { AddQuestionComponent } from './components/institute-question/add-question/add-question.component';
import { UploadQuestionComponent } from './components/institute-question/upload-question/upload-question.component';
import { ViewQuestionComponent } from './components/institute-question/view-question/view-question.component';
import { StudentsListComponent } from './components/get-create-upload-students/students-list/students-list.component';
import { GetCreateUploadStudentsComponent } from './components/get-create-upload-students/get-create-upload-students.component';
import { AddEditCoursesComponent } from './components/add-edit-courses/add-edit-courses.component';
import { InstituteTopicComponent } from './components/institute-topic/institute-topic.component';
import { InstituteQuestionComponent } from './components/institute-question/institute-question.component';
import { EditStudentsListComponent } from './components/get-create-upload-students/edit-students-list/edit-students-list.component';
import { DesignCourseComponent } from './components/add-edit-courses/design-course/design-course.component';
import { CreateCourseComponent } from './components/add-edit-courses/create-course/create-course.component';
import { CreatePackageComponent } from './components/add-edit-courses/create-package/create-package.component';
import { UploadStudentsComponent } from './components/get-create-upload-students/upload-students/upload-students.component';
import { EditCourseComponent } from './components/add-edit-courses/edit-course/edit-course.component';
import { AddEditDomainsComponent } from './components/add-edit-domains/add-edit-domains.component';
import { CreateDomainComponent } from './components/add-edit-domains/create-domain/create-domain.component';
import { EditDomainComponent } from './components/add-edit-domains/edit-domain/edit-domain.component';
import { DesignDomainComponent } from './components/add-edit-domains/design-domain/design-domain.component';
import { DesignJourneyComponent } from './components/add-edit-domains/design-journey/design-journey.component';
import { CreatePathquestionsComponent } from './components/add-edit-domains/create-pathquestions/create-pathquestions.component';
import { ExamLevelComponent } from './components/add-edit-courses/exam-level/exam-level.component';
import { DomainCategoryComponent } from './components/add-edit-domains/domain-category/domain-category.component';
import { DesignMakepathQuestionsComponent } from './components/add-edit-courses/design-makepath-questions/design-makepath-questions.component';
import { EditMakepathQuestionComponent } from './components/add-edit-courses/edit-makepath-question/edit-makepath-question.component';
import { CreateChapterComponent } from './components/add-edit-courses/create-chapter/create-chapter.component';
import { QuestionTagsComponent } from './components/institute-question/question-tags/question-tags.component';
import { QuestionTypesComponent } from './components/add-edit-courses/question-types/question-types.component';
import { AverageTimeComponent } from './components/add-edit-courses/average-time/average-time.component';
import { AnnouncementsComponent } from './components/add-edit-domains/announcements/announcements.component';
import { ExamGradingComponent } from './components/add-edit-courses/exam-grading/exam-grading.component';
import { CreateSuggestedBooksComponent } from './components/add-edit-courses/create-suggested-books/create-suggested-books.component';
import { EditSuggestedBookComponent } from './components/add-edit-courses/edit-suggested-book/edit-suggested-book.component';
import { ExamBooksComponent } from './components/add-edit-courses/exam-books/exam-books.component';
import { PreviousPapersComponent } from './components/add-edit-courses/previous-papers/previous-papers.component';
import { CreatePreviousPaperComponent } from './components/add-edit-courses/create-previous-paper/create-previous-paper.component';
import { EditPreviousPaperComponent } from './components/add-edit-courses/edit-previous-paper/edit-previous-paper.component';
import { UserQueriesComponent } from './components/add-edit-courses/user-queries/user-queries.component';
import { ReportedQuestionsComponent } from './components/institute-question/reported-questions/reported-questions.component';
import { ContactUsComponent } from './components/add-edit-courses/contact-us/contact-us.component';
import { FaqComponent } from './components/institute-home/faq/faq.component';
import { CreateFaqComponent } from './components/institute-home/create-faq/create-faq.component';
import { CreateMockUpComponent } from './components/add-edit-courses/create-mock-up/create-mock-up.component';
import { ViewMockParametersComponent } from './components/add-edit-courses/view-mock-parameters/view-mock-parameters.component';
import { ManageStatesComponent } from './components/institute-home/manage-states/manage-states.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { ExamNotificationRequestComponent } from './components/add-edit-courses/exam-notification-request/exam-notification-request.component';
import { SearchQuestionComponent } from './components/institute-question/search-question/search-question.component';
import { CreateBannerComponent } from './components/institute-home/create-banner/create-banner.component';
import { BannersComponent } from './components/institute-home/banners/banners.component';
import { CreateSelfAssessQuesComponent } from './components/add-edit-courses/create-self-assess-ques/create-self-assess-ques.component';
import { ViewSelfAssessQuesComponent } from './components/add-edit-courses/view-self-assess-ques/view-self-assess-ques.component';
import { ChapterQuestionsComponent } from './components/add-edit-courses/chapter-questions/chapter-questions.component';
import { AddEmployeeComponent } from './components/add-employee/add-employee.component';
import { MmpEmployeesComponent } from './components/mmp-employees/mmp-employees.component';
import { TopicConceptsComponent } from './components/add-edit-courses/topic-concepts/topic-concepts.component';
import { EditSelfAssessQuesComponent } from './components/add-edit-courses/edit-self-assess-ques/edit-self-assess-ques.component';
import { CreateSelfassessQuesComponent } from './components/institute-home/create-selfassess-ques/create-selfassess-ques.component';
import { AllSelfassessQuesComponent } from './components/institute-home/all-selfassess-ques/all-selfassess-ques.component';
import { AddSchoolComponent } from './components/add-school/add-school.component';
import { BulkuploadSchoolComponent } from './components/bulkupload-school/bulkupload-school.component';
import { AddStudentComponent } from './components/add-student/add-student.component';
import { BulkuploadStudentComponent } from './components/bulkupload-student/bulkupload-student.component';
import { EditSelfassessquesComponent } from './components/institute-home/edit-selfassessques/edit-selfassessques.component';
import { ApproveSchoolsComponent } from './components/approve-schools/approve-schools.component';
import { CreateMentorfaqComponent } from './components/institute-home/create-mentorfaq/create-mentorfaq.component';
import { MentorfaqComponent } from './components/institute-home/mentorfaq/mentorfaq.component';
import { CreateBulkNotificationsComponent } from './components/create-bulk-notifications/create-bulk-notifications.component';
import { ApprovedSchoolsComponent } from './components/approved-schools/approved-schools.component';
import { CreatePostqueryQuestionComponent } from './components/institute-home/create-postquery-question/create-postquery-question.component';
import { AllPostqueryQuestionsComponent } from './components/institute-home/all-postquery-questions/all-postquery-questions.component';
import { EditPostqueryQuestionComponent } from './components/institute-home/edit-postquery-question/edit-postquery-question.component';

const routes: Routes = [
  {
    path: '', component: InstituteComponent,
    children: [
      {
        path: '', component: InstituteHomeComponent,
      },
      { path: 'topic', component: InstituteTopicComponent },
      { path: 'edit-topic-topic', component: EditTopicTopicComponent },
      { path: 'edit-topic-topic/:title/:description/:order', component: EditTopicTopicComponent },
      { path: 'question', component: InstituteQuestionComponent },
      { path: 'view-question', component: ViewQuestionComponent },
      { path: 'upload-question', component: UploadQuestionComponent },
      { path: 'create-student', component: CreateStudentComponent },
      { path: 'upload-student', component: UploadStudentsComponent },
      { path: 'add-student', component: AddStudentsComponent },
      { path: 'student-list', component: StudentsListComponent },
      { path: 'edit-student-list', component: EditStudentsListComponent },
      { path: 'add-question', component: AddQuestionComponent },
      { path: 'add-edit-courses', component: AddEditCoursesComponent },
      { path: 'create-course', component: CreateCourseComponent },
      { path: 'create-course/:title/:description/:order', component: CreateCourseComponent },
      { path: 'design-course', component: DesignCourseComponent },
      { path: 'design-path-question', component: DesignMakepathQuestionsComponent },
      { path: 'create-path-question', component: CreatePackageComponent },
      { path: 'edit-path-question', component: EditMakepathQuestionComponent },
      { path: 'create-chapter', component: CreateChapterComponent },
      { path: 'edit-question', component: EditQuestionComponent },
      { path: 'edit-course', component: EditCourseComponent },
      { path: 'add-edit-domains', component: AddEditDomainsComponent },
      { path: 'add-domain', component: CreateDomainComponent },
      { path: 'edit-domain', component: EditDomainComponent },
      { path: 'design-domain', component: DesignDomainComponent },
      { path: 'create-pathquestions', component: CreatePathquestionsComponent },
      { path: 'design-journey', component: DesignJourneyComponent },
      { path: 'domain-category', component: DomainCategoryComponent },
      { path: 'exam-level', component: ExamLevelComponent },
      { path: 'question-tag', component: QuestionTagsComponent },
      { path: 'question-type', component: QuestionTypesComponent },
      { path: 'average-time', component: AverageTimeComponent },
      { path: 'announcements', component: AnnouncementsComponent },
      { path: 'exam-grading', component: ExamGradingComponent },
      { path: 'exam-books', component:  ExamBooksComponent},
      { path: 'create-book', component: CreateSuggestedBooksComponent },
      { path: 'edit-book', component: EditSuggestedBookComponent },
      { path: 'exam-previous-papers', component:  PreviousPapersComponent},
      { path: 'create-previous-paper', component: CreatePreviousPaperComponent },
      { path: 'edit-previous-paper', component: EditPreviousPaperComponent },
      { path: 'user-queries', component: UserQueriesComponent },
      { path: 'reported-questions', component: ReportedQuestionsComponent },
      { path: 'contact-us', component: ContactUsComponent },
      { path: 'manage-faq', component: FaqComponent },
      { path: 'manage-states-cities', component: ManageStatesComponent },
      { path: 'notification-requests', component: ExamNotificationRequestComponent },
      { path: 'create-faq', component: CreateFaqComponent },
      { path: 'search-question', component: SearchQuestionComponent },
      { path: 'create-banner', component: CreateBannerComponent },
      { path: 'manage-banners', component: BannersComponent },
      { path: 'topic-concepts', component: TopicConceptsComponent },
      {
        path: 'make-paper/:exam', component: CreateMockUpComponent,
      },
      {
        path: 'view-mockpaper-parameters/:exam', component: ViewMockParametersComponent,
      },
      {
        path: 'make-self-assess-ques', component: CreateSelfAssessQuesComponent,
      },
      {
        path: 'view-self-assess-questions', component: ViewSelfAssessQuesComponent,
      },
      {
        path: 'edit-self-assess-question', component: EditSelfAssessQuesComponent,
      },
      { path: 'chapter-questions', component: ChapterQuestionsComponent },
      { path: 'register-employee', component: AddEmployeeComponent },
      { path: 'mmp-admins', component: MmpEmployeesComponent },
      { path: 'create-selfassess-ques', component: CreateSelfassessQuesComponent },
      { path: 'all-selfassess-ques', component: AllSelfassessQuesComponent },
      { path: 'edit-selfassess-ques', component: EditSelfassessquesComponent },
      { path: 'create-school', component: AddSchoolComponent },
      { path: 'approve-schools', component: ApproveSchoolsComponent },
      { path: 'create-mentorfaq', component: CreateMentorfaqComponent },
      { path: 'manage-mentorfaq', component: MentorfaqComponent },
      { path: 'create-bulknotification', component: CreateBulkNotificationsComponent },
      { path: 'approved-schools', component: ApprovedSchoolsComponent },
      { path: 'create-postquery-ques', component: CreatePostqueryQuestionComponent },
      { path: 'edit-postquery-ques', component: EditPostqueryQuestionComponent },
      { path: 'manage-postquery-questions', component: AllPostqueryQuestionsComponent },
      { path: '**', component: InstituteHomeComponent },
    ]
  },

];


@NgModule({
  declarations: [
    InstituteComponent,
    InstituteHomeComponent,
    InstituteQuestionComponent,
    InstituteTopicComponent,
    AddEditCoursesComponent,
    GetCreateUploadStudentsComponent,
    CreateCourseComponent,
    CreatePackageComponent,
    DesignCourseComponent,
    AddStudentsComponent,
    CreateStudentComponent,
    EditStudentsListComponent,
    StudentsListComponent,
    UploadStudentsComponent,
    AddQuestionComponent,
    EditQuestionComponent,
    UploadQuestionComponent,
    ViewQuestionComponent,
    EditTopicTopicComponent,
    SearchPipe,
    EditCourseComponent,
    AddEditDomainsComponent,
    CreateDomainComponent,
    EditDomainComponent,
    DesignDomainComponent,
    DesignJourneyComponent,
    CreatePathquestionsComponent,
    ExamLevelComponent,
    DomainCategoryComponent,
    DesignMakepathQuestionsComponent,
    EditMakepathQuestionComponent,
    CreateChapterComponent,
    QuestionTagsComponent,
    QuestionTypesComponent,
    AverageTimeComponent,
    AnnouncementsComponent,
    ExamGradingComponent,
    CreateSuggestedBooksComponent,
    EditSuggestedBookComponent,
    ExamBooksComponent,
    PreviousPapersComponent,
    CreatePreviousPaperComponent,
    EditPreviousPaperComponent,
    UserQueriesComponent,
    ReportedQuestionsComponent,
    ContactUsComponent,
    FaqComponent,
    CreateFaqComponent,
    CreateMockUpComponent,
    ViewMockParametersComponent,
    ManageStatesComponent,
    ExamNotificationRequestComponent,
    SearchQuestionComponent,
    CreateBannerComponent,
    BannersComponent,
    CreateSelfAssessQuesComponent,
    ViewSelfAssessQuesComponent,
    ChapterQuestionsComponent,
    AddEmployeeComponent,
    MmpEmployeesComponent,
    TopicConceptsComponent,
    EditSelfAssessQuesComponent,
    CreateSelfassessQuesComponent,
    AllSelfassessQuesComponent,
    AddSchoolComponent,
    BulkuploadSchoolComponent,
    AddStudentComponent,
    BulkuploadStudentComponent,
    EditSelfassessquesComponent,
    ApproveSchoolsComponent,
    CreateMentorfaqComponent,
    MentorfaqComponent,
    CreateBulkNotificationsComponent,
    ApprovedSchoolsComponent,
    CreatePostqueryQuestionComponent,
    AllPostqueryQuestionsComponent,
    EditPostqueryQuestionComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PipeListModule,
    AppBootStrapModule,
    NgbModule,
    CKEditorModule,
    RouterModule.forChild(routes),
    NgxPaginationModule
  ],
  exports: [
    RouterModule
  ]
})
export class InstituteModule { }
