import {
  Component,
  Renderer2,
  ElementRef,
  ViewChild,
  ViewChildren,
  QueryList,
  ChangeDetectorRef,
} from '@angular/core';

// LIBRARY
import { MatDialog } from '@angular/material/dialog';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import html2canvas from 'html2canvas';
import 'emoji-picker-element';
import { NgxUiLoaderService } from 'ngx-ui-loader';

// SERVICES
import { ArticleService } from '../../../providers/article/article.service';
import { LoaderService } from 'src/app/providers/loader-service/loader.service';
import { GeneralService } from 'src/app/providers/general/general.service';
import { PostService } from 'src/app/providers/post/post.service';
import { StreamingService } from '../../../providers/streaming/streaming.service';

// COMPONENTS
import { AddArticleLinkComponent } from '../dialog/add-article-link/add-article-link.component';
import { AddSubTopicComponent } from '../dialog/add-sub-topic/add-sub-topic.component';
import { CoverImageSettingComponent } from '../dialog/cover-image-setting/cover-image-setting.component';
import { SetBackgroundImageComponent } from '../../visual-creatives/dialog/set-background-image/set-background-image.component';
import { ArticlePreviewComponent } from '../dialog/article-preview/article-preview.component';
import { ArticleSaveComponent } from '../dialog/article-save/article-save.component';
import { SelectMediaComponent } from 'src/app/shared/common/select-media/select-media.component';

//UTILS
import { CommonFunctionsService } from '../../../utils/common-functions/common-functions.service';
import { commonConstant } from '../../../utils/common-functions/common-constant';
import { ErrorModel } from '../../../utils/models/error';
import { ResponseModel } from '../../../utils/models/response';
import { MessageConstant } from '../../../utils/message-constant';
import { ConfirmPostScheduledComponent } from 'src/app/shared/dialog/confirm-post-scheduled/confirm-post-scheduled.component';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-article-editor',
  templateUrl: './article-editor.component.html',
  styleUrls: ['./article-editor.component.scss'],
})
export class ArticleEditorComponent {
  @ViewChild('editor', { static: false }) editor!: ElementRef;
  @ViewChild('bannerImage', { static: false }) bannerImage!: ElementRef;
  @ViewChildren('ctaBaner') ctaBanerElements!: QueryList<ElementRef>;
  dialogRef: any;
  articleTabs: any = 'outline';

  // State to track selected formatting options
  isBold = false;
  isItalic = false;
  isUnderline = false;

  scheduleDialogOpen: boolean = false;

  // embed link
  embedMetadata: any;
  currentDocumentId: any;

  // article image layout
  articleImageLayoutData: any;

  // SEO Score
  seoScoreData: any;

  //edit
  isEdit: boolean = false;

  // Humanization
  isContentAnalyzeData: any;

  contentAnalyzeCredit: number = 0;
  contentHumanizeCredit: number = 0;

  private savedSelection: Range | null = null;
  htmlData: any = {};
  selectedContentHtml = '';

  constructor(
    private _dialog: MatDialog,
    private elRef: ElementRef,
    private renderer: Renderer2,
    private _articleService: ArticleService,
    public _utilities: CommonFunctionsService,
    private _toastr: ToastrService,
    private _loader: LoaderService,
    public _generalService: GeneralService,
    public _post: PostService,
    private router: Router,
    private sanitizer: DomSanitizer,
    public _streamingService: StreamingService,
    private cdr: ChangeDetectorRef,
    public _ngxLoader: NgxUiLoaderService
  ) {
    //credit
    this.contentAnalyzeCredit =
      this._utilities?.userData?.plan?.contentAnalyzeCredit;
    this.contentHumanizeCredit =
      this._utilities?.userData?.plan?.contentHumanizeCredit;
  }

  ngOnInit(): void {
    if (!this._utilities.articleObject) {
      this.router.navigate(['article']);
      return;
    }

    if (!this._utilities.articleObject?._id) {
      this.generateArticle();
    } else {
      setTimeout(() => {
        this.editArticleAction();
      }, 500);
    }
  }

  ngAfterViewInit() {
    if (this._utilities.articleObject && !this._utilities.articleObject?._id) {
      this.generateBannerImage();
    }

    document.addEventListener(
      'selectionchange',
      this.onSelectionChange.bind(this)
    );
    this.editor.nativeElement.addEventListener(
      'input',
      this.onContentChange.bind(this)
    );
  }

  // Triggered when content changes
  onContentChange(event: Event): void {
    const updatedContent = (event.target as HTMLElement).innerHTML;
    // this.addCustomClasses();
    this.parseHtmlToStructuredArray();
  }

  // Triggered when content is selected
  onSelectionChange(): void {
    const selection = window.getSelection();
    if (selection && this.isSelectionInsideEditor(selection)) {
      const range = selection.getRangeAt(0);

      const fragment = range.cloneContents();
      const tempDiv = document.createElement('div');
      tempDiv.appendChild(fragment);

      const selectedHtml = tempDiv.innerHTML;
      this.selectedContentHtml = '';
      if (selectedHtml != '') {
        const parentElements = this.getParentTagsInRange(range);
        parentElements.forEach((el: any) => {
          this.selectedContentHtml += el.outerHTML;
        });
      }
    }
  }
  // Helper to get all parent tags within the selection range
  private getParentTagsInRange(range: Range): Element[] {
    const commonAncestor = range.commonAncestorContainer;
    const parentElements: Element[] = [];

    // Helper to traverse and collect all parent elements
    const collectParentElements = (node: Node | null) => {
      while (node && node !== this.editor.nativeElement) {
        if (node.nodeType === 1) {
          parentElements.push(node as Element);
        }
        node = node.parentNode;
      }
    };

    // Traverse the start container
    collectParentElements(range.startContainer);

    // Traverse the end container if it's different
    if (range.startContainer !== range.endContainer) {
      collectParentElements(range.endContainer);
    }

    // Deduplicate and return unique elements
    return Array.from(new Set(parentElements));
  }
  // Helper to check if selection is inside the editor
  private isSelectionInsideEditor(selection: Selection): boolean {
    let node = selection.anchorNode;
    while (node) {
      if (node === this.editor.nativeElement) return true;
      node = node.parentNode;
    }
    return false;
  }

  editArticleAction() {
    this.editor.nativeElement.innerHTML = this._utilities.articleObject.content;
    this.addCustomClasses();
    this.parseHtmlToStructuredArray();
  }

  //================== Start Generate Article =========================

  generateArticle() {
    let obj = {
      topic: this._utilities.articleObject?.topic,
      goal: this._utilities.articleObject?.goal,
      headline: this._utilities.articleObject?.headline,
      keywords: this._utilities.articleObject?.keywords,
      headingData: this._utilities.articleObject?.headingData,
      youtubeVideos: this._utilities.articleObject?.youtubeVideos,
      authorityLinks: this._utilities.articleObject?.authorityLinks,
      isFAQ: this._utilities.articleObject?.isFAQ,
      isConclusion: this._utilities.articleObject?.isConclusion,
      isCTA: this._utilities.articleObject?.isCTA,
      language: this._utilities.articleObject?.language,
      length: this._utilities.articleObject?.length,
      factualData: this._utilities.articleObject?.factualData,
      imageCount: this._utilities.articleObject?.imageCount,
      imageSource: this._utilities.articleObject?.imageSource,
      imageOrientation: this._utilities.articleObject?.imageOrientation,
      isAltTag: this._utilities.articleObject?.isAltTag,
      bannerImageSetting: this._utilities.articleObject?.bannerImageSetting,
    };

    this._loader.start();
    this._articleService.generateArticle(obj).subscribe(
      (response: ResponseModel) => {
        this._loader.stop();

        if (response.statusCode == 200) {
          let creditDeducated = this._utilities?.userData?.plan?.articleCredit;
          this._utilities.manageCredit(false, creditDeducated);
          this._utilities.articleObject = response?.data;
          if (!this._utilities.articleObject.content) {
            this._utilities.articleObject.content = '';
          }
          this.streamArticle();
        } else {
          this._toastr.error(MessageConstant.unknownError, '');
        }
      },
      (err: ErrorModel) => {
        this._loader.stop();
        if (err.error) {
          const error: ResponseModel = err.error;
          this._toastr.error(error.message, '');
        } else {
          this._toastr.error(MessageConstant.unknownError, '');
        }
      }
    );
  }

  streamArticle() {
    let obj = {
      articleId: this._utilities.articleObject?._id,
    };
    this._utilities.articleObject.content = '';
    this._streamingService.streamArticle(obj).subscribe({
      next: (data: string) => {
        let content = data;
        let writeTag = `<div class="ide-writing-tag"><div class="ide-text">Writing</div></div>`;
        this._utilities.articleObject.content =
          this._utilities.articleObject.content?.replace(writeTag, '');

        if (content == '[DONE]') {
          this.streamCompleted();
        } else {
          content = content + writeTag;
          this._utilities.articleObject.content += content;
        }

        this.cdr.detectChanges();
        this.scrollToBottom();
      },
      error: (error) => {
        this.streamCompleted();
        // console.error('Error in streaming:', error);
      },
      complete: () => {
        console.log('Streaming completed.');
        this.streamCompleted();
      },
    });
  }

  removeTitleAndMetaTags(htmlString: any) {
    let titleTagContent = '';
    let metaTagContent = '';

    var parser = new DOMParser();
    var doc = parser.parseFromString(htmlString, 'text/html');

    // Remove <title> tag
    var titleTag = doc.querySelector('title');
    titleTagContent = titleTag?.outerHTML || '';
    if (titleTag) {
      titleTag.remove();
    }

    // Remove all <meta> tags
    var metaTags = doc.querySelectorAll('meta');

    metaTags.forEach((tag) => {
      metaTagContent += tag.outerHTML || '';
      tag.remove();
    });

    return {
      content: doc.documentElement.outerHTML,
      titleTagContent: titleTagContent,
      metaTagContent: metaTagContent,
    };
  }

  streamCompleted() {
    let writeTag = `<div class="ide-writing-tag"><div class="ide-text">Writing</div></div>`;
    this._utilities.articleObject.content =
      this._utilities.articleObject.content?.replace(writeTag, '');
    this.editor.nativeElement.innerHTML = this._utilities.articleObject.content;
    this.addCustomClasses();

    let contentData = this.removeTitleAndMetaTags(
      this._utilities.articleObject.content
    );

    const title = contentData.titleTagContent;

    const metaDescription = contentData.metaTagContent;

    this._utilities.articleObject.content = contentData.content;

    let param: any = {
      content: this.editor?.nativeElement?.innerHTML,
    };

    if (title) {
      param = {
        ...param,
        titleTag: title,
      };
    }
    if (metaDescription) {
      param = {
        ...param,
        metaTag: metaDescription,
      };
    }

    this.scrollToBottom();

    this.updateArticle(param, true, true);

    setTimeout(() => {
      this.parseHtmlToStructuredArray();
    }, 500);
  }

  scrollToBottom() {
    const editorElement = document.getElementById('tempId') as any;

    if (editorElement) {
      editorElement.scrollTop = editorElement.scrollHeight;
    }
  }

  //================== End Generate Article ======================

  //================== Start Banner Image ==================

  generateBannerImage() {
    let obj = {
      topic: this._utilities.articleObject?.topic,
      keywords: this._utilities.articleObject?.keywords,
      goal: this._utilities.articleObject?.goal,
      headline: this._utilities.articleObject?.headline,
    };
    this._ngxLoader.startLoader('COVER_IMAGE');
    this._articleService.generateBannerImage(obj).subscribe(
      async (response: ResponseModel) => {
        this._ngxLoader.stopLoader('COVER_IMAGE');

        if (response.statusCode == 200) {
          let coverImage = response?.data;

          let currentProfile = this._utilities?.linkedinPageList.find(
            (x: any) => x._id == this._utilities.userData?.currentPageId
          );
          let profileAvatar = currentProfile?.image
            ? currentProfile?.image
            : 'assets/images/avatar/avatar.png';

          let bannerImageSetting = {
            layout: 'left',
            coverImage: coverImage,
            headline: this._utilities.articleObject?.headline,
            profileAvatar: profileAvatar,
            bannerColor: '',
            isBrandkit: false,
          };

          if (this._utilities.articleObject?.bannerImageSetting) {
            this._utilities.articleObject.bannerImageSetting = {
              ...this._utilities.articleObject?.bannerImageSetting,
              coverImage: coverImage,
            };
          } else {
            this._utilities.articleObject.bannerImageSetting =
              bannerImageSetting;
          }

          let bannerImage = await this.saveBannerImage();

          this.updateArticle(
            {
              bannerImageSetting:
                this._utilities.articleObject.bannerImageSetting,
              bannerImage: bannerImage,
            },
            false,
            false
          );
        } else {
          this._toastr.error(MessageConstant.unknownError, '');
        }
      },
      (err: ErrorModel) => {
        this._ngxLoader.stopLoader('COVER_IMAGE');
        if (err.error) {
          const error: ResponseModel = err.error;
          this._toastr.error(error.message, '');
        } else {
          this._toastr.error(MessageConstant.unknownError, '');
        }
      }
    );
  }

  saveBannerImage() {
    return new Promise(async (resolve, reject) => {
      setTimeout(async () => {
        const banner = this.bannerImage?.nativeElement;
        if (!banner) {
          resolve('');
          return;
        }
        let imageBase64 = await html2canvas(banner, {
          useCORS: true, // Enables cross-origin image loading
          allowTaint: false, // Ensures no tainted canvases
        }).then((canvas) => canvas.toDataURL('image/png'));
        let mediaUrl = await this.uploadSingleImage(imageBase64);
        resolve(mediaUrl);
      }, 5000);
    });
  }

  async uploadSingleImage(image: any) {
    return new Promise(async (resolve, reject) => {
      const imageBlob = this.base64ToFile(image, 'image/jpeg');
      const formData = new FormData();
      formData.append('file', imageBlob, 'image.jpg');
      this._generalService.uploadFile(formData).subscribe(
        (response: ResponseModel) => {
          if (response?.data[0]?.url) {
            resolve(response?.data[0]?.url);
            return;
          }

          resolve('');
        },
        (err: ErrorModel) => {
          this._loader.stop();
          if (err.error) {
            const error: ResponseModel = err.error;
            this._toastr.error(error.message, '');
          } else {
            this._toastr.error(MessageConstant.unknownError, '');
          }
          resolve('');
        }
      );
    });
  }

  areObjectsEqual(obj1: any, obj2: any) {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    // Check if both objects have the same number of keys
    if (keys1.length !== keys2.length) {
      return false;
    }

    // Check if all keys and values are the same
    for (let key of keys1) {
      if (obj1[key] !== obj2[key]) {
        return false;
      }
    }

    return true;
  }

  coverImagesettingDailog() {
    this.dialogRef = this._dialog.open(CoverImageSettingComponent, {
      width: '1030px',
      disableClose: false,
      panelClass: '',
      data: this._utilities.articleObject?.bannerImageSetting,
    });
    this.dialogRef.afterClosed().subscribe(async (result: any) => {
      if (result) {
        let isObjEqual = this.areObjectsEqual(
          this._utilities.articleObject?.bannerImageSetting,
          result
        );
        this._utilities.articleObject.bannerImageSetting = result;

        if (!isObjEqual) {
          let bannerImage = await this.saveBannerImage();
          let param = {
            bannerImageSetting: result,
            bannerImage: bannerImage,
          };
          this.updateArticle(param);
        }
      }
    });
  }

  //================== End Banner Image ==================

  //================== Start Update Article ==================

  async saveArticle() {
    let param = {
      content: this.editor?.nativeElement?.innerHTML,
    };
    await this.updateArticle(param, true, true);
  }

  async updateArticle(param: any, isUpdateObject = true, isShowLoader = false) {
    return new Promise(async (resolve, reject) => {
      let obj = {
        articleId: this._utilities.articleObject?._id,
        ...param,
      };

      if (isShowLoader) {
        this._loader.start();
      }

      this._articleService.updateArticle(obj).subscribe(
        (response: ResponseModel) => {
          if (isShowLoader) {
            this._loader.stop();
            this._toastr.success('Article saved successfully.');
          }
          if (isUpdateObject) {
            this._utilities.articleObject = response.data;
          }

          resolve(true);
        },
        (err: ErrorModel) => {
          if (isShowLoader) {
            this._loader.stop();
          }
          if (err.error) {
            const error: ResponseModel = err.error;
            this._toastr.error(error.message, '');
          } else {
            this._toastr.error(MessageConstant.unknownError, '');
          }
          resolve(false);
        }
      );
    });
  }
  //================== End Update Article ==================

  //================== Start Outline ==================
  parseHtmlToStructuredArray() {
    let htmlString = this.editor.nativeElement.innerHTML;

    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');

    const structure: any = {
      topContent: '',
      headingArray: [],
    };

    let currentH2: any = null;
    let currentH3: any = null;

    doc.body.childNodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        structure.topContent += node.textContent?.trim();
      }

      if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as HTMLElement;
        const outerHTML = element.outerHTML;
        if (element.tagName === 'H1') {
          structure.topContent += outerHTML;
        } else if (element.tagName === 'H2') {
          if (currentH2) {
            if (currentH3) {
              currentH2.subheadingArray.push(currentH3);
              currentH3 = null;
            }
            structure.headingArray.push(currentH2);
          }
          currentH2 = { title: outerHTML, content: '', subheadingArray: [] };
        } else if (element.tagName === 'H3' && currentH2) {
          if (currentH3) {
            currentH2.subheadingArray.push(currentH3);
          }
          currentH3 = { title: outerHTML, content: '' };
        } else if (
          element.tagName !== 'H1' &&
          element.tagName !== 'H2' &&
          element.tagName !== 'H3'
        ) {
          if (currentH3) {
            currentH3.content += outerHTML;
          } else if (currentH2) {
            currentH2.content += outerHTML;
          }
        }
      }
    });

    if (currentH3 && currentH2) {
      currentH2.subheadingArray.push(currentH3);
    }
    if (currentH2) {
      structure.headingArray.push(currentH2);
    }
    this.htmlData = structure;
  }

  removeHtmlTags(htmlString: any) {
    return htmlString?.replace(/<\/?[^>]+(>|$)/g, '');
  }

  // Drag and drop slides

  drop(event: any, index: number) {
    let draggedItem = event.item.data;

    if (event.previousIndex !== undefined && event.currentIndex !== undefined) {
      if (draggedItem?.title !== undefined) {
        let h2List = this.htmlData?.headingArray;

        let h1Index = h2List.findIndex((item: any) => item === draggedItem);
        if (h1Index > -1 && event.currentIndex < h2List.length) {
          let [removedItem] = h2List.splice(h1Index, 1);
          h2List.splice(event.currentIndex, 0, removedItem);
          this.updateEditorContent();
        }
      }
    } else {
      console.error('Event indices are undefined');
    }
  }

  drop1(event: any, index: number) {
    let draggedItem = event.item.data;

    if (event.previousIndex !== undefined && event.currentIndex !== undefined) {
      let h3List = this.htmlData?.headingArray[index]?.subheadingArray;
      let previousIndex = event.previousIndex;
      let currentIndex = event.currentIndex;
      if (h3List && previousIndex < h3List.length) {
        let [removedH3] = h3List.splice(previousIndex, 1);
        h3List.splice(currentIndex, 0, removedH3);
        this.updateEditorContent();
      }
    } else {
      console.error('Event indices are undefined');
    }
  }

  updateEditorContent() {
    let content = '';
    if (this.htmlData?.topContent) {
      content = this.htmlData?.topContent;
    }
    for (let i = 0; i < this.htmlData?.headingArray?.length; i++) {
      const h2 = this.htmlData?.headingArray[i];
      if (h2?.title) {
        content += h2?.title;
      }
      if (h2?.content) {
        content += h2?.content;
      }

      for (let j = 0; j < h2?.subheadingArray?.length; j++) {
        const h3 = h2?.subheadingArray[j];
        if (h3?.title) {
          content += h3?.title;
        }
        if (h3?.content) {
          content += h3?.content;
        }
      }
    }
    this.editor.nativeElement.innerHTML = content;
    this.cdr.detectChanges();
    this.addCustomClasses();
  }

  // Add Topic

  openAddTopicDialog() {
    this.dialogRef = this._dialog.open(AddSubTopicComponent, {
      width: '800px',
      disableClose: false,
      panelClass: '',
      data: {},
    });

    this.dialogRef.afterClosed().subscribe((result: any) => {
      if (result?.topic) {
        this.addTopic(result?.topic);
      }
    });
  }

  addTopic(h2: any, index = -1) {
    let obj = {
      topic: this._utilities.articleObject?.topic,
      headline: this._utilities.articleObject?.headline,
      keywords: this._utilities.articleObject?.keywords,
      goal: this._utilities.articleObject?.goal,
      h2: h2,
    };
    this._loader.start();
    this._articleService.generateTopic(obj).subscribe(
      (response: ResponseModel) => {
        this._loader.stop();
        if (response.statusCode == 200) {
          let contentData = response?.data;

          if (index == -1) {
            this.editor.nativeElement.innerHTML =
              this.editor.nativeElement.innerHTML + contentData;
            this.addCustomClasses();
            this.parseHtmlToStructuredArray();
          } else {
            let h2Obj = this.parseHtmltoH2Object(contentData);
            console.log('h2Obj = ', h2Obj);
            if (h2Obj?.title) {
              this.htmlData.headingArray[index] = h2Obj;
            }
            this.updateEditorContent();
            this.parseHtmlToStructuredArray();
          }
        } else {
          this._toastr.error(MessageConstant.unknownError, '');
        }
      },
      (err: ErrorModel) => {
        this._loader.stop();
        if (err.error) {
          const error: ResponseModel = err.error;
          this._toastr.error(error.message, '');
        } else {
          this._toastr.error(MessageConstant.unknownError, '');
        }
      }
    );
  }

  onRegenerateTopicAction(index: any, item: any) {
    this.addTopic(item?.title, index);
  }

  parseHtmltoH2Object(htmlString: any) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');

    let currentH2: any = '';
    let currentH2Content: any = '';
    let currentH3: any = null;
    let subheadingArray: any = [];

    doc.body.childNodes.forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as HTMLElement;
        const outerHTML = element.outerHTML;
        if (element.tagName === 'H2') {
          currentH2 = outerHTML;
        } else if (element.tagName === 'H3') {
          if (currentH3) {
            subheadingArray.push(currentH3);
          }
          currentH3 = { title: outerHTML, content: '' };
        } else if (
          element.tagName !== 'H1' &&
          element.tagName !== 'H2' &&
          element.tagName !== 'H3'
        ) {
          if (currentH3) {
            currentH3.content += outerHTML;
          }
        }
      }
    });

    if (currentH3) {
      subheadingArray.push(currentH3);
    }

    return {
      title: currentH2,
      content: currentH2Content,
      subheadingArray: subheadingArray,
    };
  }

  onDeleteTopicAction(i: any) {
    this.htmlData?.headingArray?.splice(i, 1);
    this.updateEditorContent();
    this.parseHtmlToStructuredArray();
  }

  // Add Sub Topic
  openAddSubTopicDialog(index: any, item: any) {
    this.dialogRef = this._dialog.open(AddSubTopicComponent, {
      width: '800px',
      disableClose: false,
      panelClass: '',
      data: {},
    });

    this.dialogRef.afterClosed().subscribe((result: any) => {
      if (result?.topic) {
        this.addSubTopic(index, item, result?.topic);
      }
    });
  }

  addSubTopic(index: any, item: any, h3: any) {
    let obj = {
      topic: this._utilities.articleObject?.topic,
      headline: this._utilities.articleObject?.headline,
      keywords: this._utilities.articleObject?.keywords,
      goal: this._utilities.articleObject?.goal,
      h2: item?.title,
      h3: h3,
    };
    this._loader.start();
    this._articleService.generateSubTopic(obj).subscribe(
      (response: ResponseModel) => {
        this._loader.stop();
        if (response.statusCode == 200) {
          let h3Obj = this.parseHtmltoH3Object(response?.data);
          if (h3Obj?.title) {
            this.htmlData.headingArray[index].subheadingArray.push(h3Obj);
          }
          this.updateEditorContent();
          this.parseHtmlToStructuredArray();
        } else {
          this._toastr.error(MessageConstant.unknownError, '');
        }
      },
      (err: ErrorModel) => {
        this._loader.stop();
        if (err.error) {
          const error: ResponseModel = err.error;
          this._toastr.error(error.message, '');
        } else {
          this._toastr.error(MessageConstant.unknownError, '');
        }
      }
    );
  }

  parseHtmltoH3Object(htmlString: any) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');

    let currentH3: any = '';
    let content = '';

    doc.body.childNodes.forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as HTMLElement;
        const outerHTML = element.outerHTML;
        if (element.tagName === 'H3') {
          currentH3 = outerHTML;
        } else if (element.tagName !== 'H3') {
          content += outerHTML;
        }
      }
    });
    return { title: currentH3, content: content };
  }

  onDeleteSubTopicAction(i: any, j: any) {
    this.htmlData?.headingArray[i]?.subheadingArray?.splice(j, 1);
    this.updateEditorContent();
    this.parseHtmlToStructuredArray();
  }

  //================== End Outline ==================
  creditMessage(credit: any) {
    return `This will cost ${credit} credits`;
  }

  onFocusEditableDiv(id: any) {
    this.currentDocumentId = id;
  }

  // Add Angular scoping attributes (_ngcontent) if needed
  addNgContentToNewElements(): void {
    const editor = this.elRef.nativeElement.querySelector('#editor');
    const newElements = editor.querySelectorAll('*'); // Select all elements
    const ngContentAttr = editor
      .getAttributeNames()
      .find((attr: any) => attr.startsWith('_ngcontent'));

    newElements.forEach((el: any) => {
      if (ngContentAttr && !el.hasAttribute(ngContentAttr)) {
        this.renderer.setAttribute(el, ngContentAttr, '');
      }
    });
  }

  // Update toolbar state to reflect the current selection's formatting
  updateToolbarState(): void {
    this.isBold = document.queryCommandState('bold');
    this.isItalic = document.queryCommandState('italic');
    this.isUnderline = document.queryCommandState('underline');
    // Add more queryCommandState calls for other options like strikeThrough, justify, etc.
  }

  // Choice background image

  choiceBackgroundMedia() {
    this.dialogRef = this._dialog.open(SetBackgroundImageComponent, {
      width: '960px',
      disableClose: false,
      panelClass: 'custom-create-camp-modal',
      data: { isGenrated: false },
    });

    this.dialogRef.afterClosed().subscribe((result: any) => {
      if (result?.imageUrl) {
        const imageHtml = `
                <div class="upload-images-main">
                  <div class="upload-images-action" onclick="this.parentElement.remove()">
                    <img
                      class="pointer m-2"
                      width="24"
                      src="assets/images/trash-white.svg"
                      alt="trash-white"
                      matTooltip="Delete Image"
                      matTooltipPosition="above"                      
                    />
                  </div>
                  <img class="img-fluid main-image" src=${result?.imageUrl} alt="demoimg" />
                </div>`;
        // this.insertHtmlAfterElement(this.currentDocumentId, imageHtml);
        let element = document.getElementById('custIdeContent');
        if (element) {
          // Insert the HTML inside the element
          element.insertAdjacentHTML('beforeend', imageHtml);
        }
      }
    });
  }

  // Global function to insert HTML after the end of content

  insertHtmlAfterElement(elementId: string, html: string): void {
    const targetElement = document.getElementById(elementId);
    if (!targetElement) {
      console.error(`Element with ID ${elementId} not found.`);
      return;
    }

    // Create a temporary element to hold the HTML string.
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    // Insert each child node from the temporary element after the target element.
    const nodes = Array.from(tempDiv.childNodes);
    nodes.forEach((node) => {
      targetElement.parentNode?.insertBefore(node, targetElement.nextSibling);
    });
  }

  // right side tabs

  changeTabs(tabName: any) {
    this.articleTabs = tabName;
  }

  getSEOScoreFeedback() {
    const currentContent = document.getElementById('custIdeContent')?.innerHTML;

    let obj = {
      topic: this._utilities.articleObject?.topic,
      headline: this._utilities.articleObject?.headline,
      keywords: this._utilities.articleObject?.keywords,
      content: currentContent,
    };
    this._loader.start();
    this._articleService.getSEOScoreFeedback(obj).subscribe(
      (response: ResponseModel) => {
        this._loader.stop();
        if (response.statusCode == 200) {
          this.seoScoreData = response?.data;
          this._utilities.manageCredit(false, this.contentAnalyzeCredit);
        } else {
          this._toastr.error(MessageConstant.unknownError, '');
        }
      },
      (err: ErrorModel) => {
        this._loader.stop();
        if (err.error) {
          const error: ResponseModel = err.error;
          this._toastr.error(error.message, '');
        } else {
          this._toastr.error(MessageConstant.unknownError, '');
        }
      }
    );
  }

  // Humanization Content

  contentAnalyze() {
    if (this.isContentAnalyzeData) {
      return;
    }
    const currentContent = document.getElementById('custIdeContent')?.innerHTML;
    let obj = {
      content: currentContent,
    };
    this._loader.start();
    this._generalService.contentAnalyze(obj).subscribe(
      (response: ResponseModel) => {
        this._loader.stop();
        if (response.statusCode == 200) {
          this.isContentAnalyzeData = response?.data;
          this._utilities.manageCredit(false, this.contentHumanizeCredit);
        } else {
          this._toastr.error(MessageConstant.unknownError, '');
        }
      },
      (err: ErrorModel) => {
        this._loader.stop();
        if (err.error) {
          const error: ResponseModel = err.error;
          this._toastr.error(error.message, '');
        } else {
          this._toastr.error(MessageConstant.unknownError, '');
        }
      }
    );
  }

  scheduleDialogOpenClose(status?: boolean) {
    if (status) {
      this.scheduleDialogOpen = true;
    } else {
      this.scheduleDialogOpen = false;
    }
  }

  async articleScheduled(scheduleData: any) {
    this._loader.start();
    let payload = {};

    await this.updateArticle({
      content: this.editor.nativeElement.innerHTML,
    });

    payload = {
      articleId: this._utilities.articleObject?._id,
      generatedType: commonConstant.POSTGENERATETYPE.ARTICLE,
      articleHeadline: this._utilities.articleObject?.headline,
      articleTitle: this._utilities.articleObject?.topic,
      status: commonConstant.POSTSTATUS.DRAFT,
      scheduleDateTime: new Date().getTime(),
    };

    if (scheduleData) {
      payload = {
        ...payload,
        scheduleDateTime: scheduleData?.timestamp,
        timeSlot: scheduleData?.timeSlot,
        timePeriod: scheduleData?.timePeriod,
        status: commonConstant.POSTSTATUS.SCHEDULED,
      };
    }

    this._post.savePost(payload).subscribe(
      (response: ResponseModel) => {
        if (response.statusCode == 200) {
          this.scheduleDialogOpen = false;
          this._toastr.success(response?.message);
          if (scheduleData) {
            let advancedScheduleCredit =
              this._utilities?.userData?.plan?.advancedScheduleCredit;
            this._utilities.manageCredit(false, advancedScheduleCredit);
          }

          if (scheduleData) {
            this.openConfirmPostScheduled();
          }

          this.router.navigate(['article']);
          this._loader.stop();
        } else {
          this._loader.stop();
          this._toastr.error(MessageConstant.unknownError, '');
        }
      },
      (err: ErrorModel) => {
        this._loader.stop();
        if (err.error) {
          const error: ResponseModel = err.error;
          this._toastr.error(error.message, '');
        } else {
          this._toastr.error(MessageConstant.unknownError, '');
        }
      }
    );
  }

  download() {
    this.dialogRef = this._dialog.open(ArticlePreviewComponent, {
      width: '940px',
      disableClose: false,
      panelClass: '',
      data: { html: this.editor?.nativeElement?.innerHTML },
    });
  }

  openConfirmPostScheduled() {
    this._dialog.open(ConfirmPostScheduledComponent, {
      width: '350px',
      panelClass: 'change-profile-modal',
      data: {},
    });
  }

  async ctaSave(element: HTMLElement): Promise<any> {
    let imageBase64 = await html2canvas(element, {
      useCORS: true,
    }).then((canvas) => canvas.toDataURL('image/png'));
    let mediaUrl = await this.uploadSingleImage(imageBase64);

    return mediaUrl;
  }

  replaceUploadImagesMainDiv = (html: string | undefined) => {
    if (
      html?.includes('upload-images-main') ||
      html?.includes('link-div') ||
      html?.includes('divider-wrapper')
    ) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;

      const uploadImagesDiv = tempDiv.querySelector('.upload-images-main');
      if (uploadImagesDiv) {
        const imgElement = uploadImagesDiv.querySelector('img.main-image');
        if (imgElement) {
          uploadImagesDiv.replaceWith(imgElement);
        }
      }

      // Handle .divider-wrapper replacement
      const dividerWrapper = tempDiv.querySelector('.divider-wrapper');
      if (dividerWrapper) {
        const hrElement = dividerWrapper.querySelector('hr.custom-divider');
        if (hrElement) {
          dividerWrapper.replaceWith(hrElement);
        }
      }

      // Handle .divider-wrapper replacement
      const linkDiv = tempDiv.querySelector('.link-div');
      if (linkDiv) {
        const aTag = linkDiv.querySelector('a.link');
        if (aTag) {
          linkDiv.replaceWith(aTag);
        }
      }

      return tempDiv.innerHTML; // Return modified HTML with the div replaced by the img tag
    }
    return html; // If no div found, return original HTML
  };

  base64ToFile(base64Data: string, contentType: string): Blob {
    const sliceSize = 512;
    const byteCharacters = atob(base64Data.split(',')[1]);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);

      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: contentType });
  }

  deleteHeading(index: any) {
    // this.articleContentData.splice(index, 1);
  }

  onBack() {
    this.dialogRef = this._dialog.open(ArticleSaveComponent, {
      width: '440px',
      data: {},
    });
    this.dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        if (result?.isAction == 'no') {
          this.router.navigate(['article']);
        }
        if (result?.isAction == 'yes') {
          this.updateArticle(true);
        }
      }
    });
  }

  // ================= Start Editor Toolbar ====================

  regenerate() {
    this._toastr.info('Coming soon...');
    console.log('regenerate = ', this.selectedContentHtml);
    return;
    let obj = {
      topic: this._utilities.articleObject?.topic,
      goal: this._utilities.articleObject?.goal,
      headline: this._utilities.articleObject?.headline,
      keywords: this._utilities.articleObject?.keywords,
      headingData: this._utilities.articleObject?.headingData,
      youtubeVideos: this._utilities.articleObject?.youtubeVideos,
      authorityLinks: this._utilities.articleObject?.authorityLinks,
      isFAQ: this._utilities.articleObject?.isFAQ,
      isConclusion: this._utilities.articleObject?.isConclusion,
      isCTA: this._utilities.articleObject?.isCTA,
      language: this._utilities.articleObject?.language,
      length: this._utilities.articleObject?.length,
      factualData: this._utilities.articleObject?.factualData,
      imageCount: this._utilities.articleObject?.imageCount,
      imageSource: this._utilities.articleObject?.imageSource,
      imageOrientation: this._utilities.articleObject?.imageOrientation,
      isAltTag: this._utilities.articleObject?.isAltTag,
      bannerImageSetting: this._utilities.articleObject?.bannerImageSetting,
    };
    this._loader.start();
    this._articleService.generateArticle(obj).subscribe(
      (response: ResponseModel) => {
        this._loader.stop();

        if (response.statusCode == 200) {
          this._utilities.articleObject.content = response?.data?.content;
          this.addCustomClasses();
        } else {
          this._toastr.error(MessageConstant.unknownError, '');
        }
      },
      (err: ErrorModel) => {
        this._loader.stop();
        if (err.error) {
          const error: ResponseModel = err.error;
          this._toastr.error(error.message, '');
        } else {
          this._toastr.error(MessageConstant.unknownError, '');
        }
      }
    );
  }

  executeEditorEmojiAction() {
    let emojiPicker = document.querySelector('emoji-picker') as HTMLElement;

    if (!emojiPicker) {
      emojiPicker = document.createElement('emoji-picker');
      document.body.appendChild(emojiPicker);
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (emojiPicker && !emojiPicker.contains(event.target as Node)) {
        document.body.removeChild(emojiPicker);
        document.removeEventListener('click', handleClickOutside);
      }
    };

    emojiPicker.addEventListener('emoji-click', (event: any) => {
      const emoji = event.detail.unicode;
      this.insertEmoji(emoji);
      if (emojiPicker) {
        document.body.removeChild(emojiPicker); // Remove picker after emoji selection
      }
    });

    // Position emoji picker near the button
    const button = document.getElementById(
      'emoji-picker-button'
    ) as HTMLElement;
    if (button) {
      const rect = button.getBoundingClientRect();
      emojiPicker.style.position = 'absolute';
      emojiPicker.style.top = `${rect.bottom + window.scrollY}px`;
      emojiPicker.style.left = `${rect.left + window.scrollX}px`;
      emojiPicker.style.zIndex = '10000';
      setTimeout(() => {
        document.addEventListener('click', handleClickOutside);
      }, 100);
    } else {
      console.error('Emoji picker button not found');
    }
  }

  insertEmoji(emoji: string) {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const container = range.commonAncestorContainer;
    const contentDiv = document.getElementById('custIdeContent');

    if (contentDiv && contentDiv.contains(container)) {
      range.deleteContents();
      const textNode = document.createTextNode(emoji);
      range.insertNode(textNode);
      range.setStartAfter(textNode);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }

  // executeEditorColorAction() {
  //   // Assume you have a reference to the color picker button in your header
  //   const colorPickerButton = document.getElementById(
  //     'color-picker-button'
  //   ) as HTMLElement; // Replace with your actual button ID
  //   const colorInput = document.getElementById(
  //     'color-input'
  //   ) as HTMLInputElement;

  //   if (colorPickerButton && colorInput) {
  //     // Set the color input position below the color picker button
  //     const buttonRect = colorPickerButton.getBoundingClientRect();
  //     colorInput.style.display = 'block'; // Make the input visible when clicked
  //     colorInput.style.position = 'absolute';
  //     colorInput.style.top = `${buttonRect.bottom + window.scrollY}px`; // Position below the button
  //     colorInput.style.left = `${buttonRect.left + window.scrollX}px`; // Align to the button's left
  //     colorInput.click(); // Trigger the color input click to open the color picker
  //   }
  // }

  // toggleColorPicker(): void {
  //   const colorPicker: HTMLElement | null =
  //     document.getElementById('color-picker');
  //   if (colorPicker) {
  //     colorPicker.click();
  //   }
  // }
  // onColorChange(event: Event): void {
  //   const input = event.target as HTMLInputElement;
  //   const color = input.value;

  //   this.execCommand('foreColor', color);
  // }

  execCommand(command: string, value: string = ''): void {
    document.execCommand(command, false, value);
    // this.addNgContentToNewElements();
  }

  // applyHeading(heading: string) {
  //   // Get the current content of the editor
  //   let editorContent = this.editor.nativeElement.innerHTML;

  //   // Create a new heading element with the entire content inside it
  //   const newHeading = document.createElement(heading);

  //   this.editor.nativeElement.appendChild(newHeading); // Append the new heading with all content

  //   // Set focus back to the editor
  //   newHeading.focus();
  // }

  applyFormatBlock(tag: string) {
    document.execCommand('formatBlock', false, tag);
  }

  insertDividerWithDelete(): void {
    const dividerHtml = `
      <div class="divider-wrapper">
        <hr class="custom-divider" />
        <img class="delete-btn" onclick="this.parentElement.remove()" src="assets/images/trash-button.svg" alt="trash-button" />
      </div>`;

    document.execCommand('insertHTML', false, dividerHtml);
    // this.addNgContentToNewElements(); // Ensure Angular handles the newly added content correctly.
  }

  addArticlelinkDailog(type: any) {
    this.dialogRef = this._dialog.open(AddArticleLinkComponent, {
      width: '440px',
      disableClose: false,
      panelClass: '',
      data: { type: type },
    });

    this.saveSelection();
    this.dialogRef.afterClosed().subscribe((result: any) => {
      if (type === 'link' && result?.data && result?.data?.linkText != '') {
        const linkHtml = `<a href="${result?.data?.linkUrl}">${result?.data?.linkText}</a>`;
        this.restoreSelection();
        this.editor.nativeElement.focus();
        document.execCommand('insertHTML', false, linkHtml);
      } else if (
        type === 'embed' &&
        result?.data &&
        result?.data?.title != '' &&
        result?.data?.description != ''
      ) {
        const embedHtml = `<div class="embed-details-div">
                              <div class="embed-action" onclick="this.parentElement.remove()">
                                <img
                                  class="pointer m-2"
                                  width="24"
                                  src="assets/images/trash-white.svg"
                                  alt="trash-white"
                                />
                              </div>
                              <div class="embed-images">
                                <img
                                  class="img-fluid"
                                  src="${result?.data?.imageUrl || ''}"
                                  alt="demoimg"
                                />
                              </div>
                              <div class="embed-data">
                                <h1 class="embed-title">${
                                  result?.data?.title || ''
                                }</h1>
                                <p class="embed-description">${
                                  result?.data?.description || ''
                                }</p>                                
                              </div>
                           </div>`;
        this.restoreSelection();
        this.editor.nativeElement.focus();
        document.execCommand('insertHTML', false, embedHtml);
        // this.insertHtmlAfterElement(this.currentDocumentId, embedHtml);
        // let element = document.getElementById(this.currentDocumentId);
        // if (element) {
        //   // Insert the HTML inside the element
        //   element.insertAdjacentHTML('beforeend', embedHtml);
        // }
      }
    });
  }

  insertCodeBlock(): void {
    const codeBlock = `
      <div class="code-block-wrapper">
        <pre contenteditable="true"><code>Your code here...</code></pre>
      </div>`;
    // Get the current selection
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);

      // Create a DocumentFragment to insert clean HTML
      const fragment = document
        .createRange()
        .createContextualFragment(codeBlock);

      // Insert the fragment at the cursor position
      range.deleteContents(); // Remove current selection content if any
      range.insertNode(fragment);
    }

    // Now query for the newly inserted <pre> element
    const preElement = document.querySelector('pre[contenteditable="true"]');

    // Add a paste event listener to handle pasted content
    if (preElement) {
      preElement.addEventListener('paste', (event: Event) => {
        // Ensure it's a ClipboardEvent before proceeding
        if (event instanceof ClipboardEvent) {
          event.preventDefault();

          // Get the pasted text from the clipboard
          const text = event.clipboardData?.getData('text');

          if (text) {
            // Create a new code element, and append the pasted text wrapped in a <code> tag
            const codeElement = document.createElement('code');
            codeElement.textContent = text;

            //preElement.innerHTML = ''; // Clear existing content
            preElement.appendChild(codeElement); // Insert the new <code> tag with the text
          }
        }
      });

      // Add a keydown listener to prevent a new <pre> on Enter
      preElement.addEventListener('keydown', (event: KeyboardEvent | any) => {
        if (event.key === 'Enter' && !event.shiftKey) {
          // Prevent the default behavior of <pre> for Enter
          event.preventDefault();

          // Insert a line break (<br>) instead
          const br = document.createElement('br');
          const range = window.getSelection()?.getRangeAt(0);
          if (range) {
            // Create the <br> element
            range.insertNode(br);

            // Move the cursor to after the new <br> tag
            range.setStartAfter(br);
            range.setEndAfter(br);
            window.getSelection()?.removeAllRanges();
            window.getSelection()?.addRange(range);
          }
        }
      });
    }
  }

  choiceMediaOptions() {
    this.saveSelection();
    this.dialogRef = this._dialog.open(SelectMediaComponent, {
      width: '960px',
      data: {},
    });
    this.dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        // const imageHtml = `
        // <div class="upload-images-main minimize-image">
        //   <div class="upload-images-action" onclick="this.parentElement.remove()">
        //     <img
        //       class="pointer m-2"
        //       width="24"
        //       src="assets/images/trash-white.svg"
        //       alt="trash-white"
        //       matTooltip="Delete Image"
        //       matTooltipPosition="above"
        //     />
        //   </div>
        //   <img class="image-update" src=${result?.url} alt="demoimg" />
        // </div>`;
        // this.insertHtmlAfterElement(this.currentDocumentId, imageHtml);
        // let element = document.getElementById('custIdeContent');
        // if (element) {
        //   // Insert the HTML inside the element
        //   element.insertAdjacentHTML('beforeend', imageHtml);
        // }
        const imageHtml = `<img class="img-update" src=${result?.url} />`;
        this.restoreSelection();
        this.editor.nativeElement.focus();
        document.execCommand('insertHTML', false, imageHtml);
      }
    });
  }

  // ================= End Editor Toolbar ====================

  addCustomClasses() {
    let content = this.editor.nativeElement.innerHTML;

    // content = content?.replace(/<h1>/g, '<h1 class="header-1">');
    // content = content?.replace(/<h2>/g, '<h2 class="header-2">');
    // content = content.replace(/<h3>/g, '<h3 class="header-3">');
    // content = content.replace(/<p>/g, '<p class="desq">');
    // content = content.replace(/<img/g, '<img class="img-update"');

    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');

    const imgElements = doc.querySelectorAll('img');
    imgElements.forEach((img) => {
      img.classList.add('img-update');
    });

    const pElements = doc.querySelectorAll('p');
    pElements.forEach((ele) => {
      ele.classList.add('desq');
    });

    const h1Elements = doc.querySelectorAll('h1');
    h1Elements.forEach((ele) => {
      ele.classList.add('header-1');
    });

    const h2Elements = doc.querySelectorAll('h2');
    h2Elements.forEach((ele) => {
      ele.classList.add('header-2');
    });

    const h3Elements = doc.querySelectorAll('h3');
    h3Elements.forEach((ele) => {
      ele.classList.add('header-3');
    });

    content = doc.body.innerHTML;

    this.editor.nativeElement.innerHTML = content;
    this.cdr.detectChanges();
  }

  getEditorContent() {
    return this.sanitizer.bypassSecurityTrustHtml(
      this._utilities.articleObject?.content
    );
  }

  saveSelection() {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      this.savedSelection = selection.getRangeAt(0);
    }
  }

  restoreSelection() {
    const selection = window.getSelection();
    if (this.savedSelection && selection) {
      selection.removeAllRanges();
      selection.addRange(this.savedSelection);
    }
  }
}
