import { TestBed } from '@angular/core/testing';

import { HomeSliderService } from './home-slider.service';

describe('HomeSliderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HomeSliderService = TestBed.get(HomeSliderService);
    expect(service).toBeTruthy();
  });
});
