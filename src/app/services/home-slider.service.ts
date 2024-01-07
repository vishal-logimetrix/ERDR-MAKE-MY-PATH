import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class HomeSliderService {

  constructor() { }

  homePageSlider = [
    'Smart Assessment Platform',
    'Online Test Prepartion of Competitive Exams',
    'Comprehensive Performance Analysis',
    'Identification of Core Strengths and Weaknesses',
    'True reflection of Reality Check and Progress Growth'
  ]
  currentSlideIndex = 0;

  initializeSlider() {

    return new Observable(observer => {

      observer.next(this.homePageSlider[this.currentSlideIndex]);

      setInterval(() => {

        if (this.currentSlideIndex > this.homePageSlider.length - 2) {
          this.currentSlideIndex = 0;
        } else {
          this.currentSlideIndex++;
        }

        observer.next(this.homePageSlider[this.currentSlideIndex]);

      }, 3000);
    });
  }
}
