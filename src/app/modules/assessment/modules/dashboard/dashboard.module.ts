import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { GaugeChartModule } from 'angular-gauge-chart';

// Custom Modules
import { PipeListModule } from '../../../../shared/modules/pipe-list.module';

// Components
import { DashboardComponent } from './dashboard.component';
import { CongratulationsComponent } from './modals/congratulations/congratulations.component';
import { CompleteProfileComponent } from './profile/complete-profile/complete-profile.component';

import { DashboardNavComponent } from './layout/dashboard-nav/dashboard-nav.component';
import { DashboardFooterComponent } from './layout/dashboard-footer/dashboard-footer.component';
import { DashboardSidebarComponent } from './layout/dashboard-sidebar/dashboard-sidebar.component';

// Guards
import { CanActivateDashboardGuard } from '../../../../permissions/can-activate-dashboard.guard';
import { HomeComponent } from './home/home.component';
import { MypathComponent } from './mypath/mypath.component';
import { SuggestedBooksComponent } from './suggested-books/suggested-books.component';
import { ChoosePComponent } from './choose-p/choose-p.component';
import { ChooseSubtypeComponent } from './choose-subtype/choose-subtype.component';
import { ChooseSubjectsChaptersComponent } from './choose-subjects-chapters/choose-subjects-chapters.component';
import { MakePracticeComponent } from './make-practice/make-practice.component';
import { MakePaperComponent } from './make-paper/make-paper.component';
import { CKEditorModule } from 'ng2-ckeditor';
import { MyHistoryComponent } from './my-history/my-history.component';
import { MyMentorsComponent } from './my-mentors/my-mentors.component';
import { ChartModule } from 'angular-highcharts';
import { BookmarksComponent } from './bookmarks/bookmarks.component';
import { BookmarkDetailComponent } from './bookmark-detail/bookmark-detail.component';
import { MySharingComponent } from './my-sharing/my-sharing.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { MyExamsComponent } from './my-exams/my-exams.component';
import { UserReportComponent } from './user-report/user-report.component';
import { MyPapersComponent } from './my-papers/my-papers.component';
import { ExamsComponent } from './exams/exams.component';
import { ExamHistoryComponent } from './exam-history/exam-history.component';
import { RespondPaperSharingComponent } from './respond-paper-sharing/respond-paper-sharing.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { PreviousYearQuestionComponent } from './previous-year-question/previous-year-question.component';
import { BatchDetailsComponent } from './batch-details/batch-details.component';
import { ContactComponent } from './contact/contact.component';
import { SentReceivedComponent } from './sent-received/sent-received.component';
import { UserMentorPaperReportComponent } from './user-mentor-paper-report/user-mentor-paper-report.component';
import { MentorPaperSolutionReviewComponent } from './mentor-paper-solution-review/mentor-paper-solution-review.component';
import { SafeHtmlPipe } from './pipes/safeHtml.pipe';
import { PracticeReportComponent } from './practice-report/practice-report.component';
import { MentorPracticeReportComponent } from './mentor-practice-report/mentor-practice-report.component';
import { CreateGoalComponent } from './create-goal/create-goal.component';
import { ExamGoalComponent } from './exam-goal/exam-goal.component';
import { GoalDetailsComponent } from './goal-details/goal-details.component';
import { GoalPathComponent } from './goal-path/goal-path.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PreGoalReportComponent } from './pre-goal-report/pre-goal-report.component';
import { UpdatePasswordComponent } from './update-password/update-password.component';
import { NgpSortModule } from 'ngp-sort-pipe';
import { EditPathTitleComponent } from './edit-path-title/edit-path-title.component';
import { EditPathSyllabusComponent } from './edit-path-syllabus/edit-path-syllabus.component';
import { NotificationsNewComponent } from './notifications-new/notifications-new.component';

const routes: Routes = [
  {
    path: '', component: DashboardComponent,
    children: [
      {
        path: '', component: HomeComponent,
        canActivate: [CanActivateDashboardGuard]
      },
      {
        path: 'choose-p/:exam', component: ChoosePComponent,
        canActivate: [CanActivateDashboardGuard]
      },
      
      {
        path: 'myexam-history/:exam', component: ExamHistoryComponent,
        canActivate: [CanActivateDashboardGuard]
      },
      {
        path: 'choose-subcategory/:domain', component: ChooseSubtypeComponent,
        canActivate: [CanActivateDashboardGuard]
      },
      {
        path: 'respond-paper-request/:exam', component: RespondPaperSharingComponent,
      },
      {
        path: 'mypath/:exam', component: MypathComponent,
        canActivate: [CanActivateDashboardGuard]
      },
      {
        path: 'suggested-books/:exam', component: SuggestedBooksComponent,
        canActivate: [CanActivateDashboardGuard]
      },
      {
        path: 'choose-subject-chapters/:exam', component: ChooseSubjectsChaptersComponent,
      },
      {
        path: 'make-paper/:exam', component: MakePaperComponent,
      },
      {
        path: 'practice/:exam', component: MakePracticeComponent,
      },
      {
        path: 'exams', component: MyExamsComponent,
        canActivate: [CanActivateDashboardGuard]
      },
      {
        path: 'my-papers', component: MyPapersComponent,
        canActivate: [CanActivateDashboardGuard]
      },
      {
        path: 'myhistory', component: MyHistoryComponent,
        canActivate: [CanActivateDashboardGuard]
      },
      {
        path: 'mymentors', component: MyMentorsComponent,
        canActivate: [CanActivateDashboardGuard]
      },
      {
        path: 'update-password', component: UpdatePasswordComponent,
        canActivate: [CanActivateDashboardGuard]
      },
      {  path: 'all-exams', component: ExamsComponent,
         canActivate: [CanActivateDashboardGuard]
      },
      {  path: 'previous-year-question/:exam', component: PreviousYearQuestionComponent,
         canActivate: [CanActivateDashboardGuard]
      },
      {  path: 'contact', component: ContactComponent,
         canActivate: [CanActivateDashboardGuard]
      },
      {
        path: 'all-exams/:category', component: ExamsComponent,
        canActivate: [CanActivateDashboardGuard]
      },
      {
        path: 'report/:type/:id/:attemptOrder', component: UserReportComponent,
        canActivate: [CanActivateDashboardGuard]
      },
      {
        path: 'mentor-paper-report/:type/:id/:attemptOrder', component: UserMentorPaperReportComponent,
        canActivate: [CanActivateDashboardGuard]
      },
      {  
        path: 'batch-details/:batch', component: BatchDetailsComponent,
        canActivate: [CanActivateDashboardGuard]
      },
      {
        path: 'bookmarks', component: BookmarksComponent,
        canActivate: [CanActivateDashboardGuard]
      },
      {
        path: 'bookmark-detail/:exam/:subject/:chapter', component: BookmarkDetailComponent,
        canActivate: [CanActivateDashboardGuard]
      },
      {
        path: 'my-sharing', component: MySharingComponent,
        canActivate: [CanActivateDashboardGuard]
      },
      {
        path: 'sent-received/:type', component: SentReceivedComponent,
        canActivate: [CanActivateDashboardGuard]
      },
      {
        path: 'leaderboard/:exam', component: LeaderboardComponent,
        canActivate: [CanActivateDashboardGuard]
      },
      {
        path: 'mentor-paper-solution-review/:exam', component: MentorPaperSolutionReviewComponent,
      },
      {
        path: 'add-goal/:exam', component: CreateGoalComponent,
      },
      {
        path: 'my-goals/:exam', component: ExamGoalComponent,
      },
      {
        path: 'goal-details/:exam', component: GoalDetailsComponent,
      },
      {
        path: 'goal-path/:goal', component: GoalPathComponent,
      },
      {
        path: 'edit-path-title/:exam', component: EditPathTitleComponent,
      },
      {
        path: 'edit-path-syllabus/:exam', component: EditPathSyllabusComponent,
      },
      {
        path: 'notifications', component: NotificationsNewComponent,
      },
      {
        path: 'goal-report/:type/:id/:attemptOrder', component: PreGoalReportComponent,
        canActivate: [CanActivateDashboardGuard]
      },
      {
        path: 'my-assessment',
        loadChildren: () => import('./my-assessment/my-assessment.module')
          .then(m => m.MyAssessmentModule),
        canActivate: [CanActivateDashboardGuard]
      },
      {
        path: 'change-password',
        loadChildren: () => import('./change-password/change-password.module')
          .then(m => m.ChangePasswordModule),
        canActivate: [CanActivateDashboardGuard]
      },
      {
        path: 'contact-us',
        loadChildren: () => import('./contact-us/contact-us.module')
          .then(m => m.ContactUsModule),
      },
      {
        path: 'profile',
        loadChildren: () => import('./profile/profile.module')
          .then(m => m.ProfileModule),
      },
      {
        path: 'view-notifications',
        loadChildren: () => import('./notifications/notifications.module')
          .then(m => m.NotificationsModule),
        canActivate: [CanActivateDashboardGuard]
      },
      {
        path: 'report',
        loadChildren: () => import('./report/report.module').then(m => m.ReportModule),
        canActivate: [CanActivateDashboardGuard]
      },
      {
        path: 'faq',
        loadChildren: () => import('./faq/faq.module').then(m => m.FaqModule)
      },
      {
        path: 'practice-report/:id', component: PracticeReportComponent,
        canActivate: [CanActivateDashboardGuard]
      },
      {
        path: 'assignment-report/:id', component: MentorPracticeReportComponent,
        canActivate: [CanActivateDashboardGuard]
      },
    ],
  },
];

@NgModule({
  declarations: [
    DashboardComponent,
    DashboardNavComponent,
    DashboardFooterComponent,
    DashboardSidebarComponent,
    CompleteProfileComponent,
    CongratulationsComponent,
    HomeComponent,
    MypathComponent,
    SuggestedBooksComponent,
    ChoosePComponent,
    ChooseSubtypeComponent,
    ChooseSubjectsChaptersComponent,
    MakePracticeComponent,
    MakePaperComponent,
    MyHistoryComponent,
    MyMentorsComponent,
    BookmarksComponent,
    BookmarkDetailComponent,
    MySharingComponent,
    LeaderboardComponent,
    MyExamsComponent,
    UserReportComponent,
    MyPapersComponent,
    ExamsComponent,
    ExamHistoryComponent,
    RespondPaperSharingComponent,
    PreviousYearQuestionComponent,
    BatchDetailsComponent,
    ContactComponent,
    SentReceivedComponent,
    UserMentorPaperReportComponent,
    MentorPaperSolutionReviewComponent,
    SafeHtmlPipe,
    PracticeReportComponent,
    MentorPracticeReportComponent,
    CreateGoalComponent,
    ExamGoalComponent,
    GoalDetailsComponent,
    GoalPathComponent,
    PreGoalReportComponent,
    UpdatePasswordComponent,
    EditPathTitleComponent,
    EditPathSyllabusComponent,
    NotificationsNewComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PipeListModule,
    CKEditorModule,
    NgpSortModule,
    RouterModule.forChild(routes),
    ChartModule,
    GaugeChartModule,
    HighchartsChartModule,
    NgbModule
  ]
})
export class DashboardModule {
}
