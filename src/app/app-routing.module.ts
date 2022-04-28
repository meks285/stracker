import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'landing',
    loadChildren: () => import('./services/landing/landing.module').then( m => m.LandingPageModule)
  },
  {
    path: 'create-manifest',
    loadChildren: () => import('./pages/create-manifest/create-manifest.module').then( m => m.CreateManifestPageModule)
  },
  {
    path: 'track-manifest',
    loadChildren: () => import('./pages/track-manifest/track-manifest.module').then( m => m.TrackManifestPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./services/landing/register/register.module').then( m => m.RegisterPageModule)
  }
  ,
  {
    path: 'login',
    loadChildren: () => import('./services/landing/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'dispatch-manifest',
    loadChildren: () => import('./pages/dispatch-manifest/dispatch-manifest.module').then( m => m.DispatchManifestPageModule)
  },
  {
    path: 'receive-manifest',
    loadChildren: () => import('./pages/receive-manifest/receive-manifest.module').then( m => m.ReceiveManifestPageModule)
  },
  {
    path: 'splash',
    loadChildren: () => import('./splash/splash.module').then( m => m.SplashPageModule)
  },
  {
    path: 'return-result',
    loadChildren: () => import('./pages/return-result/return-result.module').then( m => m.ReturnResultPageModule)
  },
  {
    path: 'dispatch-result',
    loadChildren: () => import('./pages/dispatch-result/dispatch-result.module').then( m => m.DispatchResultPageModule)
  },
  {
    path: 'recieve-result',
    loadChildren: () => import('./pages/recieve-result/recieve-result.module').then( m => m.RecieveResultPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
