import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SanitizedHtmlPipe } from './sanitized-html.pipe';



@NgModule({
  declarations: [SanitizedHtmlPipe],
  imports: [CommonModule],
  exports: [SanitizedHtmlPipe]
})
export class PipesModule { }
