import { NgModule, ApplicationRef, CUSTOM_ELEMENTS_SCHEMA, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { removeNgStyles, createNewHosts } from '@angularclass/hmr';
import { TestGuard } from './guards/test.guard';
import { AuthGuard } from './guards/auth.guard';
import { AuthService } from './services/auth.service';
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { AppTitleService } from './services/app-title.service';
import { AppTranslationService, TranslateLanguageLoader } from './services/app-translation.service';
import { ConfigurationService } from './services/configuration.service';
import { LocalStoreManager } from './services/local-store-manager.service';
import { EndpointFactory } from './services/endpoint-factory.service';
import { NotificationService } from './services/notification.service';
import { NotificationEndpoint } from './services/notification-endpoint.service';
import { AccountService } from './services/account.service';
import { MaterialsModule } from "./shared/materials.module";
import { DragDropDirective } from './directives/drag-drop.directive';
import { Page404Component } from './page404/page404.component';
import { BottomSheetOverviewComponent } from './shared/bottom-sheet-overview/bottom-sheet-overview.component';
import { MomentModule } from 'ngx-moment';
import { HttpModule } from '@angular/http';
import { MyErrorHandler } from './my-error-handler';
import { FileUploaderService } from '@Project/services/file-uploader.service';
import { AutoCloseMobileNavDirective } from '@Project/layout/sidenav/auto-close-mobile-nav.directive';
import { RECAPTCHA_LANGUAGE } from 'ng-recaptcha';

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpModule,

    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useClass: TranslateLanguageLoader
      }
    }),

    // Sub modules
    SharedModule,
    MaterialsModule,
    MomentModule,
  ],
  declarations: [
    AppComponent,
    DragDropDirective,
    Page404Component,
    BottomSheetOverviewComponent,
    AutoCloseMobileNavDirective,
  ],
  entryComponents: [
    BottomSheetOverviewComponent,
  ],
  providers: [
    { provide: RECAPTCHA_LANGUAGE, useValue: 'tr', },
    { provide: ErrorHandler, useClass: MyErrorHandler },
    { provide: 'BASE_URL', useFactory: getBaseUrl },

    ConfigurationService,
    AppTitleService,
    AppTranslationService,
    NotificationService,
    NotificationEndpoint,
    AccountService,
    LocalStoreManager,
    EndpointFactory,
    FileUploaderService,

    AuthService,
    AuthGuard,
    TestGuard
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})

export class AppModule {
  constructor(public appRef: ApplicationRef) { }
  hmrOnInit(store) {
    console.log('HMR store', store);
  }
  hmrOnDestroy(store) {
    const cmpLocation = this.appRef.components.map((cmp) => cmp.location.nativeElement);
    // recreate elements
    store.disposeOldHosts = createNewHosts(cmpLocation);
    // remove styles
    removeNgStyles();
  }
  hmrAfterDestroy(store) {
    // display new elements
    store.disposeOldHosts();
    delete store.disposeOldHosts;
  }
}

export function getBaseUrl() {
  return document.getElementsByTagName('base')[0].href;
}