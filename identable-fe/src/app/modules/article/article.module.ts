import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// LIBRARY
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TagInputModule } from 'ngx-chips';

// MODULE
import { ArticleRoutingModule } from './article-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// COMPONENT
import { ArticleListComponent } from './article-list/article-list.component';
import { ArticleCreateComponent } from './article-create/article-create.component';
import { ArticleLayoutOptionComponent } from './article-layout-option/article-layout-option.component';
import { ArticleCtaSettingComponent } from './article-cta-setting/article-cta-setting.component';
import { CoverImageSettingComponent } from './dialog/cover-image-setting/cover-image-setting.component';
import { AddArticleLinkComponent } from './dialog/add-article-link/add-article-link.component';
import { AddSubTopicComponent } from './dialog/add-sub-topic/add-sub-topic.component';
import { ArticleEditorComponent } from './article-editor/article-editor.component';
import { IdeaSuggestionComponent } from './dialog/idea-suggestion/idea-suggestion.component';
import { ArticlePreviewComponent } from './dialog/article-preview/article-preview.component';
import { ArticleSaveComponent } from './dialog/article-save/article-save.component';

@NgModule({
  declarations: [
    ArticleListComponent,
    ArticleCreateComponent,    
    ArticleLayoutOptionComponent,  
    ArticleCtaSettingComponent, CoverImageSettingComponent, AddArticleLinkComponent, AddSubTopicComponent, ArticleEditorComponent, IdeaSuggestionComponent, ArticlePreviewComponent, ArticleSaveComponent
  ],
  imports: [
    CommonModule,
    ArticleRoutingModule,
    TagInputModule,    
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    DragDropModule,
  ]
})
export class ArticleModule { }
