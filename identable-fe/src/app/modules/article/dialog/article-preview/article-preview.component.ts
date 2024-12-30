import {
  Component,
  Inject,
  Renderer2,
  ElementRef,
  ViewChild,
} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { LoaderService } from 'src/app/providers/loader-service/loader.service';
import saveAs from 'file-saver';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { CommonFunctionsService } from '../../../../utils/common-functions/common-functions.service';

@Component({
  selector: 'app-article-preview',
  templateUrl: './article-preview.component.html',
  styleUrls: ['./article-preview.component.scss'],
})
export class ArticlePreviewComponent {
  @ViewChild('pdfContent', { static: false }) pdfContent!: ElementRef;

  articleContentData: any;
  articleBannerLayoutObj: any;
  articleCTALayoutData: any;
  currentDocumentId: any;

  articleHtml: SafeHtml;
  articleHtmlForDowanload: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _dialog: MatDialog,
    private dialogRef: MatDialogRef<ArticlePreviewComponent>,
    private elRef: ElementRef,
    private renderer: Renderer2,
    public _utilities: CommonFunctionsService,
    private _loader: LoaderService,
    private sanitizer: DomSanitizer
  ) {
    this.articleHtml = this.sanitizer.bypassSecurityTrustHtml(
      this._utilities.articleObject?.content
    );
    this.articleHtmlForDowanload = this.data?.html;
    this.articleBannerLayoutObj =
      this._utilities?.articleObject?.bannerImageSetting;
  }

  onFocusEditableDiv(id: any) {
    this.currentDocumentId = id;
  }

  exportPdf() {
    this._loader.start();

    const DATA = this.pdfContent.nativeElement;

    html2canvas(DATA, { logging: true, useCORS: true, scale: 2 }).then(
      (canvas) => {
        const imgWidth = 208;
        const pageHeight = 295;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        const contentDataURL = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft > 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        pdf.save('article.pdf');
        this._loader.stop();
      }
    );
  }

  exportHtml() {
    this._loader.start();
    const blob = new Blob([this.articleHtmlForDowanload], {
      type: 'text/html',
    });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'article.html'; // Set the file name here
    link.click();

    this._loader.stop();
  }
}
