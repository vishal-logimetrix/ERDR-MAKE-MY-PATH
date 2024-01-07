import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrganizationComponent } from './organization.component';
import { OrganizationHomeComponent } from './components/organization-home/organization-home.component';
import { OrganizationNavComponent } from './layout/organization-nav/organization-nav.component';
import { OrganizationFooterComponent } from './layout/organization-footer/organization-footer.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppBootStrapModule } from 'src/app/bootstrap-module';
import { MentorsExamsComponent } from './components/mentors-exams/mentors-exams.component';
import { ChartModule } from 'angular-highcharts';
import { MentorProfileComponent } from './components/mentor-profile/mentor-profile.component';
import { CreateBatchComponent } from './components/create-batch/create-batch.component';
import { GroupComponent } from './components/group/group.component';
import { SelectDomainComponent } from './components/select-domain/select-domain.component';
import { ExamComponent } from './components/exam/exam.component';
import { ChoosePComponent } from './components/choose-p/choose-p.component';
import { MakePaperComponent } from './components/make-paper/make-paper.component';
import { MypathComponent } from './components/mypath/mypath.component';
import { SuggestedBooksComponent } from './components/suggested-books/suggested-books.component';
import { ChooseSubtypeComponent } from './components/choose-subtype/choose-subtype.component';
import { StudentDetailsReportComponent } from './components/student-details-report/student-details-report.component';
import { InstructionsComponent } from './components/instructions/instructions.component';
import { ExamQuestionsComponent } from './components/exam-questions/exam-questions.component';
import { SafeHtmlPipe } from './pipes/safeHtml.pipe';
import { StudentResultAnalysisComponent } from './components/student-result-analysis/student-result-analysis.component';
import { UserReportComponent } from './components/user-report/user-report.component';
import { BlockedStudentsComponent } from './components/blocked-students/blocked-students.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { GaugeChartModule } from 'angular-gauge-chart';
import { MentorBatchesComponent } from './components/mentor-batches/mentor-batches.component';
import { BatchLeaderboardComponent } from './components/batch-leaderboard/batch-leaderboard.component';
import { UserQuestionsStatusReportComponent } from './components/user-questions-status-report/user-questions-status-report.component';
import { PreviousYearQuestionComponent } from './components/previous-year-question/previous-year-question.component';
import { MakeAssignmentComponent } from './components/make-assignment/make-assignment.component';
import { PracticeQuestionsComponent } from './components/practice-questions/practice-questions.component';
import { PostQueryComponent } from './components/post-query/post-query.component';
import { ContactUsComponent } from './components/contact-us/contact-us.component';
import { FaqComponent } from './components/faq/faq.component';
import { PaperQuestionsComponent } from './components/paper-questions/paper-questions.component';
import { BookmarksComponent } from './components/bookmarks/bookmarks.component';
import { BookmarkDetailComponent } from './components/bookmark-detail/bookmark-detail.component';
import { NgpSortModule } from 'ngp-sort-pipe';

const routes: Routes = [
  {
    path: '', component: OrganizationComponent,
    children: [
      {
        path: '', component: OrganizationHomeComponent,
      },
      {
        path: 'exams/:batch', component: MentorsExamsComponent,
      },
      {path: 'profile', component: MentorProfileComponent},
      {path: 'create-batch', component: CreateBatchComponent},
      {path: 'group/:batch', component: GroupComponent},
      {path: 'select-domain/:batch', component: SelectDomainComponent},
      {path: 'all-exams/:batch/:category', component: ExamComponent},
      {path: 'choose-subcategory/:batch/:domain', component: ChooseSubtypeComponent},
      {path: 'mypath/:batch/:exam', component: MypathComponent},
      {path: 'suggested-books/:batch/:exam', component: SuggestedBooksComponent},
      {path: 'make-paper/:batch/:exam', component: MakePaperComponent},
      {path: 'choose-p/:batch/:exam', component: ChoosePComponent},
      {path: 'student-details-report/:batch', component: StudentDetailsReportComponent},
      {path: 'test-instructions/:batch/:exam', component: InstructionsComponent},
      {path: 'exam-questions/:batch', component: ExamQuestionsComponent},
      {path: 'student-result-analysis/:batch', component: StudentResultAnalysisComponent},
      {path: 'student-report/:type/:id/:user/:batch', component: UserReportComponent},
      {path: 'blocked-students/:batch', component: BlockedStudentsComponent},
      {path: 'batches', component: MentorBatchesComponent},
      {path: 'batch-leaderboard/:batch', component: BatchLeaderboardComponent},
      {path: 'user-solutions/:user/:batch', component: UserQuestionsStatusReportComponent},
      {path: 'previous-year-question/:batch/:exam', component: PreviousYearQuestionComponent},
      {path: 'make-assignment/:batch/:exam', component: MakeAssignmentComponent},
      {path: 'practice-questions/:batch', component: PracticeQuestionsComponent},
      {path: 'paper-questions/:batch', component: PaperQuestionsComponent},
      {path: 'post-query', component: PostQueryComponent},
      {path: 'contact-us', component: ContactUsComponent},
      {path: 'faq', component: FaqComponent},
      {path: 'bookmarks/:batch', component: BookmarksComponent},
      {path: 'bookmark-detail/:exam/:subject/:chapter/:batch', component: BookmarkDetailComponent},
    ]
  },

];


@NgModule({
  declarations: [
    OrganizationComponent,
    OrganizationHomeComponent,
    OrganizationNavComponent,
    OrganizationFooterComponent,
    MentorsExamsComponent,
    MentorProfileComponent,
    CreateBatchComponent,
    GroupComponent,
    SelectDomainComponent,
    ExamComponent,
    ChooseSubtypeComponent,
    ChoosePComponent,
    MakePaperComponent,
    MypathComponent,
    SuggestedBooksComponent,
    StudentDetailsReportComponent,
    InstructionsComponent,
    ExamQuestionsComponent,
    SafeHtmlPipe,
    StudentResultAnalysisComponent,
    UserReportComponent,
    BlockedStudentsComponent,
    MentorBatchesComponent,
    BatchLeaderboardComponent,
    UserQuestionsStatusReportComponent,
    MakeAssignmentComponent,
    PracticeQuestionsComponent,
    PostQueryComponent,
    ContactUsComponent,
    FaqComponent,
    PaperQuestionsComponent,
    PreviousYearQuestionComponent,
    BookmarksComponent,
    BookmarkDetailComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ChartModule,
    AppBootStrapModule,
    GaugeChartModule,
    HighchartsChartModule,
    NgpSortModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class OrganizationModule { }
