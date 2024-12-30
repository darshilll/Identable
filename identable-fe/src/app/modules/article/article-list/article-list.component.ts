import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

// SERVICES
import { LoaderService } from '../../../providers/loader-service/loader.service';
import { ArticleService } from '../../../providers/article/article.service';
import { GeneralService } from 'src/app/providers/general/general.service';

//UTILS
import { CommonFunctionsService } from '../../../utils/common-functions/common-functions.service';
import { GlobalService } from '../../../utils/common-functions/global.service';
import { ErrorModel } from '../../../utils/models/error';
import { ResponseModel } from '../../../utils/models/response';
import { MessageConstant } from '../../../utils/message-constant';

@Component({
  selector: 'app-article-list',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.scss'],
})
export class ArticleListComponent {
  articleList: any;
  searchText: any;
  sortMode: boolean = false;
  isCreateArticle: boolean = true;
  isSearch: boolean = false;
  isDataLoaded: boolean = false;

  constructor(
    private _loader: LoaderService,
    private _toastr: ToastrService,
    public _utilities: CommonFunctionsService,
    public _globalService: GlobalService,
    private _titleService: Title,
    private _article: ArticleService,
    public _generalService: GeneralService,
    private router: Router
  ) {
    this._titleService.setTitle('Identable | Article');
  }

  ngOnInit(): void {
    this.initView();
  }

  async initView() {
    await this._globalService.getUserDetails({ isRefresh: false });
    await this._globalService.getLinkedinPageList({ isRefresh: false });
    this.getArticleList();
  }

  getArticleList() {
    let obj = {};

    if (this.sortMode) {
      obj = {
        ...obj,
        sortMode: this.sortMode,
      };
    }

    if (this.searchText) {
      obj = {
        ...obj,
        searchText: this.searchText,
      };
    }

    this._loader.start();
    this._article.getArticleList(obj).subscribe(
      (response: ResponseModel) => {
        this.isDataLoaded = true;
        this._loader.stop();

        if (response.statusCode == 200) {
          this.articleList = response?.data;
        } else {
          this._toastr.error(MessageConstant.unknownError, '');
        }
      },
      (err: ErrorModel) => {
        this.isDataLoaded = true;
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

  searchTemplate(event: any) {
    let text = event.target.value;
    this.searchText = text;
    this.isSearch = true;
    this.getArticleList();
  }

  clearSearchText() {
    this.searchText = '';
    this.isSearch = false;
    this.getArticleList();
  }

  onShort() {
    this.sortMode = !this.sortMode;
    this.getArticleList();
  }

  deleteArticle(articleId: any) {
    this._loader.start();
    this._article.articleDelete({ articleId: articleId }).subscribe(
      (response: ResponseModel) => {
        this._loader.stop();

        if (response.statusCode == 200) {
          this._toastr.success('Article deleted successfully');
          this.getArticleList();
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

  createNewArticle() {
    this.router.navigate(['article/createarticle']);
  }

  editArticle(article: any) {
    this._utilities.articleObject = article;
    this.router.navigate(['article/editarticle']);
  }

  renameArticle(articleObject: any) {
    this._toastr.info('Coming soon...');
  }

  async scheduleArticle(articleObject: any) {
    this._toastr.info('Coming soon...');

    // const data = await fetch(
    //   'https://identable-backend-production-new.s3.me-south-1.amazonaws.com/668ca70ee530040031986342/aiimage/image_1731740893174.jpg'
    // );
    // const blob = await data.blob();

    // var vm = this;
    // const reader = new FileReader();
    // reader.readAsDataURL(blob);
    // reader.onloadend = () => {
    //   var base64data = reader.result;
    //   console.log('base64data = ', base64data);
    // };
  }
}
