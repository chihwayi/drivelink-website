import { TestBed } from '@angular/core/testing';

import { ImageResize } from './image-resize';

describe('ImageResize', () => {
  let service: ImageResize;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImageResize);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
