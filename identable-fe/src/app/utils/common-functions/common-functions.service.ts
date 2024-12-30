import { throwError, Subject, scheduled } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { SocketService } from 'src/app/providers/socket/socket.service';

@Injectable({
  providedIn: 'root',
})
export class CommonFunctionsService {
  public signupFormData: any = {};
  public userData: any;
  public linkedinPageList: any;
  public linkedinProfileData: any;
  public linkedinAccessPageList: any;
  public pageList: any;
  public aiSettingData: any;
  public chatGPTModel: any;
  public carouselData: any;
  public selectedTheme: any;
  public prospectSearchText: string = '';
  public prospectCampaignId: string = '';
  public currentProfile: any;

  // Ai Video
  public aiVideoData: any;

  public oneClickCampaignGoalSuggestion: any = [];
  public oneClickKeywordSuggestion: any = [];
  public oneClickTopicSuggestion: any = [];

  public carouselTemplateArray: any = [];
  public presetCarouselTemplateObject: any = {};
  public carouselSaveTemplateArray: any = [];

  public adCreativeTemplateArray: any = [];
  public presetadCreativeTemplateObject: any = {};
  public adCreativeSaveTemplateArray: any = [];

  //New Article
  public articleObject: any;

  public articleSEOScoreArray: any = {
    seoScore: 56,
    feedbackArray: [
      {
        tag: 'Page Title Score',
        feedback: [
          'Your content contains a Title tag',
          'Your Title tag is the perfect length',
          'You should use your focus keyword: "data potential, engineering journey, potential unleashing" in your Title tag',
          'You should use your focus keyword at the beginning of your Title tag',
        ],
        score: 32.85,
      },
      {
        tag: 'Meta Description Score',
        feedback: [
          'Your content contains a Meta description',
          'Your Meta description is too short, a minimum of 100 characters is recommended',
          'You should use your focus keyword: "data potential, engineering journey, potential unleashing" in your Meta description',
          'You should use focus keyword at the beginning of your Meta description tag',
        ],
        score: 4.1245,
      },
      {
        tag: 'Page Headings Score',
        feedback: [
          'Your content contains a H1 tag',
          'You should use your focus keyword: "data potential, engineering journey, potential unleashing" in your H1 tag',
        ],
        score: 7.3,
      },
      {
        tag: 'Content Length Score',
        feedback: [
          'Great! Your content contains enough words to perform well in search engines',
        ],
        score: 50,
      },
      {
        tag: 'On Page Links Score',
        feedback: ['Your content contains less than 2 links'],
        score: 0,
      },
      {
        tag: 'Image Analysis Score',
        feedback: [
          'You should add an Image to your content',
          'You should use your focus keyword: "data potential, engineering journey, potential unleashing" in your image Name',
          'You should use your focus keyword: "data potential, engineering journey, potential unleashing" in your image ALT Tag',
        ],
        score: 0,
      },
      {
        tag: 'Keyword Usage Score',
        feedback: [
          "Great! You've used your focus keyword 0 times in the content of your page",
        ],
        score: 90,
      },
    ],
  };


  public articleCTALayoutObj: any;

  refreshIntegrationData: any = new Subject();
  refreshAccountSettingData: any = new Subject();
  refreshDashbaordData: any = new Subject();
  refreshPlayIntroData: any = new Subject();
  refreshAIVideoData: any = new Subject();
  refreshProspectData: any = new Subject();
  refreshProspectList: any = new Subject();
  refreshProspects: any = new Subject();
  refreshDiscoverEmail: any = new Subject();

  public PLAN = {
    TRY_IT_ON: '65a8011c9374a1eeaab60d1b',
    YOUR_GROWING: '65a8010b9374a1eeaab60d1a',
    MASTER: '65a800e39374a1eeaab60d19',
  };

  public SUBSCRIPTION_STATUS = {
    TRIAL: 'trial',
    ACTIVE: 'active',
    CANCEL: 'cancel',
    PAST_DUE: 'past_due',
  };

  public CANCEL_REASON = {
    PAYMENT_FAILED: 'PaymentFailed',
    TRIAL_END: 'TrialEnd',
    BY_USER: 'ByUser',
    BY_ADMIN: 'ByAdmin',
  };

  constructor(private http: HttpClient, private socketService: SocketService) {
    this.socketService.onEvent('integrationDataEvent', async (data) => {
      console.log('integrationDataEvent Received data from server:', data);

      if (data?.dataStatus == true) {
        this.refreshIntegrationData.next({ status: true });
      } else {
        this.refreshIntegrationData.next({ status: false });
      }
    });

    this.socketService.onEvent('postDataEvent', async (data) => {
      console.log('postDataEvent Received data from server:', data);

      if (data?.dataStatus == true) {
        this.refreshDashbaordData.next({ status: true });
      } else {
        this.refreshDashbaordData.next({ status: false });
      }
    });

    this.socketService.onEvent('videoGeneratedDataEvent', async (data) => {
      console.log('videoGeneratedDataEvent Received data from server:', data);

      this.refreshAIVideoData.next({ status: true, data: data });
    });

    this.socketService.onEvent('prospectDataEvent', async (data) => {
      console.log('prospectDataEvent Received data from server:', data);

      if (data?.dataStatus == true) {
        this.refreshProspectData.next({ status: true });
      } else {
        this.refreshProspectData.next({ status: false });
      }
    });

    this.socketService.onEvent('discoverEmailEvent', async (data) => {
      console.log('discoverEmailEvent Received data from server:', data);

      this.refreshDiscoverEmail.next({ data: data });
    });
  }

  sendEventToServer(eventName: string, data: any): void {
    this.socketService.emitEvent(eventName, data);
  }

  logout() {
    this.sendEventToServer('logoutEvent', {
      message: this.userData?._id?.toString(),
    });

    localStorage.clear();
    window.location.href = '/auth/login';
  }

  //Global Get, Post, Put and Delete
  /**
   * FUNCTION: COMMON GET HTTP REQUEST
   * @param {STRING} endpoint
   * @param {Object} data
   * @param {Object} headers
   * @returns HTTP GET CALL RESPONSE
   */
  globalGetService(endpoint: string, headers?: any) {
    let httpPostReq = this.http.get(endpoint);
    if (headers) httpPostReq = this.http.get(endpoint, headers);
    return httpPostReq.pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  }

  /**
   * FUNCTION: COMMON POST HTTP REQUEST
   * @param {STRING} endpoint
   * @param {Object} data
   * @param {Object} headers
   * @returns HTTP POST CALL RESPONSE
   */
  globalPostService(endpoint: string, data?: any, headers?: any) {
    let httpPostReq = this.http.post(endpoint, data);
    if (headers) httpPostReq = this.http.post(endpoint, data, headers);
    return httpPostReq.pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  }

  /**
   * FUNCTION: COMMON PUT HTTP REQUEST
   * @param {STRING} endpoint
   * @param {Object} data
   * @returns HTTP PUT CALL RESPONSE
   */
  globalPutService(endpoint: string, data: any) {
    return this.http.put(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  }

  /**
   * FUNCTION: COMMON DELETE HTTP REQUEST
   * @param {STRING} endpoint
   * @returns HTTP DELETE CALL RESPONSE
   */
  globalDeleteService(endpoint: string) {
    return this.http.delete(endpoint).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  }

  manageCredit(creditType: boolean, credit: number) {
    let currentCredit = Number(this.userData?.subscription?.credit) || 0;
    if (creditType) {
      this.userData.subscription.credit = currentCredit + credit;
    } else {
      this.userData.subscription.credit = currentCredit - credit;
    }
  }
}
