import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DesignControlService {

  private selectedLayoutSource = new BehaviorSubject<string>(''); // default layout
  selectedLayout$ = this.selectedLayoutSource.asObservable();

  // Using BehaviorSubject to store generated AI content data

    private ideaContentSource = new BehaviorSubject<{
      choiceTemplatesId: string;
      themeType: string;
      content: any[];
      carouselName: string;
      carouselIdea: string;
      carouselLength: number;
      genratedType: string;
      isGenratedFirst: boolean;
      isEditable: boolean,
    }>({
      choiceTemplatesId: '',
      themeType: '', 
      content: [],
      carouselName: '',
      carouselIdea: '',
      carouselLength: 3,
      genratedType: '',
      isGenratedFirst: false,
      isEditable: false
    });
  aiIdeanContent$ = this.ideaContentSource.asObservable();

  // Template Settings

  private settingsSubject = new BehaviorSubject<any>({});
  templateSettings$ = this.settingsSubject.asObservable();

  constructor() {}

  // Update the template setting

  updateTemplateSettings(setting: any) {
    const currentSettings = this.settingsSubject.value;
    const updatedSettings = { ...currentSettings, ...setting };
    this.settingsSubject.next(updatedSettings);
  }
  
  updateSlideLayout(newColor: string) {
    this.selectedLayoutSource.next(newColor);
  }

  // Method to set AI-generated content
  
  setCarouselIdeaContent(data: {
    choiceTemplatesId: string;
    themeType: string;
    content: any[];
    carouselName: string;
    carouselIdea: string;
    carouselLength: number;
    genratedType:any;
    isGenratedFirst: boolean;
    isEditable: boolean,
  }) {
    this.ideaContentSource.next(data);
  }

  // Method to get AI-generated content (if needed directly)
  getCarouselIdeaContent() {
    return this.ideaContentSource.getValue();
  }
}
