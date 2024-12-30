import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AiArticleRoutingModule } from './ai-article-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// COMPONENT
import { ArticleGenerationComponent } from './article-generation/article-generation.component';

@NgModule({
  declarations: [ArticleGenerationComponent],
  imports: [
    CommonModule,
    AiArticleRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    DragDropModule,
  ],
})
export class AiArticleModule {}
