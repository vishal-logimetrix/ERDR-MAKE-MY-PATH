import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {TruncatePipe} from '../../pipes/truncate.pipe';
import {SafeHTMLPipe} from '../../pipes/safe-html.pipe';
import { ValueArrayPipe } from 'src/app/pipes/value-array.pipe';

@NgModule({
  declarations: [
    TruncatePipe,
    SafeHTMLPipe,
    ValueArrayPipe
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    TruncatePipe,
    SafeHTMLPipe,
    ValueArrayPipe
  ]
})
export class PipeListModule {
}
