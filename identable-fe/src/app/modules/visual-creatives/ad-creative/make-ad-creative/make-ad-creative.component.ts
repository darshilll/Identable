import {
  Component,
  ViewChild,
  ViewChildren,
  ChangeDetectorRef,
  ElementRef,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

// SERVICES
import { ContentDesignService } from '../../../../providers/visual-creatives/ad-creative/content-design/content-design.service';
import { AdCreativeTemplatesService } from '../../../../providers/visual-creatives/ad-creative/templates/ad-creative-templates.service';
import { DesignControlService } from '../../../../providers/visual-creatives/carousel/design-control/design-control.service';
import { BrandKitService } from '../../../../providers/brandkit/brand-kit.service';
import { LoaderService } from '../../../../providers/loader-service/loader.service';
import { AdCreativeService } from '../../../../providers/adCreative/ad-creative.service';
import { GenerateCommonPromptComponent } from 'src/app/shared/dialog/generate-common-prompt/generate-common-prompt.component';

// LIBRARY
import { ToastrService } from 'ngx-toastr';
import { fabric } from 'fabric';
import MediumEditor from 'medium-editor';
import 'emoji-picker-element';
import { MediumEditorDirective } from '../../editor-directive/medium-editor.directive'; // Import your directive

//UTILS
import { CommonFunctionsService } from '../../../../utils/common-functions/common-functions.service';
import { GlobalService } from '../../../../utils/common-functions/global.service';
import { designControl } from '../../../../utils/carousel-control/design-control';
import { ErrorModel } from '../../../../utils/models/error';
import { ResponseModel } from '../../../../utils/models/response';
import { MessageConstant } from '../../../../utils/message-constant';

@Component({
  selector: 'app-make-ad-creative',
  templateUrl: './make-ad-creative.component.html',
  styleUrls: ['./make-ad-creative.component.scss'],
})
export class MakeAdCreativeComponent {
  @ViewChild('adCreative', { static: false }) creativeHtml!: ElementRef;
  private canvas!: fabric.Canvas;
  @ViewChild(MediumEditorDirective)
  mediumEditorDirective!: MediumEditorDirective;

  // Active control
  selectedControl: string = 'Layers';

  // Tamplate Data
  currentTemplate: any;
  adCreativeId: any;

  choiceTemplatesId: any;
  themeType: any;
  checkImageGeneratedType: any;

  title: any;
  adCreativeIdea: any;
  templateSetting: any;

  dialogRef: any;

  // editor config
  currentEditor: any;
  editorConfig = {
    toolbar: {
      buttons: [
        {
          name: 'justifyLeft',
          contentDefault:
            '<img class="align-middle" width="24" src="assets/images/carousels-v2/editor-icons-5.png" alt="editor-icons" />', // Left align icon
        },
        {
          name: 'justifyCenter',
          contentDefault:
            '<img class="align-middle" width="24" src="assets/images/carousels-v2/editor-icons-6.png" alt="editor-icons" />', // Center align icon
        },
        {
          name: 'justifyRight',
          contentDefault:
            '<img class="align-middle" width="24" src="assets/images/carousels-v2/editor-icons-7.png" alt="editor-icons" />', // Right align icon
        },
        // {
        //   name: 'justifyFull',
        //   contentDefault: '<i class="fas fa-align-justify"></i>', // Justify icon
        // },
        {
          name: 'bold',
          contentDefault:
            '<img class="align-middle" width="24" src="assets/images/carousels-v2/editor-icons-2.png" alt="editor-icons" />',
        },
        {
          name: 'italic',
          contentDefault:
            '<img class="align-middle" width="24" src="assets/images/carousels-v2/editor-icons-3.png" alt="editor-icons" />',
        },
        {
          name: 'underline',
          contentDefault:
            '<img class="align-middle" width="24" src="assets/images/carousels-v2/editor-icons-4.png" alt="editor-icons" />',
        },
        {
          name: 'colorPicker',
          contentDefault:
            '<img class="align-middle" width="24" src="assets/images/carousels-v2/editor-icons-1.png" alt="editor-icons" />',
        },
        {
          name: 'h5',
          contentDefault:
            '<img class="align-middle" width="24" src="assets/images/carousels-v2/editor-icons-10.png" alt="editor-icons" />',
        },
        {
          name: 'h4',
          contentDefault:
            '<img class="align-middle" width="24" src="assets/images/carousels-v2/editor-icons-11.png" alt="editor-icons" />',
        },
        {
          name: 'h3',
          contentDefault:
            '<img class="align-middle" width="24" src="assets/images/carousels-v2/editor-icons-12.png" alt="editor-icons" />',
        },
        {
          name: 'unorderedlist',
          contentDefault:
            '<img class="align-middle" width="24" src="assets/images/carousels-v2/editor-icons-8.png" alt="editor-icons" />', // Bullet list icon
        },
        {
          name: 'orderedlist',
          contentDefault:
            '<img class="align-middle" width="24" src="assets/images/carousels-v2/editor-icons-9.png" alt="editor-icons" />', // Numbered list icon
        },
        {
          name: 'regenerate',
          contentDefault:
            '<img class="align-middle" width="24" src="assets/images/carousels-v2/icons-2.png" alt="editor-icons" />',
        },
        {
          name: 'emojiPicker',
          contentDefault:
            '<img class="align-middle" width="24" src="assets/images/carousels-v2/editor-icons-20.png" alt="editor-icons" />',
        },
        {
          name: 'regenerateContent',
          contentDefault: '<i class="fas fa-arrows-spin"></i>',
        },
      ],
    },
    extensions: {
      colorPicker: this.editorColorButton(),
      emojiPicker: this.editorEmojiButton(),
    },
    placeholder: {
      text: 'Start typing here...',
    },
  };

  constructor(
    private route: ActivatedRoute,
    private _contentDesignService: ContentDesignService,
    private _adCreativeTemplatesService: AdCreativeTemplatesService,
    private _designControlService: DesignControlService,
    private _brandkit: BrandKitService,
    private _toastr: ToastrService,
    private _loader: LoaderService,
    private _adCreative: AdCreativeService,
    public _utilities: CommonFunctionsService,
    public _globalService: GlobalService,
    private cdr: ChangeDetectorRef,
    private _dialog: MatDialog
  ) {
    this.adCreativeId = this.route.snapshot.params['id'];
  }

  ngOnInit() {
    this.initView();
    this.setAdsCreatiData();
  }

  setAdsCreatiData() {
    if (this.adCreativeId) {
      this._contentDesignService.genratedContent$.subscribe((data) => {
        if (data?.genratedType === 'template' && data?.isEditable) {
          this.fetchAdcreativeTemplates(data, data?.genratedType);
        }
      });
      this.patchadCreativeTemplates();
    } else {
      // Fetch Current templates

      this._contentDesignService.genratedContent$.subscribe((data) => {
        console.log('data fetch all', data);
        if (data?.choiceTemplatesId) {
          if (data?.genratedType === 'template') {
            this.fetchAdcreativeTemplates(data, data?.genratedType);
          } else if (data?.genratedType === 'savetemplate') {
            this.fetchAdcreativeTemplates(data, data?.genratedType);
          } else {
            this.fetchPresetsTemplates(data);
          }
        } else {
          this.currentTemplate =
            this._adCreativeTemplatesService.getTemplateById(
              designControl?.defaultTemplate
            );

          this.updateCarouselSetting(this.currentTemplate);
        }
      });
    }
  }

  async initView() {
    await this._globalService.getUserDetails({ isRefresh: false });
    await this._globalService.getLinkedinPageList({ isRefresh: false });
  }

  updateCarouselSetting(setting: any) {
    this._designControlService.updateTemplateSettings(setting);
  }

  fetchAdcreativeTemplates(choiceData: any, type: any) {
    let templateData;

    if (type === 'template') {
      templateData = this._utilities.adCreativeTemplateArray.find(
        (t: any) => t.templateId === choiceData?.choiceTemplatesId
      );
    } else {
      templateData = this._utilities.adCreativeSaveTemplateArray.find(
        (t: any) => t._id === choiceData?.choiceTemplatesId
      );
      templateData = templateData?.templateSetting;
    }

    this.templateSetting = templateData;

    this.currentTemplate =
      this._adCreativeTemplatesService.updateSettingByTemplateId(
        templateData,
        choiceData?.content
      );

    // Patch the data

    this.title = choiceData?.title;
    this.adCreativeIdea = choiceData?.idea;
    this.choiceTemplatesId = choiceData?.choiceTemplatesId;
    this.themeType = choiceData?.themeType;
    this.checkImageGeneratedType = choiceData?.content?.imageGeneratedType;

    if (choiceData?.themeType === 'brandkit') {
      this.currentTemplate.isBrandKit = true;
      this.getBrandKit();
    }

    // Update design settings

    this.updateCarouselSetting(this.currentTemplate);
    this.loadCanvas();
  }

  fetchPresetsTemplates(choiceData: any) {
    const templateData   = this._utilities.presetadCreativeTemplateObject;
    this.templateSetting = templateData;

    this.currentTemplate =
      this._adCreativeTemplatesService.updateSettingByTemplateId(
        templateData,
        choiceData?.content
      );

    // Patch the data

    this.title = choiceData?.title;
    this.adCreativeIdea = choiceData?.idea;
    this.choiceTemplatesId = choiceData?.choiceTemplatesId;
    this.themeType = choiceData?.themeType;
    this.checkImageGeneratedType = choiceData?.content?.imageGeneratedType;

    if (choiceData?.themeType === 'brandkit') {
      this.currentTemplate.isBrandKit = true;
      this.getBrandKit();
    }

    // Update design settings

    this.updateCarouselSetting(this.currentTemplate);
    this.loadCanvas();
  }

  // Patch data

  patchadCreativeTemplates() {
    this._loader.start();

    this._adCreative.getTemplate({ templateId: this.adCreativeId }).subscribe(
      (response: ResponseModel) => {
        this._loader.stop();

        if (response.statusCode == 200) {
          this.currentTemplate = response?.data?.templateSetting;

          this.title = response?.data?.title;
          this.adCreativeIdea = response?.data?.idea;

          this._contentDesignService.setAdCreativeContent({
            choiceTemplatesId: response?.data?._id,
            themeType: '',
            content: response?.data?.templateSetting?.content,
            title: response?.data?.title,
            idea: response?.data?.idea,
            genratedType: 'template',
            isGenratedFirst: false,
            isEditable: false,
          });
          this.loadCanvas();
          this.updateCarouselSetting(this.currentTemplate);
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

  // genrated ad creative

  generateAdCreative() {
    if (!this.adCreativeIdea) {
      return;
    }
    let obj = {};

    obj = {
      topic: this.adCreativeIdea,
    };

    if (this.checkImageGeneratedType === 'Generated image') {
      obj = {
        ...obj,
        generatedImageType: this.checkImageGeneratedType,
      };
    }

    this._loader.start();
    this._adCreative.generateCreative(obj).subscribe(
      (response: ResponseModel) => {
        this._loader.stop();
        if (response.statusCode == 200) {
          let genratedIdeaData = response?.data;

          this._contentDesignService.setAdCreativeContent({
            choiceTemplatesId: this.choiceTemplatesId,
            themeType: this.themeType,
            content: genratedIdeaData,
            title:
              this.adCreativeIdea?.length > 12
                ? this.adCreativeIdea?.substring(0, 12)
                : this.adCreativeIdea,
            idea: this.adCreativeIdea,
            genratedType: 'template',
            isGenratedFirst: false,
            isEditable: false,
          });
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

  // Get Brand Kit

  getBrandKit() {
    let param = {};
    this._brandkit.list(param).subscribe(
      (response: ResponseModel) => {
        if (response.statusCode == 200) {
          var brandKitData = response?.data;

          // Update the brandkit font family

          this.currentTemplate.descriptionFont = brandKitData?.bodyFont;
          this.currentTemplate.titlefont = brandKitData?.titleFont;

          // Update the colors

          this.handleChangeColorSetting({
            backgroundColor: brandKitData?.primaryColor,
            textColor: brandKitData?.secondaryColor,
            subColor: brandKitData?.accent1Color,
            subBackgroundColor: brandKitData?.accent2Color,
          });
        } else {
          this._toastr.error(MessageConstant.unknownError, '');
        }
      },
      (err: ErrorModel) => {
        if (err.error) {
          const error: ResponseModel = err.error;
          this._toastr.error(error.message, '');
        } else {
          this._toastr.error(MessageConstant.unknownError, '');
        }
      }
    );
  }

  // This method will be triggered when the sidebar emits a new menu selection

  onMenuSelected(menu: string) {
    this.selectedControl = menu;
  }

  // Handle Background

  handleBackground(event: any): void {
    if (event?.type === 'bgImage') {
      this.currentTemplate.content.contentImage = event.background;
      this.loadCanvas();
    }
  }

  // Set the Design Layouts

  setDesignLayout(event: any) {
    this.currentTemplate.layout = event?.type;
  }

  handleActionBtnText(event: any): void {
    this.currentTemplate.actionBtnText = event;
  }

  handleLogoBgColor(event: any): void {
    this.currentTemplate.logoBackgroundColor = event;
  }

  handleLogoBgOpacity(event: any): void {
    this.currentTemplate.logoBackgroundOpacity = event / 100;
  }

  toHandleLogoImage(event: any): void {
    this.currentTemplate.logoUrl = event;
  }

  // Handle the event emitted by app-layers when the image visibility is toggled

  handleToggleImage(event: { slide: any; index: number }): void {
    this.currentTemplate.showImage = event.slide.showImage;
  }

  handleToggleSubTitle(event: { slide: any; index: number }): void {
    this.currentTemplate.showSubTitle = event.slide.showSubTitle;
  }

  handleToggleTitle(event: { slide: any; index: number }): void {
    this.currentTemplate.showTitle = event.slide.showTitle;
  }

  handleToggleDescription(event: { slide: any; index: number }): void {
    this.currentTemplate.showDescription = event.slide.showDescription;
  }

  handleCTA(event: { slide: any; index: number }): void {
    this.currentTemplate.showCTA = event.slide.showCTA;
  }

  // Handle The Text Changes

  handleFontPair(event: any): void {
    this.currentTemplate.fontPair = event;
  }

  handleTitleFont(event: any): void {
    this.currentTemplate.titlefont = event;
  }

  handleDescriptionFont(event: any): void {
    this.currentTemplate.descriptionFont = event;
  }

  handleTitleFontSize(event: any): void {
    this.currentTemplate.titlefontSize = event;
  }

  handleDescriptionFontSize(event: any): void {
    this.currentTemplate.descriptionFontSize = event;
  }

  // Handle Color

  handleChangeColorSetting(event: {
    backgroundColor: any;
    textColor: any;
    subColor: any;
    subBackgroundColor: any;
  }): void {
    this.currentTemplate.textColor = event.textColor;
    this.currentTemplate.subColor = event.subColor;
    this.currentTemplate.backgroundColor = event.backgroundColor;
    this.currentTemplate.subBackgroundColor = event.subBackgroundColor;
  }

  loadCanvas() {
    this.cdr.detectChanges();

    const canvasElementId = 'myCanvas_' + this.currentTemplate?.templateId;
    const canvasElement = document.getElementById(
      canvasElementId
    ) as HTMLCanvasElement;

    // If the canvas is already initialized, clear it before reloading
    if (this.canvas) {
      this.canvas.clear(); // Clears all objects from the canvas
      this.canvas.dispose(); // Removes all event listeners and disposes of the canvas
    }

    this.canvas = new fabric.Canvas(canvasElement, {
      selection: false,
      preserveObjectStacking: true,
    });

    // Load an image into the canvas
    const imageUrl = this.currentTemplate?.content?.contentImage;

    console.log('imageUrl', imageUrl);

    // Replace with your image URL

    this.getBase64Image(imageUrl)
      .then((base64Image) => {
        this.addImageToCanvas(base64Image);
      })
      .catch((error) =>
        console.error('Error converting image to base64:', error)
      );

    // Handle selection and zoom
    this.initializeCanvasEvents();
  }

  private addImageToCanvas(url: string): void {
    fabric.util.loadImage(url, (img: HTMLImageElement | null) => {
      if (img) {
        const fabricImage = new fabric.Image(img, {
          left: 10,
          top: 10,
          //scaleX: this.canvas.width / img.width,
          //scaleY: this.canvas.height / img.height,
          selectable: true,
        });
        this.canvas.add(fabricImage);
        this.canvas.setActiveObject(fabricImage);
        this.canvas.renderAll();
      }
    });
  }

  private initializeCanvasEvents(): void {
    // Event when an object is selected
    this.canvas.on('selection:created', (e: any) => {
      const activeObject = e.target;
      if (activeObject) {
        activeObject.set({
          borderColor: 'blue',
          cornerColor: 'red',
          cornerSize: 10,
          transparentCorners: false,
        });
        this.canvas.renderAll();
      }
    });

    // Mouse wheel zoom
    this.canvas.on('mouse:wheel', (opt: any) => {
      const delta = opt.e.deltaY;
      let zoom = this.canvas.getZoom();
      zoom *= 0.999 ** delta;

      // Limit zoom levels
      if (zoom > 5) zoom = 5;
      if (zoom < 0.5) zoom = 0.5;

      const point = new fabric.Point(opt.e.offsetX, opt.e.offsetY);
      this.canvas.zoomToPoint(point, zoom);
      opt.e.preventDefault();
      opt.e.stopPropagation();
    });
    // ===================== Editor Option ================
  }

  getBase64Image(imgUrl: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = imgUrl;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const dataURL = canvas.toDataURL('image/png');
          resolve(dataURL);
        } else {
          reject(new Error('Unable to get canvas context'));
        }
      };
      img.onerror = (error) => {
        reject(error);
      };
    });
  }

  // Color Picker

  editorColorButton() {
    const MediumEditorWithExtensions = MediumEditor as any;

    const actionButton = MediumEditorWithExtensions.extensions.button.extend({
      name: 'colorPicker',
      init: function () {
        this.button = this.document.createElement('button');
        this.button.innerHTML =
          '<img class="align-middle" width="24" src="assets/images/carousels-v2/editor-icons-1.png" alt="editor-icons" />';
        this.on(this.button, 'click', this.handleClick.bind(this));
      },
      handleClick: function () {
        const toolbar = document.querySelector(
          '.medium-editor-toolbar-active'
        ) as HTMLElement;
        const colorInput = document.getElementById(
          'color-input'
        ) as HTMLInputElement;

        if (toolbar && colorInput) {
          // Set the color input position near the toolbar
          const toolbarRect = toolbar.getBoundingClientRect();
          colorInput.style.display = 'block'; // Make the input visible when clicked
          colorInput.style.position = 'absolute';
          colorInput.style.top = `${toolbarRect.bottom + window.scrollY}px`; // Position below toolbar
          colorInput.style.left = `${toolbarRect.left + window.scrollX}px`; // Align to toolbar's left
          colorInput.click(); // Trigger the color input click to open the color picker
        }
      },
      getButton: function () {
        return this.button;
      },
    });
    return new actionButton();
  }

  onColorChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const color = inputElement.value;

    document.execCommand('foreColor', false, color);

    this.currentEditor.focus();
  }

  //Emoji Picker
  editorEmojiButton() {
    const MediumEditorWithExtensions = MediumEditor as any;

    const actionButton = MediumEditorWithExtensions.extensions.button.extend({
      name: 'emojiPicker',
      contentDefault:
        '<img class="align-middle" width="24" src="assets/images/carousels-v2/editor-icons-20.png" alt="editor-icons" />', // Emoji icon
      aria: 'Insert Emoji', // Accessibility text
      action: 'emoji-picker', // Custom action name
      handleClick: function (event: any) {
        event.preventDefault();
        event.stopPropagation();
        this.openEmojiPicker();
      },

      openEmojiPicker: function () {
        let emojiPicker = document.querySelector('emoji-picker');

        if (!emojiPicker) {
          emojiPicker = document.createElement('emoji-picker');
          document.body.appendChild(emojiPicker);
        }

        emojiPicker.addEventListener('emoji-click', (event: any) => {
          const emoji = event.detail.unicode;
          this.insertEmoji(emoji);
          if (emojiPicker) {
            document.body.removeChild(emojiPicker); // Remove picker after emoji selection
          }
        });

        // Position emoji picker near the button

        const toolbar = document.querySelector(
          '.medium-editor-toolbar-active'
        ) as HTMLElement;
        const toolbarRect = toolbar.getBoundingClientRect();

        const button = this.button;
        const rect = button.getBoundingClientRect();

        emojiPicker.style.position = 'absolute';
        // emojiPicker.style.left = `${rect.left}px`;
        // emojiPicker.style.top = `${rect.bottom + window.scrollY}px`; // Account for scroll
        emojiPicker.style.top = `${toolbarRect.bottom + window.scrollY}px`; // Position below toolbar
        emojiPicker.style.left = `${toolbarRect.left + window.scrollX}px`; // Align to toolbar's left

        emojiPicker.style.zIndex = '10000'; // Make sure it's above all other content

        emojiPicker.style.display = 'block'; // Ensure it is shown
        emojiPicker.style.visibility = 'visible';
      },

      insertEmoji: function (emoji: string) {
        const selection = window.getSelection() as any;
        const range = selection.getRangeAt(0);
        range.deleteContents(); // Remove selected text (if any)

        // Insert the emoji at the cursor position
        const textNode = document.createTextNode(emoji);
        range.insertNode(textNode);
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
      },
      getButton: function () {
        return this.button;
      },
    });
    return new actionButton();
  }

  oneIdeaDailog() {
    let obj = { type: 'topic' };

    this.dialogRef = this._dialog.open(GenerateCommonPromptComponent, {
      width: '550px',
      data: obj,
    });
    this.dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.adCreativeIdea = result;
      }
    });
  }

  reGenerateTopic() {
    this._loader.start();
    let param = {
      topic: this.currentTemplate?.content?.title,
      content: this.currentTemplate?.content?.description,
    };
    this._adCreative.generateAdCreativeContent(param).subscribe(
      (response: ResponseModel) => {
        this._loader.stop();
        if (response.statusCode == 200) {
          this.currentTemplate.content.description = response?.data;
        } else {
          this._toastr.error(MessageConstant.unknownError, '');
        }
      },
      (err: ErrorModel) => {
        if (err.error) {
          const error: ResponseModel = err.error;
          this._toastr.error(error.message, '');
        } else {
          this._toastr.error(MessageConstant.unknownError, '');
        }
      }
    );
  }
}
