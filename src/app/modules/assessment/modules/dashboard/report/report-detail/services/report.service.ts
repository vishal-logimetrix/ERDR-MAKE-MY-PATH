import { Injectable } from '@angular/core';
import { ChapterFilter, ChapterWiseReport, Comparison } from '../adapter/report-modal';

@Injectable()
export class ReportService {

  constructor() { }

  /**
   * Formats practice test report data to be consumed by charts
   */
  formatReportData(report: object) {

    // Generate data for difficulty wise report data
    report['difficulty_wise_report']['title'] = 'Easy, Medium, Hard Correct Questions Report';
    report['difficulty_wise_report']['category'] = ['Easy', 'Medium', 'Hard'];
    report['difficulty_wise_report']['series'] = [
      {
        name: `Easy (%)`,
        data: [report['difficulty_wise_report']['easy']]
      },
      {
        name: `Medium (%)`,
        data: [report['difficulty_wise_report']['medium']]
      },
      {
        name: `Hard (%)`,
        data: [report['difficulty_wise_report']['hard']]
      }
    ];

    // Generate data for question type based report data 
    report['question_type_based_report']['title'] = 'Formula, Conceptual, Application Correct Questions Report';
    report['question_type_based_report']['category'] = ['Formula', 'Conceptual', 'Application'];
    report['question_type_based_report']['series'] = [
      {
        name: `Formula (%)`,
        data: [report['question_type_based_report']['formula']]
      },
      {
        name: `Conceptual (%)`,
        data: [report['question_type_based_report']['conceptual']]
      },
      {
        name: `Application (%)`,
        data: [report['question_type_based_report']['application']]
      }
    ];
    return report;
  }


  /**
   * @param reportData Rank Report data
   */
  formatRankData(reportData: object) {
    return {
      title: 'Percentile in National, State, & City',
      category: ['National Percentile', 'State Percentile', 'City Percentile'],
      data: [
        reportData['national_rank'],
        reportData['state_rank'],
        reportData['city_rank']
      ],
    };
  }

  /**
   * Formats following data for highcharts
   * 1. Attempted Ratio
   * 2. Corrected Ratio
   * 3. Score
   * 4. Category list
   */
  formatOverallReportData(reportData: Array<object>) {

    const attemptedRatio = [], correctedRatio = [], score = [], testCategories = [];
    reportData.forEach((report: object, index: number) => {
      attemptedRatio.push(report['attempted_ratio']);
      correctedRatio.push(report['corrected_ratio']);
      testCategories.push(`Attempt ${index + 1}`);
      score.push(report['score']);
    });

    return {
      attemptedRatio: attemptedRatio,
      correctedRatio: correctedRatio,
      score: score,
      category: testCategories
    };
  }


  /**
   * @returns subject and chapter list
   */
  getChapterSubject(chapterFilter: ChapterFilter, reportData: Array<object>): ChapterFilter {

    reportData.forEach((chapter: ChapterWiseReport) => {

      // Chapter List
      chapterFilter.chapters.push({
        id: chapter.chapterId,
        name: chapter.chapterName,
      });

      // Subject List
      chapterFilter.subjects.push({
        id: chapter.subjectId,
        name: chapter.subjectName,
      });


      // Chapter name as chart category names
      chapterFilter.categories.push(chapter.chapterName);

    });

    // Unique Subjects
    chapterFilter.subjects = Array.from(new Set(chapterFilter.subjects));
    return chapterFilter;
  }


  /**
   * @returns accuracy data
   */
  filterChapterData(chapterFilter: ChapterFilter, reportData: Array<object>): ChapterFilter {

    const accuracy = [];

    /** If No subject or chapter clicked */
    if (!chapterFilter.chapterId && !chapterFilter.subjectId && !chapterFilter.performance) {
      chapterFilter.categories = [];
      reportData.forEach((chapter: ChapterWiseReport) => {
        chapterFilter.categories.push(chapter.chapterName);
        // Accuracy
        accuracy.push(chapter.accuracy);
      });

      /** If Chapter clicked */
    } else if (chapterFilter.chapterId) {

      // Make Categories blank
      chapterFilter.categories = [];
      reportData.forEach((chapter: ChapterWiseReport) => {

        /** New Accuracy and new cetgories */
        if (chapterFilter.chapterId === chapter.chapterId) {
          chapterFilter.categories.push(chapter.chapterName);
          accuracy.push(chapter.accuracy);
        }
      });

      /** If Subject Clicked */
    } else if (chapterFilter.subjectId) {
      chapterFilter.categories = [];
      reportData.forEach((chapter: ChapterWiseReport) => {

        /** New Accuracy and new cetgories */
        if (chapterFilter.subjectId === chapter.subjectId) {
          chapterFilter.categories.push(chapter.chapterName)
          accuracy.push(chapter.accuracy);
        }
      });
    } else if (chapterFilter.performance) {

      chapterFilter.categories = [];
      reportData.forEach((chapter: ChapterWiseReport) => {

        /** New Accuracy and new cetgories */
        if (chapterFilter.performance === 'poor' && chapter.accuracy <= 40) {
          chapterFilter.categories.push(chapter.chapterName);
          accuracy.push(chapter.accuracy);
        } else if (chapterFilter.performance === 'adequate' && (chapter.accuracy > 40 && chapter.accuracy <= 70)) {
          chapterFilter.categories.push(chapter.chapterName);
          accuracy.push(chapter.accuracy);
        } else if (chapterFilter.performance === 'excellent' && chapter.accuracy > 70) {
          chapterFilter.categories.push(chapter.chapterName);
          accuracy.push(chapter.accuracy);
        }
      });
    }
    chapterFilter.accuracy = accuracy;
    return chapterFilter;
  }


  formatComparison(comparisonType: string, data: Array<object>) {

    let title = '';
    let yTitle = '';
    const you = [];
    const topper = [];
    const average = [];
    const subject = [];

    if (comparisonType === 'score') {
      title = 'Score Comparison';
      yTitle = 'Score';
    } else if (comparisonType === 'attempted') {
      title = 'Attempted Questions Comparison';
      yTitle = 'Attempted Questions (%)';
    } else if (comparisonType === 'accuracy') {
      title = 'Accuracy Comparison';
      yTitle = 'Accuracy (%)';
    }

    data.forEach((report: Comparison) => {
      subject.push(report.subject)
      you.push(report.student);
      topper.push(report.topper);
      average.push(report.average);
    });


    return {
      title: title,
      yTitle: yTitle,
      you: you,
      topper: topper,
      average: average,
      subject: subject
    };
  }
}
