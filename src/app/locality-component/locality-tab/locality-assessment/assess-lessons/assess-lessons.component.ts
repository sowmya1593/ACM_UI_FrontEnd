import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { ApiserviceService } from '../../../../apiservice.service';
import { UtilService } from '../../../../util.service';
import { AppAudit } from '../../../../data.model.auditDTO';
import { Http, HttpModule, Headers, RequestOptions } from '@angular/http';
import { APP_CONFIG } from '../../../../app.config';
import { IMyDate, IMyDpOptions } from 'mydatepicker';
import { Router, ActivatedRoute, Params } from '@angular/router';
import * as moment from 'moment';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { AppAssess, AssessmentPolicyDTO, Policy } from '../../../../data.model.assessmentDTO';
@Component({
  selector: 'app-assess-lessons',
  templateUrl: './assess-lessons.component.html',
  styleUrls: ['./assess-lessons.component.css']
})
export class AssessLessonsComponent implements OnInit {
  @ViewChild('content') content: TemplateRef<any>;
  appAssess: AppAssess;
  public loading: boolean = false;
  public info: any;
  public showSave: boolean = false;
  public editData: any;
  public startDate:any;
  public endDate:any;
  public showEdit: boolean = false;
  public showForm: boolean = true;
  constructor(private _apiservice: ApiserviceService,
    private utilService: UtilService, private http: Http, private route: ActivatedRoute,
    private router: Router, private modalService: NgbModal, private datepipe: DatePipe) {
      this.appAssess = new AppAssess();
      this.getAppId();
     }

  ngOnInit() {
  }


  getAppId() {
    this.loading = true;
      this._apiservice.viewApplication(localStorage.getItem('localityName'))
        .subscribe((data: any) => {
          this.loading = false;
          this.appAssess.applicationID = data.applicationViewDTO.applicationId;
          this.showOnPageLoad();
        }, error => 
        
        {
          this.loading = false;
          console.log(error);}
        );
      }
  
      showOnPageLoad()
      {
        if(localStorage.getItem('assesId') === null)
        {
          console.log('Not edit mode');
        }
        else{
          let id =localStorage.getItem('assesId');
          let auid = +id;
          this.showEdit = true;
        this.loading = true;
        this._apiservice.getAssessData(auid)
        .subscribe((data: any) => {
          this.loading = false;
          this.appAssess = data;
        
        if(this.appAssess.lessonsEnteredDate === null)
        {
          this.endDate = {date:null};
        }else{
        let dt = new Date(this.appAssess.lessonsEnteredDate);
        let day1 = dt.getDate();
        let month1 = dt.getMonth()+1;
        let year1 = dt.getFullYear();
        this.endDate = {date:{year: year1, month: month1, day: day1}};
        }
  
      } , error => {
        this.loading = false;
        console.log(error);
      });
      
    }
  }
  
    saveLessons()
    {
      let ngbModalOptions: NgbModalOptions = {
        backdrop : 'static',
        keyboard : false
        };
      this.loading = true;
      const headers = new Headers();
      headers.append('Content-Type', 'application/json');
      let options = new RequestOptions({ headers: headers });
      let url_update = APP_CONFIG.updateAppAssessment;
      let data = JSON.stringify(this.appAssess);
      this.http.post(url_update,data,options)
          .subscribe((data: any) => {
            this.loading = false;
            this.info="Lessons Learned has been updated.";
            this.modalService.open(this.content,ngbModalOptions);
          }, error => {
            this.loading = false;
            console.log(error);
          });
    }
    
    getEnteredBy(value)
      {
        console.log(value);
        if (value.formatted === "") {
          
        }
        else {
          let d = value.formatted;
          let latest_date =this.datepipe.transform(d, 'yyyy-MM-dd');
          //this.audate = Date.parse(d);
          //this.appAssess.actionPlanStartDt = moment(latest_date).format();;
        }
        
      }
  
       
    getEnteredDate(value)
    {
      console.log(value);
      if (value.formatted === "") {
        
      }
      else {
        let d = value.formatted;
        let latest_date =this.datepipe.transform(d, 'yyyy-MM-dd');
        //this.audate = Date.parse(d);
        this.appAssess.lessonsEnteredDate = moment(latest_date).format();
      }
      
    }

    valueChanged() {
      this.showForm = false;
      this.showSave = true;
      this.showEdit = false;
    }

    showLeft(){
      this.router.navigate(['locality/tab/assessment']);
      }
  

}
