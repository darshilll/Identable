import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../providers/guard/auth.guard';
import { LazyGuard } from '../providers/guard/lazy.guard';
import { VerifyAuthComponent } from '../auth/verify-auth/verify-auth.component';

const routes: Routes = [
  // linkedin dashboard
  {
    path: 'linkedin-dashboard',
    canLoad: [LazyGuard],
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
    data: { title: 'Dashboard Modules' },
  },

  //linkedin Dashboard
  {
    path: 'dashboard',
    canLoad: [LazyGuard],
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./linkedin-dashboard/linkedin-dashboard.module').then(
        (m) => m.LinkedinDashboardModule
      ),
    data: { title: 'Linkedin Dashboard Modules' },
  },

  // Billing
  {
    path: 'billing',
    canLoad: [LazyGuard],
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./billing/billing.module').then((m) => m.BillingModule),
    data: { title: 'Billing Modules' },
  },

  // Onboarding
  {
    path: 'onboarding',
    canLoad: [LazyGuard],
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./onboarding/onboarding.module').then(
        (m) => m.OnboardingModule
      ),
    data: { title: 'Onboarding Modules' },
  },

  // Account Setting
  {
    path: 'account-setting',
    canLoad: [LazyGuard],
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./accountsetting/accountsetting.module').then(
        (m) => m.AccountsettingModule
      ),
    data: { title: 'Account Modules' },
  },

  // Engage Setting
  {
    path: 'engage',
    canLoad: [LazyGuard],
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./engage/engage.module').then((m) => m.EngageModule),
    data: { title: 'Engage Modules' },
  },

  // Explanatory Video
  {
    path: 'explanatory-video',
    canLoad: [LazyGuard],
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./explanatory-video/explanatory-video.module').then((m) => m.ExplanatoryVideoModule),
    data: { title: 'Explanatory Video Modules' },
  },

  // Engage Setting
  {
    path: 'oneclick',
    canLoad: [LazyGuard],
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./one-click/one-click.module').then((m) => m.OneClickModule),
    data: { title: 'Oneclick Modules' },
  },

  // Ai Carousel
  {
    path: 'carousels',
    canLoad: [LazyGuard],
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./carousel/carousel.module').then((m) => m.CarouselModule),
    data: { title: 'Carousel Modules' },
  },

  // Visual Creative
  {
    path: 'visual-creative',
    canLoad: [LazyGuard],
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./visual-creatives/visual-creatives.module').then(
        (m) => m.VisualCreativesModule
      ),
    data: { title: 'Visual creative' },
  },

  // Brand Kit

  {
    path: 'brand-kit',
    canLoad: [LazyGuard],
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./brand-kit/brand-kit.module').then((m) => m.BrandKitModule),
    data: { title: 'Brand creative' },
  },

  // Ai Article
  {
    path: 'ai-article',
    canLoad: [LazyGuard],
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./ai-article/ai-article.module').then((m) => m.AiArticleModule),
    data: { title: 'Ai Article' },
  },

  // Ai Article
  {
    path: 'ai-image',
    canLoad: [LazyGuard],
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./ai-image/ai-image.module').then((m) => m.AiImageModule),
    data: { title: 'Ai Image' },
  },
  
  // Ai Article
  { 
    path: 'article',
    canLoad: [LazyGuard],
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./article/article.module').then((m) => m.ArticleModule),
    data: { title: 'Article' },
  },

  // Evolve
  {
    path: 'evolve',
    canLoad: [LazyGuard],
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./evolve/evolve.module').then((m) => m.EvolveModule),
    data: { title: 'Evolve Modules' },
  },

  // CRM
  {
    path: 'crm',
    canLoad: [LazyGuard],
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./crmcampaign/crmcampaign.module').then(
        (m) => m.CRMCampaignModule
      ),
    data: { title: 'CRM Modules' },
  },

  // Subscription
  {
    path: 'subscription',
    canLoad: [LazyGuard],
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./subscription/subscription.module').then(
        (m) => m.SubscriptionModule
      ),
    data: { title: 'Subscription Modules' },
  },

  {
    path: 'linkedin-verify-authentication',
    component: VerifyAuthComponent,
  },

  // Admin
  {
    path: 'admin',
    canLoad: [LazyGuard],
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./admin/admin.module').then((m) => m.AdminModule),
    data: { title: 'Admin' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModulesRoutingModule {}
