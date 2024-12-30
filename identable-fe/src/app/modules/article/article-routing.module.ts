import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ArticleCreateComponent } from './article-create/article-create.component';
import { ArticleListComponent } from './article-list/article-list.component';
import { ArticleEditorComponent } from './article-editor/article-editor.component';
import { ArticleLayoutOptionComponent } from './article-layout-option/article-layout-option.component';
import { ArticleCtaSettingComponent } from './article-cta-setting/article-cta-setting.component';

const routes: Routes = [
  {
    path: '',
    component: ArticleListComponent,
  },
  {
    path: 'createarticle',
    component: ArticleCreateComponent,
  },
  {
    path: 'editarticle',
    component: ArticleEditorComponent,
  },
  {
    path: 'layout',
    component: ArticleLayoutOptionComponent,
  },
  {
    path: 'cta',
    component: ArticleCtaSettingComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ArticleRoutingModule {}
