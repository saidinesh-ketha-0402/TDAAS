import { Component, ElementRef, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { timer } from 'rxjs';
import {transpile} from 'typescript';
import hljs from 'highlight.js';
import typescript from 'highlight.js/lib/languages/typescript';
import html from 'highlight.js/lib/languages/xml';

@Component({
  selector: 'app-prompt2-code-output',
  templateUrl: './prompt2-code-output.component.html',
  styleUrls: ['./prompt2-code-output.component.css']
})
export class Prompt2CodeOutputComponent {
  public outputContent: SafeHtml = ""
  public copiedCode = "Code Copied!"
  public copiedScript = "Script Copied!"
  @Input() public outputHTMLCode = "Code"
  @Input() public outputScriptCode = "Script"
  @Output() public backPressed = new EventEmitter()
  public showCode: boolean = false

  private outputJSCode = ""

  constructor(private sanitizer: DomSanitizer, private elementRef: ElementRef) {
    hljs.registerLanguage('typescript', typescript);
    hljs.registerLanguage('html', html);
  }

  @Input() set hidden(value: boolean) {
    this.elementRef.nativeElement.hidden = value;
    if (value) {
      this.showCode = true
    }
  };

  ngOnChanges(changes: SimpleChanges) {
    if (changes['outputHTMLCode']) {
      //console.log("property change" + this.outputHTMLCode)
      this.outputContent = this.sanitizer.bypassSecurityTrustHtml(this.outputHTMLCode)
      this.copiedCode = this.outputHTMLCode
      this.outputHTMLCode = hljs.highlight(this.outputHTMLCode, { language: 'html' }).value
    }
    
    if (changes['outputScriptCode']) {
      console.log("property change\n\n" + this.outputScriptCode)
      this.outputJSCode = transpile(this.outputScriptCode)
      const delayMilliseconds = 2000; // 2 seconds
      timer(delayMilliseconds).subscribe(() => {
        eval(this.outputJSCode)
      });
      this.copiedScript = this.outputScriptCode
      this.outputScriptCode = hljs.highlight(this.outputScriptCode, { language: 'typescript' }).value
    }
  }

  public onRenderClicked() {
    this.showCode = false;
  }

  public onCodeClicked() {
    this.showCode = true;
  }

  public onBackClicked() {
    this.backPressed.emit()
  }

  public onCopyCodeClicked() {
    this.copyStringToClipboard(this.copiedCode)
  }

  public onCopyScriptClicked() {
    this.copyStringToClipboard(this.copiedScript)
  }

  private copyStringToClipboard(data: string) {
    const { clipboard } = navigator;
    clipboard.writeText(data)
      .then(() => {
        console.log('Text copied to clipboard: ' + data);
      })
      .catch((err) => {
        console.error('Failed to copy text: ' + err);
      });
  }
}
