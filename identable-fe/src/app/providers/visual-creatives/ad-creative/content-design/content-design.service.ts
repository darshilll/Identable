import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ContentDesignService {
  // Using BehaviorSubject to store generated AI content data

  private cerativeContentSource = new BehaviorSubject<{
    choiceTemplatesId: string;
    themeType: string;
    content: {};
    title: string;
    genratedType: string;
    idea: string;
    isGenratedFirst: boolean;
    isEditable: boolean;
  }>({
    choiceTemplatesId: '',
    themeType: '',
    content: {},
    title: '',
    idea: '',
    genratedType: '',
    isGenratedFirst: false,
    isEditable: false,
  });
  genratedContent$ = this.cerativeContentSource.asObservable();

  constructor() {}

  // Method to set AI-generated content

  setAdCreativeContent(data: {
    choiceTemplatesId: string;
    themeType: string;
    content: {};
    title: string;
    idea: string;
    genratedType: any;
    isGenratedFirst: boolean;
    isEditable: boolean;
  }) {
    this.cerativeContentSource.next(data);
  }
}
