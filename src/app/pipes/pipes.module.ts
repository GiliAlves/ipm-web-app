import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SanitizedHtmlPipe } from './sanitized-html.pipe';
import { ReversePipe } from './reverse.pipe';



@NgModule({
  declarations: [SanitizedHtmlPipe, ReversePipe],
  imports: [CommonModule],
  exports: [SanitizedHtmlPipe, ReversePipe]
})
export class PipesModule { }
