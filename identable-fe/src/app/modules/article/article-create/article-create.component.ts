import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Router } from '@angular/router';

//LIBRARY
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

// SERVICES
import { LoaderService } from '../../../providers/loader-service/loader.service';
import { ArticleService } from '../../../providers/article/article.service';
import { GeneralService } from 'src/app/providers/general/general.service';
import { AddSubTopicComponent } from '../dialog/add-sub-topic/add-sub-topic.component';
import { IdeaSuggestionComponent } from '../dialog/idea-suggestion/idea-suggestion.component';

//UTILS
import { CommonFunctionsService } from '../../../utils/common-functions/common-functions.service';
import { GlobalService } from '../../../utils/common-functions/global.service';
import { commonConstant } from '../../../utils/common-functions/common-constant';
import { ErrorModel } from '../../../utils/models/error';
import { ResponseModel } from '../../../utils/models/response';
import { MessageConstant } from '../../../utils/message-constant';

@Component({
  selector: 'app-article-create',
  templateUrl: './article-create.component.html',
  styleUrls: ['./article-create.component.scss'],
})
export class ArticleCreateComponent {
  @ViewChild('tagInputField') tagInputField!: ElementRef;

  currentStep: number = 1;
  stepProgress: number = 20;
  selectedTabindex: number = 0;

  isFAQ: boolean = true;
  isConclusion: boolean = false;
  isCTA: boolean = false;
  isYoutubeInclude: boolean = false;
  isAuthorityLinkInclude: boolean = false;
  youtubeLink: any;
  authoLink: any;

  isYoutubeSERP: boolean = true;
  isAuthorityLinkSERP: boolean = true;

  isInvalidYoutubeLink: boolean = false;

  ideaList: any;

  goal: any;
  idea: any;
  selectedKeyword: any = [];
  tag: any = [];
  articleHeadline: any;
  articleGoal: any;
  language: any = 'english (usa)';
  length: any = 'medium';
  factualData: any = 'no factual data';
  imageSource: any = 'ai Image';
  imageCount: number = 0;
  imageOrientation: any = 'Landscape';
  isAltTag: boolean = false;
  youtubeVideos: any = [];
  authorityLinks: any = [];

  selectedImageStyle: any;

  imageStyles = [
    {
      value: 'random',
      label: 'Random',
      icon: 'assets/images/ai-icon.svg',
    },
    {
      value: 'ai image',
      label: 'AI Image (max 1)',
      icon: 'assets/images/ai-icon.svg',
    },
    {
      value: 'giphy',
      label: 'Giphy',
      icon: 'assets/images/image-giphy-24.png',
    },
    {
      value: 'pexel-image',
      label: 'Pexel Image',
      icon: 'assets/images/pixels-icon.png',
    },
  ];

  goalList: any;
  subTopic: any;
  keywordList: any;
  headlineList: any;
  articleOutlineList: any;
  dialogRef: any;

  creditDeducated: number = 0;
  creditMessage: any;

  constructor(
    private formBuilder: FormBuilder,
    private _loader: LoaderService,
    private _toastr: ToastrService,
    public _utilities: CommonFunctionsService,
    public _globalService: GlobalService,
    private _titleService: Title,
    private _dialog: MatDialog,
    private _article: ArticleService,
    public _generalService: GeneralService,
    public _ngxLoader: NgxUiLoaderService,
    private router: Router,
    public cdr: ChangeDetectorRef
  ) {
    this._titleService.setTitle('Identable | Create Article');
    this.selectedImageStyle = this.imageStyles[0];
  }

  ngOnInit(): void {
    this._ngxLoader.startLoader('GOAL');
    this.initView();
  }

  async initView() {
    await this._globalService.getUserDetails({ isRefresh: false });
    await this._globalService.getLinkedinPageList({ isRefresh: false });
    this.getArticleGoal();
    this.creditDeducated = this._utilities?.userData?.plan?.articleCredit;
    this.creditMessage = `This will cost ${this.creditDeducated} credits`;
  }

  onChangeStep(direction: any) {
    if (direction) {
      this.stepProgress = this.stepProgress + 20;
      this.currentStep++;
    } else {
      if (this.currentStep == 1) {
        this.router.navigate(['article']);
        return;
      }
      this.stepProgress = this.stepProgress - 20;
      this.currentStep--;
    }

    if (this.currentStep == 2) {
      // if (!this.keywordList) {
      this.getArticleKeywords();
      this.getArticleIdea();
      // }
    }

    if (this.currentStep == 3) {
      // if (!this.headlineList) {
      this.getArticleHeadline();
      // }
    }

    if (this.currentStep == 4) {
      // if (!this.articleOutlineList) {
      this.getArticleOutlineOutput();
      // }
    }
  }

  selectImageStyle(event: any) {
    let imageStyle = event?.value?.value;
    this.imageSource = imageStyle;
  }

  selectGoal(goal: any) {
    this.goal = goal;
  }

  selectIdea(idea: any) {
    this.idea = idea;
  }

  selectKeyword(keyword: any) {
    this.selectedKeyword.push(keyword);
  }

  selectOutLineTab(index: any) {
    this.selectedTabindex = index;
  }

  checkSelectedKeyword(keyword: any) {
    return this.selectedKeyword?.includes(keyword);
  }

  getArticleOutputHeadline() {
    return this.articleOutlineList[this.selectedTabindex]?.output;
  }

  getArticleOutputSubHeading() {
    return this.articleOutlineList[this.selectedTabindex]?.headingdata;
  }

  deleteOutline(index: any, type: any, subIndex?: any) {
    if (type == 'h2') {
      this.articleOutlineList[this.selectedTabindex].headingdata.splice(
        index,
        1
      );
    }
    if (type == 'h3') {
      this.articleOutlineList[this.selectedTabindex].headingdata[
        index
      ].h3.splice(subIndex, 1);
    }
  }

  deleteYoutubeLink(index: any) {
    this.youtubeVideos.splice(index, 1);
  }

  onChangeYoutubeLink(event: any) {
    this.isInvalidYoutubeLink = false;
  }

  addYoutubeLink() {
    if (this.youtubeVideos?.length > 1) {
      return;
    }
    const youtubeRegex = /^(https?:\/\/)?(www\.youtube\.com|youtu\.be)\/.+$/;

    if (!youtubeRegex.test(this.youtubeLink)) {
      this.isInvalidYoutubeLink = true;
      return;
    }
    this.youtubeVideos.push(this.youtubeLink);
    this.youtubeLink = '';
  }

  addAuthorityLink() {
    if (this.authorityLinks?.length > 2) {
      return;
    }
    this.authorityLinks.push(this.authoLink);
    this.authoLink = '';
  }

  deleteAuthorityLink(index: any) {
    this.authorityLinks.splice(index, 1);
  }

  checkInclude(item: any) {
    if (item == 'isFAQ' && this.isFAQ) {
      return true;
    }
    if (item == 'isConclusion' && this.isConclusion) {
      return true;
    }
    if (item == 'isCTA' && this.isCTA) {
      return true;
    }
    if (item == 'isAuthorityLinkInclude' && this.isAuthorityLinkInclude) {
      return true;
    }
    if (item == 'isYoutubeInclude' && this.isYoutubeInclude) {
      return true;
    }

    return false;
  }

  addSubTopic() {
    if (!this?.subTopic) {
      return;
    }
    this.articleOutlineList[this.selectedTabindex].headingdata.push({
      h2: this?.subTopic,
    });
    this.subTopic = '';
  }

  drop(event: any, index: number) {
    let draggedItem = event.item.data;

    if (event.previousIndex !== undefined && event.currentIndex !== undefined) {
      if (draggedItem?.h2 !== undefined) {
        let h2List =
          this.articleOutlineList[this.selectedTabindex]?.headingdata;
        let h1Index = h2List.findIndex((item: any) => item === draggedItem);
        if (h1Index > -1 && event.currentIndex < h2List.length) {
          let [removedItem] = h2List.splice(h1Index, 1);
          h2List.splice(event.currentIndex, 0, removedItem);
        }
      }
    } else {
      console.error('Event indices are undefined');
    }
  }

  drop1(event: any, index: number) {
    let draggedItem = event.item.data;

    if (event.previousIndex !== undefined && event.currentIndex !== undefined) {
      let h3List =
        this.articleOutlineList[this.selectedTabindex]?.headingdata[index]?.h3;
      let previousIndex = event.previousIndex;
      let currentIndex = event.currentIndex;
      if (h3List && previousIndex < h3List.length) {
        let [removedH3] = h3List.splice(previousIndex, 1);
        h3List.splice(currentIndex, 0, removedH3);
      }
    } else {
      console.error('Event indices are undefined');
    }
  }

  addKeywordAction() {
    const inputElement = document.querySelector('tag-input input') as any;
    const inputValue = inputElement?.value.trim();
    if (inputValue) {
      this.selectedKeyword.push(inputValue);
      inputElement.value = '';
    }
  }

  removeKeyword(keyword: any) {
    let value = this.selectedKeyword || [];
    let index = value.indexOf(keyword);
    if (index !== -1) {
      value.splice(index, 1);
      this.selectedKeyword.setValue(value);
    }
  }

  selectHeadline(headline: any) {
    this.articleHeadline = headline;
  }

  imageCountFn(dir: boolean) {
    if (dir) {
      if (this.imageCount > 3) {
        return;
      }
      this.imageCount++;
    } else {
      if (this.imageCount <= 0) {
        return;
      }
      this.imageCount--;
    }
  }

  getArticleGoal() {
    // this.goalList = [
    //   'SEO ranking',
    //   'Audience engagement',
    //   'Thought leadership',
    //   'Product promotion',
    //   'Service promotion',
    // ];
    // this.goal = this.goalList[0];
    // return;
    this._ngxLoader.startLoader('GOAL');
    this._article.getArticleGoal({}).subscribe(
      (response: ResponseModel) => {
        this._ngxLoader.stopLoader('GOAL');
        if (response.statusCode == 200) {
          this.goalList = response?.data;
          this.goal = this.goalList[0];
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

  getArticleKeywords() {
    // this.keywordList = [
    //   {
    //     keyword: 'Algorithm Updates',
    //   },
    //   {
    //     keyword: 'Backlink Strategies',
    //   },
    //   {
    //     keyword: 'Content Optimization',
    //   },
    //   {
    //     keyword: 'Keyword Research',
    //   },
    //   {
    //     keyword: 'Mobile SEO',
    //   },
    // ];
    // return;
    this._ngxLoader.startLoader('KEYWORD');
    this._article.getArticleKeywords({ topic: this.goal }).subscribe(
      (response: ResponseModel) => {
        this._ngxLoader.stopLoader('KEYWORD');

        if (response.statusCode == 200) {
          this.keywordList = response?.data?.data;
        } else {
          this._toastr.error(MessageConstant.unknownError, '');
        }
      },
      (err: ErrorModel) => {
        this._ngxLoader.stopLoader('KEYWORD');
        if (err.error) {
          const error: ResponseModel = err.error;
          this._toastr.error(error.message, '');
        } else {
          this._toastr.error(MessageConstant.unknownError, '');
        }
      }
    );
  }

  getArticleIdea() {
    // this.ideaList = [
    //   {
    //     idea: "Boost Your iOS App's SEO Ranking: A Comprehensive Guide",
    //   },
    //   {
    //     idea: 'Mastering SEO for Your iOS Development Projects',
    //   },
    //   {
    //     idea: 'Optimize Your iOS App for Better Search Engine Visibility',
    //   },
    //   {
    //     idea: "SEO Strategies for Your iOS App: A Beginner's Guide",
    //   },
    //   {
    //     idea: "Improve Your iOS App's SEO Ranking: Practical Tips",
    //   },
    // ];
    // this.idea = this.ideaList[0]?.idea;
    // return;
    let goal = this.goal;
    this.idea = '';
    this._ngxLoader.startLoader('IDEA');
    this._article.getArticleIdea({ goal: goal }).subscribe(
      (response: ResponseModel) => {
        this._ngxLoader.stopLoader('IDEA');
        if (response.statusCode == 200) {
          this.ideaList = response?.data?.data;
          this.idea = this.ideaList[0]?.idea;
        } else {
          this._toastr.error(MessageConstant.unknownError, '');
        }
      },
      (err: ErrorModel) => {
        this._ngxLoader.stopLoader('IDEA');
        if (err.error) {
          const error: ResponseModel = err.error;
          this._toastr.error(error.message, '');
        } else {
          this._toastr.error(MessageConstant.unknownError, '');
        }
      }
    );
  }

  regenerateArticleIdea() {
    this._loader.start();
    this._article.regenerateArticleIdea({ goal: this.goal }).subscribe(
      (response: ResponseModel) => {
        this._loader.stop();

        if (response.statusCode == 200) {
          this.idea = response?.data;
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

  getArticleHeadline(regenereate?: any) {
    // this.headlineList = [
    //   {
    //     headline:
    //       "Mastering Algorithm Updates to Enhance Your iOS App's SEO Ranking",
    //   },
    //   {
    //     headline:
    //       "Leveraging Backlink Strategies to Improve Your iOS App's SEO Ranking",
    //   },
    //   {
    //     headline:
    //       "Algorithm Updates: The Key to Boosting Your iOS App's SEO Ranking",
    //   },
    //   {
    //     headline:
    //       "Backlink Strategies: A Powerful Tool to Boost Your iOS App's SEO Ranking",
    //   },
    //   {
    //     headline:
    //       'A Comprehensive Guide to Algorithm Updates and Backlink Strategies for iOS App SEO Ranking',
    //   },
    // ];
    // this.articleHeadline = this.headlineList[0]?.headline;

    // return;
    let obj = {
      topic: this.idea,
      goal: this.goal,
      keywords: this.selectedKeyword?.join(', '),
    };
    this.articleHeadline = '';
    this._ngxLoader.startLoader('HEADLINE');
    if (!regenereate) {
      this._article.getArticleHeadline(obj).subscribe(
        (response: ResponseModel) => {
          this._ngxLoader.stopLoader('HEADLINE');

          if (response.statusCode == 200) {
            this.headlineList = response?.data?.data;
            this.articleHeadline = this.headlineList[0]?.headline;
          } else {
            this._toastr.error(MessageConstant.unknownError, '');
          }
        },
        (err: ErrorModel) => {
          this._ngxLoader.stopLoader('HEADLINE');
          if (err.error) {
            const error: ResponseModel = err.error;
            this._toastr.error(error.message, '');
          } else {
            this._toastr.error(MessageConstant.unknownError, '');
          }
        }
      );
    } else {
      this._article.regenerateArticleHeadline(obj).subscribe(
        (response: ResponseModel) => {
          this._ngxLoader.stopLoader('HEADLINE');
          if (response.statusCode == 200) {
            this.articleHeadline = response?.data;
          } else {
            this._toastr.error(MessageConstant.unknownError, '');
          }
        },
        (err: ErrorModel) => {
          this._ngxLoader.stopLoader('HEADLINE');
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

  getArticleOutlineOutput() {
    // this.articleOutlineList = [
    //   {
    //     headingdata: [
    //       {
    //         h2: 'Understanding Algorithm Updates',
    //         h3: [
    //           'What are Algorithm Updates?',
    //           "How do Algorithm Updates affect your iOS App's SEO Ranking?",
    //           'Recent Algorithm Updates and their impact',
    //         ],
    //       },
    //       {
    //         h2: 'Mastering Algorithm Updates for iOS Apps',
    //         h3: [
    //           'Staying updated with Algorithm Changes',
    //           'Adapting your iOS App to Algorithm Updates',
    //           'Case Study: Successful adaptation to Algorithm Updates',
    //         ],
    //       },
    //       {
    //         h2: "Algorithm Updates: Do's and Don'ts",
    //         h3: [
    //           'Best practices for dealing with Algorithm Updates',
    //           'Common mistakes to avoid',
    //           'Expert tips for mastering Algorithm Updates',
    //         ],
    //       },
    //     ],
    //   },
    //   {
    //     headingdata: [
    //       {
    //         h2: 'Introduction to Backlink Strategies',
    //         h3: [
    //           'What are Backlinks?',
    //           'Importance of Backlinks in SEO Ranking',
    //           'Types of Backlinks',
    //         ],
    //       },
    //       {
    //         h2: 'Implementing Backlink Strategies for iOS Apps',
    //         h3: [
    //           'Creating a successful Backlink Strategy',
    //           'Backlink Strategies for iOS Apps: A step-by-step guide',
    //           'Case Study: Effective use of Backlink Strategies',
    //         ],
    //       },
    //       {
    //         h2: 'Backlink Strategies: Best Practices and Pitfalls',
    //         h3: [
    //           'Best practices for implementing Backlink Strategies',
    //           'Common pitfalls and how to avoid them',
    //           'Expert tips for maximizing the impact of your Backlink Strategy',
    //         ],
    //       },
    //     ],
    //   },
    //   {
    //     headingdata: [
    //       {
    //         h2: "Boosting Your iOS App's SEO Ranking: A Comprehensive Guide",
    //         h3: [
    //           'Understanding the importance of SEO Ranking for iOS Apps',
    //           'How Algorithm Updates and Backlink Strategies affect SEO Ranking',
    //           "Steps to improve your iOS App's SEO Ranking",
    //         ],
    //       },
    //       {
    //         h2: 'Case Study: Successful SEO Ranking Improvement',
    //         h3: [
    //           'Overview of the case study',
    //           'Strategies used to improve SEO Ranking',
    //           'Results and key takeaways',
    //         ],
    //       },
    //       {
    //         h2: 'Conclusion: Mastering SEO Ranking for iOS Apps',
    //         h3: [
    //           'Recap of Algorithm Updates and Backlink Strategies',
    //           "Final thoughts on improving your iOS App's SEO Ranking",
    //           'Future trends in SEO Ranking for iOS Apps',
    //         ],
    //       },
    //     ],
    //   },
    // ];
    // return;
    let obj = {
      topic: this.idea,
      goal: this.goal,
      headline: this.articleHeadline,
      keywords: this.selectedKeyword?.join(', '),
    };

    this._ngxLoader.startLoader('OUTLINE');
    this.articleOutlineList = [];
    this._article.getArticleOutlineOutput(obj).subscribe(
      (response: ResponseModel) => {
        this._ngxLoader.stopLoader('OUTLINE');

        if (response.statusCode == 200) {
          this.articleOutlineList = response?.data?.data;
        } else {
          this._toastr.error(MessageConstant.unknownError, '');
        }
      },
      (err: ErrorModel) => {
        this._ngxLoader.stopLoader('OUTLINE');
        if (err.error) {
          const error: ResponseModel = err.error;
          this._toastr.error(error.message, '');
        } else {
          this._toastr.error(MessageConstant.unknownError, '');
        }
      }
    );
  }

  onInputChange(event: any) {
    console.log('erent', event);
  }

  generateArticle() {
    let currentProfile = this._utilities?.linkedinPageList.find(
      (x: any) => x._id == this._utilities.userData?.currentPageId
    );
    let profileAvatar = currentProfile?.image
      ? currentProfile?.image
      : 'assets/images/avatar/avatar.png';

    let bannerImageSetting = {
      layout: 'left',
      headline: this.articleHeadline,
      profileAvatar: profileAvatar,
      coverImage: '',
      bannerColor: '',
      isBrandkit: false,
    };

    let obj = {
      topic: this.idea,
      goal: this.goal,
      headline: this.articleHeadline,
      keywords: this.selectedKeyword?.join(', '),
      headingData: this.articleOutlineList[this.selectedTabindex]?.headingdata,
      youtubeVideos: this.youtubeVideos,
      authorityLinks: this.authorityLinks,
      isFAQ: this.isFAQ,
      isConclusion: this.isConclusion,
      isCTA: this.isCTA,
      language: this.language,
      length: this.length,
      factualData: this.factualData,
      imageCount: this.imageCount,
      imageSource: this.imageSource,
      imageOrientation: this.imageOrientation,
      isAltTag: this.isAltTag,
      bannerImageSetting: bannerImageSetting,
    };

    this._utilities.articleObject = obj;
    this.router.navigate(['article/editarticle']);
  }

  generateSubTopic(topic: any, index: any) {
    let obj = {
      topic: this.idea,
      goal: this.goal,
      headline: this.articleHeadline,
      keywords: this.selectedKeyword?.join(', '),
      outlineTopic: topic,
    };

    this._loader.start();
    this._article.generateOutlineSubTopic(obj).subscribe(
      (response: ResponseModel) => {
        this._loader.stop();

        if (response.statusCode == 200) {
          let result = response?.data?.data;
          let subTopicList = result?.map((item: any) => item.h3);
          this.articleOutlineList[this.selectedTabindex].headingdata[index].h3 =
            subTopicList;
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

  addSubtopicDailog(index: any) {
    this.dialogRef = this._dialog.open(AddSubTopicComponent, {
      width: '800px',
      disableClose: false,
      panelClass: '',
      data: {},
    });

    this.dialogRef.afterClosed().subscribe((result: any) => {
      if (result?.topic) {
        this.articleOutlineList[this.selectedTabindex]?.headingdata[
          index
        ].h3.push(result?.topic);
      }
    });
  }
}
