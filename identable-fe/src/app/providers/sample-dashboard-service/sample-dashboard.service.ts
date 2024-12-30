import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SampleDashboardService {

  constructor() { }

  public getDashboardSampleData() {

    const sampleStatsData = {
      "followerStats": {
          "_id": null,
          "username": null,
          "page_id": null,
          "typeStats": "profile",
          "userFlowers": [
              {
                  "week_startDate": "2023-07-02T17:30:31.139Z",
                  "week_endDate": "2023-07-08T17:30:31.139Z",
                  "totalConnection": "36",
                  "totalFollowers": "39",
                  "uniqueVisitors": null,
                  "searchAppearances": null,
                  "_id": "64e793b7ba1ca564285aaf43"
              },
              {
                  "week_startDate": "2023-07-09T16:47:37.649Z",
                  "week_endDate": "2023-07-15T16:47:37.649Z",
                  "totalConnection": "46",
                  "totalFollowers": "49",
                  "uniqueVisitors": null,
                  "searchAppearances": null,
                  "_id": "64e0f22544093118e2b511e8"
              },
              {
                  "week_startDate": "2023-07-16T11:24:18.342Z",
                  "week_endDate": "2023-07-22T11:24:18.342Z",
                  "totalConnection": "56",
                  "totalFollowers": "59",
                  "uniqueVisitors": null,
                  "searchAppearances": null,
                  "_id": "64d8bd6236f8e27af3175220"
              },
              {
                "week_startDate": "2023-07-23T11:24:18.342Z",
                "week_endDate": "2023-07-29T11:24:18.342Z",
                "totalConnection": "66",
                "totalFollowers": "69",
                "uniqueVisitors": null,
                "searchAppearances": null,
                "_id": "64d8bd6236f8e27af3175220"
              },
              {
                "week_startDate": "2023-07-30T11:24:18.342Z",
                "week_endDate": "2023-08-05T11:24:18.342Z",
                "totalConnection": "77",
                "totalFollowers": "79",
                "uniqueVisitors": null,
                "searchAppearances": null,
                "_id": "64d8bd6236f8e27af3175220"
              }
          ]
      },
      "postStats": {
          "_id": null,
          "username": null,
          "page_id": null,
          "typeStats": "profile",
          "postStats": [
              {
                  "week_startDate": "2023-07-02T17:30:31.139Z",
                  "week_endDate": "2023-07-08T17:30:31.139Z",
                  "totalLike": 150,
                  "totalPost": 10,
                  "totalComment": 90,
                  "totalImpression": 200,
                  "repostCount": 10,
                  "_id": "64e793b7ba1ca564285aaf4b"
              },
              {
                  "week_startDate": "2023-07-09T16:47:37.649Z",
                  "week_endDate": "2023-07-15T16:47:37.649Z",
                  "totalLike": 350,
                  "totalPost": 15,
                  "totalComment": 58,
                  "totalImpression": 200,
                  "repostCount": 25,
                  "_id": "64e0f22944093118e2b511f7"
              },
              {
                  "week_startDate": "2023-07-16T11:24:18.342Z",
                  "week_endDate": "2023-07-22T11:24:18.342Z",
                  "totalLike": 55,
                  "totalPost": 25,
                  "totalComment": 200,
                  "totalImpression": 350,
                  "repostCount": 20,
                  "_id": "64d8bd6236f8e27af3175224"
              },
              {
                "week_startDate": "2023-07-23T11:24:18.342Z",
                "week_endDate": "2023-07-29T11:24:18.342Z",
                "totalLike": 500,
                "totalPost": 35,
                "totalComment": 350,
                "totalImpression": 550,
                "repostCount": 30,
                "_id": "64d8bd6236f8e27af3175224"
              },
              {
                "week_startDate": "2023-07-30T11:24:18.342Z",
                "week_endDate": "2023-08-05T11:24:18.342Z",
                "totalLike": 75,
                "totalPost": 45,
                "totalComment": 450,
                "totalImpression": 750,
                "repostCount": 40,
                "_id": "64d8bd6236f8e27af3175224"
              }
          ]
      },
      "statsReport": {
          "likePercentage": 100,
          "commentPercentage": 100,
          "impressionPercentage": 100,
          "repostPercentage": 100,
          "postPercentage": 100,
          "sumToatalFollowers": 2420,
          "sumToatalConnection": 316
      }
    };

    const samplePostData = [
      {
          "post_id": "7097213447037173760",
          "text": "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
          "image": "assets/images/demo-img.png",
          "video": "",
          "like_count": 155,
          "comments_count": 160,
          "repost_count": 10,
          "inpressions_count": "1280",
          "post_time": 1692107545623,
          "comments": []
      },
      {
          "post_id": "7096914467770241024",
          "text": "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
          "image": "assets/images/demoimg-1.jpg",
          "video": "",
          "like_count": 155,
          "comments_count": 160,
          "repost_count": 10,
          "inpressions_count": "1280",
          "post_time": 1692107545623,
          "comments": []
      },
      {
          "post_id": "7096893585026953216",
          "text": "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
          "image": "assets/images/demoimg-2.jpg",
          "video": "",
          "like_count": 155,
          "comments_count": 160,
          "repost_count": 10,
          "inpressions_count": "1280",
          "post_time": 1692107545623,
          "comments": []
      },
      {
          "post_id": "7096504007765979136",
          "text": "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
          "image": "assets/images/demo-img.png",
          "video": "",
          "like_count": 155,
          "comments_count": 160,
          "repost_count": 10,
          "inpressions_count": "1280",
          "post_time": 1692107545623,
          "comments": []
      },
      {
          "post_id": "7096503761837133824",
          "text": "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
          "image": "assets/images/demoimg-1.jpg",
          "video": "",
          "like_count": 155,
          "comments_count": 160,
          "repost_count": 10,
          "inpressions_count": "1280",
          "post_time": 1692107545623,
          "comments": []
      },
      {
          "post_id": "7086722252557217792",
          "text": "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
          "image": "assets/images/demoimg-2.jpg",
          "video": "",
          "like_count": 155,
          "comments_count": 160,
          "repost_count": 10,
          "inpressions_count": "1280",
          "post_time": 1692107545623,
          "comments": []
      },
      {
          "post_id": "7086722078678155265",
          "text": "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
          "image": "assets/images/demo-img.png",
          "video": "",
          "like_count": 155,
          "comments_count": 160,
          "repost_count": 10,
          "inpressions_count": "1280",
          "post_time": 1692107545623,
          "comments": []
      },
      {
        "post_id": "7086722078678155265",
        "text": "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
        "image": "assets/images/demo-img.png",
        "video": "",
        "like_count": 155,
        "comments_count": 160,
        "repost_count": 10,
        "inpressions_count": "1280",
        "post_time": 1692107545623,
        "comments": []
      },
      {
        "post_id": "7086722078678155265",
        "text": "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
        "image": "assets/images/demo-img.png",
        "video": "",
        "like_count": 155,
        "comments_count": 160,
        "repost_count": 10,
        "inpressions_count": "1280",
        "post_time": 1692107545623,
        "comments": []
      },                  
    ]
    return { 
      sampleStatsData: sampleStatsData,
      samplePostData: samplePostData,
      totalPost: 124,
      totalLike: 300,
      totalComment: 500,
      totalRepost: 600,
    };    
  }

}
