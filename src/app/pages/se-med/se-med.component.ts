import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { AppService } from "src/app/services/app.service";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import Swal from "sweetalert2";

@Component({
  selector: "app-se-med",
  templateUrl: "./se-med.component.html",
  styleUrls: ["./se-med.component.scss"],
})
export class SeMedComponent implements OnInit {
  @ViewChild("swiperSE") swiperSE!: ElementRef;
  @ViewChild("swiperPP") swiperPP!: ElementRef;

  public focusDrug: any;
  public focusAmount: any;
  public tab: any;

  public selectedRowOutSE: any;
  public listOutSE: Array<any> = [];
  public dataOutSE: any = null;
  @ViewChild("sortOutSE") sortOutSE!: MatSort;
  @ViewChild("paginatorOutSE") paginatorOutSE!: MatPaginator;
  public displayOutSE: string[] = [
    "drugCode",
    "drugName",
    "packageRatio",
    "drugLocation",
    "amount",
    "options",
  ];

  public selectedRowInSE: any;
  public listInSE: Array<any> = [];
  public dataInSE: any = null;
  @ViewChild("sortInSE") sortInSE!: MatSort;
  @ViewChild("paginatorInSE") paginatorInSE!: MatPaginator;
  public displayInSE: string[] = [
    "drugCode",
    "drugName",
    "packageRatio",
    "Maximum",
    "Quantity",
  ];

  public selectedRowPPStock: any;
  public listPrePackStock: Array<any> = [];
  public dataPrePackStock: any = null;
  @ViewChild("sortPrePackStock") sortPrePackStock!: MatSort;
  @ViewChild("paginatorPrePackStock") paginatorPrePackStock!: MatPaginator;
  public displayPrePackStock: string[] = [
    "drugCode",
    "drugName",
    "packageRatio",
    "Quantity",
  ];

  public listLot: Array<any> = [];
  public dataLot: any = null;
  @ViewChild("sortLot") sortLot!: MatSort;
  @ViewChild("paginatorLot") paginatorLot!: MatPaginator;
  public displayLot: string[] = ["LOT_NO", "EXP_Date", "Quantity"];

  constructor(public services: AppService, private http: HttpClient) {}

  ngOnInit(): void {
    this.getOutSE();
    this.tab = 0;
    setTimeout(() => {
      this.swiperSE.nativeElement.focus();
    }, 0);
  }

  public getTab = async (data: any) => {
    // console.log(data.index);
    if (data.index == 0) {
      this.tab = 0;
      this.getOutSE();
      setTimeout(() => {
        this.swiperSE.nativeElement.focus();
      }, 0);
    } else if (data.index == 1) {
      this.tab = 1;
      this.getInSE();
    } else {
      this.tab = 2;
      this.getPrePackStock();
      setTimeout(() => {
        this.swiperPP.nativeElement.focus();
      }, 0);
    }
  };

  public getOutSE = async () => {
    this.listOutSE = [];
    this.dataOutSE = [];
    this.http
      .get(`${environment.apiUrl}RobotINVS/outSE`)
      .toPromise()
      .then((val: any) => {
        if (val["rowCount"] > 0) {
          // console.log(val);
          this.listOutSE = val["result"];
          // console.log(this.listOutSE);
          this.dataOutSE = new MatTableDataSource(this.listOutSE);
          this.dataOutSE.sort = this.sortOutSE;
          this.dataOutSE.paginator = this.paginatorOutSE;
        }
      })
      .catch((reason) => {
        console.log(reason);
        this.services.alert("error", "ไม่สามารถเขื่อมต่อเชิฟเวอร์ได้", "");
      })
      .finally(() => {
        if (this.listOutSE.length > 0) {
          this.selectDrug(this.listOutSE[0]);
        }
      });
  };

  public selectDrug = async (data: any) => {
    this.listLot = [];
    this.dataLot = [];
    // console.log(data);
    this.selectedRowOutSE = data["indexrow"];
    this.focusDrug = data["drugName"];
    this.focusAmount = data["amount"];
    let drugData = new FormData();
    drugData.append("drugCode", data["drugCode"]);
    this.http
      .post(`${environment.apiUrl}RobotINVS/viewLot`, drugData)
      .toPromise()
      .then((val: any) => {
        // console.log(val);
        this.listLot = val["result"];
        // console.log(this.listLot);
        this.dataLot = new MatTableDataSource(this.listLot);
        this.dataLot.sort = this.sortLot;
        this.dataLot.paginator = this.paginatorLot;
      })
      .catch((reason) => {
        console.log(reason);
        this.services.alert(
          "error",
          "ไม่สามารถเชื่อมต่อกับเซิฟเวอร์ได้",
          "โปรดติดต่อผู้ดูแลระบบ"
        );
      })
      .finally(() => {});
  };

  public outSEFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataOutSE.filter = filterValue.trim().toLowerCase();
  }

  public sendBCode = async (data: any) => {
    let arrDrug: Array<any> = [];
    // console.log(data);
    let dataBCode = new FormData();
    dataBCode.append("bCode", data);
    this.http
      .post(
        `${environment.apiUrl}RobotINVS/drugBCode
      `,
        dataBCode
      )
      .toPromise()
      .then((val: any) => {
        // console.log(val);
        arrDrug = val["result"];
        // console.log(arrDrug);
      })
      .catch((reason) => {
        console.log(reason);
        this.services.alert(
          "error",
          "ไม่สามารถเชื่อมต่อกับเซิฟเวอร์ได้",
          "โปรดติดต่อผู้ดูแลระบบ"
        );
      })
      .finally(async () => {
        if (arrDrug.length > 0) {
          this.adjustSEStock(arrDrug);
        } else {
          this.services.alert(
            "error",
            "ไม่พบข้อมูล Barcode",
            "โปรดติดต่อผู้ดูแลระบบ"
          );
        }
      });
  };

  public sendDCode = async (data: any) => {
    console.log(data);
    let arrDrug: Array<any> = [];
    arrDrug.push(data);
    this.adjustSEStock(arrDrug);
  };

  public adjustSEStock = async (data: any) => {
    console.log(data);
    let arrLot: Array<any> = [];
    let selectData = new FormData();
    selectData.append("drugCode", data[0]["drugCode"]);
    this.http
      .post(`${environment.apiUrl}RobotINVS/lotSE`, selectData)
      .toPromise()
      .then((val: any) => {
        // console.log(val);
        arrLot = val["result"];
        console.log(arrLot);
      })
      .catch((reason) => {
        console.log(reason);
        this.services.alert(
          "error",
          "ไม่สามารถเชื่อมต่อกับเซิฟเวอร์ได้",
          "โปรดติดต่อผู้ดูแลระบบ"
        );
      })
      .finally(() => {});
    let { value: amount } = await Swal.fire({
      input: "number",
      title: data[0]["drugName"],
      text: "ใส่จำนวน",
      confirmButtonText: "ยืนยัน",
      confirmButtonColor: "#3085d6",
      allowOutsideClick: false,
      showCancelButton: true,
      cancelButtonText: "ยกเลิก",
      inputValidator: (value) => {
        return new Promise((resolve) => {
          if (value) {
            resolve("");
          } else {
            resolve("กรุณาใส่จำนวน");
          }
        });
      },
    });
    // console.log(amount);
    let finish = "f";
    arrLot.forEach((ei, i) => {
      if (finish == "f") {
        if (amount < arrLot[i]["Quantity"]) {
          arrLot[i]["Quantity"] = arrLot[i]["Quantity"] - amount;
          finish = "t";
        } else {
          amount = amount - arrLot[i]["Quantity"];
          arrLot[i]["Quantity"];
        }
        let fromSeStock = new FormData();
        fromSeStock.append("drugCode", arrLot[i]["drugCode"]);
        fromSeStock.append("LOT_NO", arrLot[i]["LOT_NO"]);
        fromSeStock.append("Quantity", arrLot[i]["Quantity"]);
        // fromSeStock.forEach((value, key) => {
        //   console.log(key + " : " + value);
        // });
        this.http
          .post(`${environment.apiUrl}RobotINVS/updateSEStock`, fromSeStock)
          .toPromise()
          .then((val: any) => {
            console.log(val);
          })
          .catch((reason) => {
            console.log(reason);
            this.services.alert(
              "error",
              "ไม่สามารถเชื่อมต่อกับเซิฟเวอร์ได้",
              "โปรดติดต่อผู้ดูแลระบบ"
            );
          })
          .finally(() => {});
      }
      if (finish == "t" || i == arrLot.length - 1) {
        this.getOutSE();
      }
    });
  };

  public getInSE = async () => {
    this.listInSE = [];
    this.dataInSE = [];
    this.http
      .get(`${environment.apiUrl}RobotINVS/inSE`)
      .toPromise()
      .then((val: any) => {
        if (val["rowCount"] > 0) {
          // console.log(val);
          this.listInSE = val["result"];
          // console.log(this.listInSE);
          this.dataInSE = new MatTableDataSource(this.listInSE);
          this.dataInSE.sort = this.sortInSE;
          this.dataInSE.paginator = this.paginatorInSE;
        }
      })
      .catch((reason) => {
        console.log(reason);
        this.services.alert("error", "ไม่สามารถเขื่อมต่อเชิฟเวอร์ได้", "");
      })
      .finally(() => {
        if (this.listOutSE.length > 0) {
          // this.selectDrug(this.listOutSE[0]);
        }
      });
  };

  public inSEFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataInSE.filter = filterValue.trim().toLowerCase();
  }

  public getPrePackStock = async () => {
    this.listPrePackStock = [];
    this.dataPrePackStock = [];
    this.http
      .get(`${environment.apiUrl}RobotINVS/prepackStock`)
      .toPromise()
      .then((val: any) => {
        if (val["rowCount"] > 0) {
          // console.log(val);
          this.listPrePackStock = val["result"];
          // console.log(this.listPrePackStock);
          this.dataPrePackStock = new MatTableDataSource(this.listPrePackStock);
          this.dataPrePackStock.sort = this.sortPrePackStock;
          this.dataPrePackStock.paginator = this.paginatorPrePackStock;
        }
      })
      .catch((reason) => {
        console.log(reason);
        this.services.alert("error", "ไม่สามารถเขื่อมต่อเชิฟเวอร์ได้", "");
      })
      .finally(() => {
        if (this.listOutSE.length > 0) {
          this.selectPrePack(this.listPrePackStock[0]);
        }
      });
  };

  public prepackFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataPrePackStock.filter = filterValue.trim().toLowerCase();
  }

  public selectPrePack = async (data: any) => {
    // console.log(data);
    this.selectedRowPPStock = data["indexrow"];
    this.focusDrug = data["drugName"];
    this.focusAmount = data["amount"];
    let drugData = new FormData();
    drugData.append("drugCode", data["drugCode"]);
    this.http
      .post(`${environment.apiUrl}RobotINVS/viewLot`, drugData)
      .toPromise()
      .then((val: any) => {
        // console.log(val);
        this.listLot = val["result"];
        // console.log(this.listLot);
        this.dataLot = new MatTableDataSource(this.listLot);
        this.dataLot.sort = this.sortLot;
        this.dataLot.paginator = this.paginatorLot;
      })
      .catch((reason) => {
        console.log(reason);
        this.services.alert(
          "error",
          "ไม่สามารถเชื่อมต่อกับเซิฟเวอร์ได้",
          "โปรดติดต่อผู้ดูแลระบบ"
        );
      })
      .finally(() => {});
  };
}
