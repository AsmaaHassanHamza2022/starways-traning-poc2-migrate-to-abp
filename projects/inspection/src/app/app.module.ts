import { CoreModule } from '@abp/ng.core';
import { SettingManagementConfigModule } from '@abp/ng.setting-management/config';
import { DEFAULT_VALIDATION_BLUEPRINTS, ThemeSharedModule } from '@abp/ng.theme.shared';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommercialUiConfigModule } from '@volo/abp.commercial.ng.ui/config';
import { AccountAdminConfigModule } from '@volo/abp.ng.account/admin/config';
import { AccountPublicConfigModule } from '@volo/abp.ng.account/public/config';
import { AuditLoggingConfigModule } from '@volo/abp.ng.audit-logging/config';
import { OpeniddictproConfigModule } from '@volo/abp.ng.openiddictpro/config';
import { IdentityConfigModule } from '@volo/abp.ng.identity/config';
import { LanguageManagementConfigModule } from '@volo/abp.ng.language-management/config';
import { registerLocale } from '@volo/abp.ng.language-management/locale';
import { SaasConfigModule } from '@volo/abp.ng.saas/config';
import { TextTemplateManagementConfigModule } from '@volo/abp.ng.text-template-management/config';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { APP_ROUTE_PROVIDER } from './route.provider';
import { FeatureManagementModule } from '@abp/ng.feature-management';
import { AbpOAuthModule } from '@abp/ng.oauth';
import { ThemeLeptonXModule } from '@volosoft/abp.ng.theme.lepton-x';
import { SideMenuLayoutModule } from '@volosoft/abp.ng.theme.lepton-x/layouts';
import { VALIDATION_BLUEPRINTS } from "@ngx-validate/core";


@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    CoreModule.forRoot({
      environment,
      registerLocaleFn: registerLocale(),
    }),
    AbpOAuthModule.forRoot(),
    ThemeSharedModule.forRoot(),
    AccountAdminConfigModule.forRoot(),
    AccountPublicConfigModule.forRoot(),
    IdentityConfigModule.forRoot(),
    LanguageManagementConfigModule.forRoot(),
    SaasConfigModule.forRoot(),
    AuditLoggingConfigModule.forRoot(),
    OpeniddictproConfigModule.forRoot(),
    TextTemplateManagementConfigModule.forRoot(),
    SettingManagementConfigModule.forRoot(),

    CommercialUiConfigModule.forRoot(),
    FeatureManagementModule.forRoot(),
    ThemeLeptonXModule.forRoot(),
    SideMenuLayoutModule.forRoot(),
  ],
  providers: [
    {
      provide: VALIDATION_BLUEPRINTS,
      useValue: {
        ...DEFAULT_VALIDATION_BLUEPRINTS,
        required: "::oops, Please not let the field empty :(",
        alphanumeric:"Invalid Input ,Entered data must be alphanumeric"
      },
    },
    APP_ROUTE_PROVIDER,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
function provideAbpThemeShared(
  arg0: any
): import('@angular/core').Provider | import('@angular/core').EnvironmentProviders {
  throw new Error('Function not implemented.');
}


