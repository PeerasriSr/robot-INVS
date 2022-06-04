import { Component, OnInit } from "@angular/core";
import { AppService } from "src/app/services/app.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-nav",
  templateUrl: "./nav.component.html",
  styleUrls: ["./nav.component.scss"],
})
export class NavComponent implements OnInit {
  public page: any;

  constructor(public services: AppService, private http: HttpClient) {}

  ngOnInit(): void {
    this.page = 'se'
  }

  public selectPage = async (data: any) => {
    if (this.page != data) {
      this.page = data;
    }
  };
}
