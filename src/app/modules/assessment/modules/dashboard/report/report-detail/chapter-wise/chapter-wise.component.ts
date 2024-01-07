import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';

// Modals
import { ChapterFilter, ReportAdapter } from '../adapter/report-modal';
import { NetworkRequestService } from '../../../../../../../services/network-request.service';
import { MiscellaneousService } from '../../../../../../../services/miscellaneous.service';
import { ReportService } from '../services/report.service';
import { ReportChartService } from '../services/report-chart.service';

@Component({
  selector: 'app-chapter-wise',
  templateUrl: './chapter-wise.component.html',
  styleUrls: ['./chapter-wise.component.scss']
})
export class ChapterWiseComponent implements OnInit {

  constructor(
    private networkRequest: NetworkRequestService,
    private reportService: ReportService,
    private reportChartService: ReportChartService,
    private misc: MiscellaneousService,
    private adapter: ReportAdapter,
  ) { }

  @Input() answerPaperId: string;
  @ViewChild('subjectSelect', { static: false }) subjectSelectRef: ElementRef<any>;
  @ViewChild('chapterSelect', { static: false }) chapterSelectRef: ElementRef<any>;
  @ViewChild('performanceSelect', { static: false }) performanceSelectRef: ElementRef<any>;

  chapterWiseReport: Array<object>;
  chapterChart: any;

  chapterwiseFeedback: string;

  chapterFilter: ChapterFilter = {
    chapterId: null,
    subjectId: null,
    subjectName: null,
    chapterName: null,
    performance: null,
    subjects: [],
    chapters: [],
    accuracy: [],
    categories: []
  };
  newsubjects: any;
  getChapterWiseReport() {
    this.misc.showLoader();
    this.networkRequest.getWithHeaders(`/api/assessmentpaper_chapter_report/${this.answerPaperId}/`).subscribe(
      (data: any) => {
        this.misc.hideLoader();

        if (data['chapter_report_data']) {

          /** Get data from adapter pattern */
          this.chapterWiseReport = this.adapter.mapChapterData(data);

          /** Get Chapters & subject */
          this.chapterFilter = this.reportService.getChapterSubject(this.chapterFilter, this.chapterWiseReport);

          /** Generate Report */
          this.generateChapterReport();
        } else if (data['chapter_report_status']) {
          this.misc.hideLoader();

          /** Chapter wise report feedback */
          this.chapterwiseFeedback = data['chapter_report_status'];
        }
      }
    );
  }


  generateChapterReport() {

    /** Filtered accuracy data */
    this.chapterFilter = this.reportService.filterChapterData(this.chapterFilter, this.chapterWiseReport);

    /** Chart */
    this.chapterChart = this.reportChartService.chapterChart(this.chapterFilter);

    /** Unique Subjects */
    this.newsubjects = Array.from(new Set(this.chapterFilter.subjects.map(a => a['id'])))
      .map(id => {
        return this.chapterFilter.subjects.find(a => a['id'] === id)
      })
  }

  /**
   * Set Chapter id, remove subject is and generate new report for specific chapter 
   */
  onChapterChange(event: any) {


    this.performanceSelectRef.nativeElement.value = '';
    this.subjectSelectRef.nativeElement.value = '';

    let chapter = {
      name: null,
      id: null
    };

    if (event.target.value) {
      chapter = JSON.parse(event.target.value);
    }

    this.clearFilterValues();

    this.chapterFilter.chapterId = chapter.id;
    this.chapterFilter.chapterName = chapter.name;

    this.generateChapterReport();

  }


  /**
   * Set subject id, remove chapter is and generate new report for specific chapter 
   */
  onSubjectChange(event: any) {
    this.chapterSelectRef.nativeElement.value = '';
    this.performanceSelectRef.nativeElement.value = '';

    let subject = {
      name: null,
      id: null
    };

    if (event.target.value) {
      subject = JSON.parse(event.target.value);
    }

    this.clearFilterValues();

    this.chapterFilter.subjectId = subject.id;
    this.chapterFilter.subjectName = subject.name;

    this.generateChapterReport();

  }


  onPerformanceChange(event: any) {

    let performance = null;

    this.chapterSelectRef.nativeElement.value = '';
    this.subjectSelectRef.nativeElement.value = '';

    if (event.target.value) {
      performance = event.target.value;
    }

    this.clearFilterValues();

    this.chapterFilter.performance = performance;

    this.generateChapterReport();
  }


  clearFilter() {
    this.clearFilterValues();
    this.generateChapterReport();
  }


  clearFilterValues() {
    this.chapterFilter.chapterId = null;
    this.chapterFilter.chapterName = null;
    this.chapterFilter.subjectId = null;
    this.chapterFilter.subjectName = null;
    this.chapterFilter.performance = null;
  }


  ngOnInit() {
    this.getChapterWiseReport();
  }

}
