import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

// Directives
import { OnlineOfflineDirective } from '../../../../directives/online-offline.directive';

// Components
import { PaperComponent } from './paper.component';
import { ExamQuestionsComponent } from './exam-questions/exam-questions.component';
import { MyPaperComponent } from './my-paper/my-paper.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RespondSharedpaperComponent } from './respond-sharedpaper/respond-sharedpaper.component';
import { IncorrectExamQuestionsComponent } from './incorrect-exam-questions/incorrect-exam-questions.component';
import { SafeHtmlPipe } from './pipes/safeHtml.pipe';
import { BlockUIModule } from 'ng-block-ui';
import { BlockTemplateComponent } from './block-template/block-template.component';
import { MentorPaperComponent } from './mentor-paper/mentor-paper.component';
import { MentorPaperInstructionsComponent } from './mentor-paper-instructions/mentor-paper-instructions.component';
import { MentorPaperSolutionReviewComponent } from './mentor-paper-solution-review/mentor-paper-solution-review.component';
import { ImageCompressService,ResizeOptions,ImageUtilityService } from '@almartino/ng2-image-compress';
import { SolutionsComponent } from './solutions/solutions.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { PracticePaperComponent } from './practice-paper/practice-paper.component';
import { MentorPracticePaperComponent } from './mentor-practice-paper/mentor-practice-paper.component';
import { SelfAssessmentComponent } from './self-assessment/self-assessment.component';
import { PreGoalAssessmentComponent } from './pre-goal-assessment/pre-goal-assessment.component';
import { GoalPaperInstructionsComponent } from './goal-paper-instructions/goal-paper-instructions.component';
import { PreGoalPaperSolutionComponent } from './pre-goal-paper-solution/pre-goal-paper-solution.component';

const routes: Routes = [
  {
    path: '', component: PaperComponent,
    children: [
      {
        path: 'test/:type/:id/:attemptOrder',
        loadChildren: () => import('./test/test.module')
          .then(m => m.TestModule)
      },
      {
        path: 'test-instructions/:exam',
        loadChildren: () => import('./instructions/instructions.module')
          .then(m => m.InstructionsModule)
      },
      {
        path: 'exam-questions/:exam', component: ExamQuestionsComponent,
      },
      {
        path: 'exam-incorrect-questions/:exam', component: IncorrectExamQuestionsComponent,
      },
      {
        path: 'my-paper/:exam', component: MyPaperComponent,
      },
      {
        path: 'mentor-paper-instructions/:exam', component: MentorPaperInstructionsComponent,
      },
      {
        path: 'mentor-paper/:exam', component: MentorPaperComponent,
      },
      {
        path: 'mentor-paper-solution-review/:exam', component: MentorPaperSolutionReviewComponent,
      },
      {
        path: 'solutions/:exam', component: SolutionsComponent,
      },
      {
        path: 'practice-paper/:exam', component: PracticePaperComponent,
      },
      {
        path: 'self-assessment-paper/:exam', component: SelfAssessmentComponent,
      },
      {
        path: 'mentor-assignment/:exam', component: MentorPracticePaperComponent,
      },
      {
        path: 'pregoal-paper/:exam', component: PreGoalAssessmentComponent,
      },
      {
        path: 'goal-paper-instructions/:exam', component: GoalPaperInstructionsComponent,
      },
      {
        path: 'pregoal-paper-solution', component: PreGoalPaperSolutionComponent,
      },
    ]
  },
];

@NgModule({
  declarations: [
    PaperComponent,
    OnlineOfflineDirective,
    ExamQuestionsComponent,
    MyPaperComponent,
    RespondSharedpaperComponent,
    IncorrectExamQuestionsComponent,
    SafeHtmlPipe,
    BlockTemplateComponent,
    MentorPaperComponent,
    MentorPaperInstructionsComponent,
    MentorPaperSolutionReviewComponent,
    SolutionsComponent,
    NavbarComponent,
    SidebarComponent,
    PracticePaperComponent,
    MentorPracticePaperComponent,
    SelfAssessmentComponent,
    PreGoalAssessmentComponent,
    GoalPaperInstructionsComponent,
    PreGoalPaperSolutionComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    RouterModule.forChild(routes),
    BlockUIModule.forRoot({template: BlockTemplateComponent})
  ],
  providers: [ImageCompressService, ResizeOptions],
  entryComponents: [
    BlockTemplateComponent
  ],
})
export class PaperModule { }
