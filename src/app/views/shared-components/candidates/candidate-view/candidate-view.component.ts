import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { CandidateService } from '../candidate.service';
import { CommonService } from '../../../../services/common.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService } from 'primeng/api';
import { environment } from '../../../../../environments/environment';
import { DomSanitizer } from '@angular/platform-browser';
import { LightboxModule } from 'primeng/lightbox';
@Component({
  selector: 'app-candidate-view',
  templateUrl: './candidate-view.component.html',
  styleUrls: ['./candidate-view.component.scss']
})
export class CandidateViewComponent implements OnInit {

  id: any;
  candidate_detail: any = [];
  approval: boolean = false;
  userDetail: any = [];
  candidate_type = 'Approved';
  email: any;
  cancel_link1 = '/admin/candidates/new_candidate';
  cancel_link2 = '/admin/candidates/approved_candidate';
  image = environment.imageUrl;
  country: any;
  buttonValue: any;
  buttonValue1: any;
  documenttype: any;
  documentImage = false;
  docImages: any;
  DocumentSanitizer: any;
  show_spinner = false;
  constructor(
    private router: Router,
    private service: CandidateService,
    private route: ActivatedRoute,
    private commonService: CommonService,
    private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private confirmationService: ConfirmationService,
    private _sanitizer: DomSanitizer

  ) {
    this.spinner.show();
    this.userDetail = this.commonService.getLoggedUserDetail();
    if (this.activatedRoute.snapshot.data.type === 'new') {
      this.candidate_type = 'New';
    }

    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
    });
    this.docImages = [];

  }

  ngOnInit() {
    this.service.get_candidate_Detail(this.id).subscribe(res => {
      this.spinner.hide();
      this.candidate_detail = res['data'];
      this.email = this.candidate_detail['user_id']['email'];
      this.documenttype = this.candidate_detail['documenttype']['name'];
      this.country = this.candidate_detail['country'].country;

      if (res[`data`]['documentimage'][0]) {
        this.documentImage = true;

        const dc = this.image + res[`data`]['docimage'];

        this.docImages.push({
          source: `${dc}`, thumbnail: `${dc}`, title: this.candidate_detail['documenttype']['name']
        });

      } else {
        this.documentImage = false;
      }
      // if (this.candidate_detail.user_id.isAllow === false) {
      //   this.buttonValue = 'Approve';

      // } else {
      //   this.buttonValue1 = 'Cancel';
      // }
      // console.log(this.candidate_detail, this.email);
    }, (err) => {
      this.spinner.hide;
      this.toastr.error(err['error']['message'], 'Error!', { timeOut: 3000 });
    });
  }


  approve(id) {
    document.getElementById('approve').setAttribute('disabled', 'true');
    this.show_spinner = true;
    this.approval = true;
    const obj = {
      'id': id
    };
    this.confirmationService.confirm({
      message: 'Are you sure that you want to Approve this Candidate?',
      accept: () => {
        this.service.approved(obj).subscribe(res => {
          this.toastr.success(res['message'], 'Success!', { timeOut: 3000 });
          // this.rrerender();
          this.router.navigate([this.cancel_link1]);
        }, (err) => {
          this.show_spinner = false;
          this.toastr.error(err['error']['message'], 'Error!', { timeOut: 3000 });
        });
      }, reject: () => {
        this.show_spinner = false;
        document.getElementById('approve').removeAttribute('disabled');
      }
    });
  }

  async blobToBlobURL(blob) {
    console.log(' : hiii ==> ');
    window.URL = window.URL || window.webkitURL;
    const blobUrl = window.URL.createObjectURL(blob);
    console.log(' blobUrl:  ==> ', blobUrl);
    return blobUrl;
  }

  unapprove() {
    this.approval = false;
  }

}
