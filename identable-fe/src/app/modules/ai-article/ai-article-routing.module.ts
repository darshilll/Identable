import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// COMPONENT
import { ArticleGenerationComponent } from './article-generation/article-generation.component';

const routes: Routes = [
  {
    path: '',
    component:ArticleGenerationComponent,    
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AiArticleRoutingModule { }
