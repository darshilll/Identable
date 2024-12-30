import { Directive, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import MediumEditor from 'medium-editor';

@Directive({
  selector: '[appMediumEditor]',
})
export class MediumEditorDirective implements OnInit, OnDestroy {
  @Input() editorConfig: any; // Optional editor configuration input
  editor: any;

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    this.initEditor();
  }

  initEditor(): void {
    this.editor = new MediumEditor(this.el.nativeElement, this.editorConfig || {});
  }

  ngOnDestroy(): void {
    if (this.editor) {
      this.editor.destroy(); // Destroy editor instance on component destroy
    }
  }

  getEditorInstance() {
    return this.editor;
  }
}