import { Injectable } from "@angular/core";

export interface ChapterFilter {
  subjectId: number;
  chapterId: number;
  subjectName: string;
  chapterName: string;
  performance: string;
  subjects: Array<object>;
  chapters: Array<object>;
  accuracy: Array<number>;
  categories: Array<string>;
}

export class Comparison {
  constructor(
    public subject: string,
    public topper: number,
    public average: number,
    public student: number
  ) { }
}

export class TestAnalysis {
  constructor(

    public subject: string,
    public chapter: string,
    public topic: string,
    public attempt: string,
    public correctedBy: number,
    public score: string,
    public timespent: number,
    public status: boolean,
    public questionId: string,
    public questionType: string,
    public difficulty: string,
    public correctMcq: Array<number>,
    public questionText: string,
  ) { }
}


export class ChapterWiseReport {
  constructor(
    public subjectId: number,
    public subjectName: string,
    public chapterId: number,
    public chapterName: string,
    public accuracy: number,
    public attempted: number,
    public corrected: number,
  ) { }
}


@Injectable()
export class ReportAdapter {
  adaptAnalysis(data: any): TestAnalysis {
    return new TestAnalysis(
      data.subject,
      data.chapter,
      data.topic,
      data.attempt,
      data.student_corrected,
      data.score,
      data.timespent,
      data.status,
      data.question_id,
      data.type_of_question,
      data.difficulty,
      data.correct_mcq_answer,
      data.question_text,
    );
  }

  adaptChapterReport(data: any): ChapterWiseReport {
    return new ChapterWiseReport(
      data.subject_id,
      data.subject_name,
      data.chapter_id,
      data.chapter_name,
      data.accuracy,
      data.attempted,
      data.corrected,
    );
  }

  adaptComparison(data: any): Comparison {
    return new Comparison(
      data.subject,
      data.topper,
      data.average,
      data.student
    );
  }


  mapAnalysisData(data: any) {
    return data.question_data.map((item: any) => this.adaptAnalysis(item));
  }


  mapChapterData(data: any) {
    return data.chapter_report_data.map((item: any) => this.adaptChapterReport(item));
  }


  mapComparison(data: Array<object>) {
    return data.map((item: any) => this.adaptComparison(item));
  }
}
