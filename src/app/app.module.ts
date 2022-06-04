import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { MatSliderModule } from "@angular/material/slider";
import { MaterialModules } from "./materialModule";
import { HttpClientModule } from "@angular/common/http";
import { AppService } from "./services/app.service";
import { HashLocationStrategy, LocationStrategy } from "@angular/common";
import { NavComponent } from './component/nav/nav.component';
import { SeMedComponent } from './pages/se-med/se-med.component';
import { ElMedComponent } from './pages/el-med/el-med.component';

@NgModule({
  declarations: [AppComponent, NavComponent, SeMedComponent, ElMedComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSliderModule,
    MaterialModules,
    HttpClientModule,
  ],
  providers: [
    AppService,
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
