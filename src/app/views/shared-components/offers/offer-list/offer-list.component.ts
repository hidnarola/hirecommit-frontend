import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { SocketService } from '../../../../services/socket.service';
import { OfferService } from '../offer.service';
import { Router, Params, ActivatedRoute } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { ConfirmationService } from 'primeng/api';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { EmployerService } from '../../../employer/employer.service';

import { CandidateService } from '../../candidates/candidate.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalOptions } from '../../../../shared/modal_options';
import { ToastrService } from 'ngx-toastr';
// import { IfStmt } from '@angular/compiler';
// import { AnyARecord } from 'dns';
import * as moment from 'moment';
@Component({
  selector: 'app-offer-list',
  templateUrl: './offer-list.component.html',
  styleUrls: ['./offer-list.component.scss']
})
export class OfferListComponent implements OnInit, AfterViewInit, OnDestroy {

  checked1: boolean = true;
  @ViewChild('content1') content1: ElementRef;
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  // first_custom_field: any;
  first_custom_field = '';
  employer: any;
  salaryDuration: any;
  Info_msg: any;
  empId;
  userName: any;
  offerData: any = [];
  form = false;
  accept_btn: boolean = false;
  profileData: any = [];
  isNoCommit = false;
  message: any;
  d: any;
  Canididate_message: any;
  isAccept = false;
  offerID: any;
  // offer type options
  offer_type_optoins = [
    { label: 'Select Offer Type', value: '' },
    { label: 'No Commit', value: 'noCommit' },
    { label: 'Candidate Commit', value: 'candidateCommit' },
    { label: 'Both Commit', value: 'bothCommit' }
  ];
  hide_list = false;
  grpId: string;
  userDetail: any = [];
  adminRights = false;
  // hideAccept = false;
  selectedValue: string;

  constructor(
    private service: OfferService,
    private route: Router,
    private commonService: CommonService,
    private confirmationService: ConfirmationService,
    private socketService: SocketService,
    private spinner: NgxSpinnerService,
    private router: ActivatedRoute,
    private empService: EmployerService,
    private candidateService: CandidateService,
    private modalService: NgbModal,
    private toastr: ToastrService
  ) {
    this.userDetail = this.commonService.getLoggedUserDetail();
    if (this.userDetail.role === 'employer') {
      //   this.empService.check_approved(this.userDetail.id).subscribe(res => {

      //     if (res['status'] === 0 || res['status'] === 2) {
      this.hide_list = false;
      //     } else {
      //       this.hide_list = true;
      //       this.message = res['message'];
      //     }
      //   }, (err) => {
      //     console.log('err=>', err);
      //     // this.hide_list = true;
      //   });
    }

    if (this.userDetail.role === 'candidate') {
      this.candidateService.check_verified(this.userDetail.id).subscribe(res => {
        if (res['status'] === 0) {
          this.hide_list = false;
        } else {
          // this.hide_list = true;
          this.Canididate_message = res['message'];
        }
      }, (err) => {
        console.log('err=>', err);
        // this.toastr.error(err['error']['message'], 'Error!', { timeOut: 3000 });
      });
    }

    if (this.userDetail.role === 'employer') {
      this.getCustomField();
    }
    // To show spinner
    this.spinner.show();
  }

  // get first custom field
  getCustomField() {
    this.service.get_first_custom_field().subscribe(res => {
      if (res['data'] && res['data'].length > 0) {
        this.first_custom_field = res['data'][0]['key'];
        // this.first_custom_field = '';
      } else {
        this.first_custom_field = '';
      }

    }, (err) => {
      this.toastr.error(err['error']['message'], 'Error!', { timeOut: 3000 });
    });
  }

  joinGroup = (id) => {
    this.socketService.joinGrp(id);
  }

  ngOnInit() {
    // let detail;
    // detail = this.commonService.profileData();
    // console.log('this.commonService.profileData(); offer list =>', this.commonService.profileData());
    this.socketService.reflectuser().subscribe(res => {
      this.commonService.profileData().then((resp: any) => {
        this.profileData = resp;
        this.toastr.success('Your profile is approved by admin');
      }).catch(err => {
      });
    });

    this.socketService.getOffer().subscribe(res => {
      this.rrerender();
    });
    if (this.userDetail.role !== 'admin') {
      this.commonService.getprofileDetail.subscribe(async res => {
        if (res) {
          this.profileData = res;
          if (this.profileData[0].user_id.admin_rights === 'yes') {
            this.adminRights = true;
          }
          if (this.userDetail.role === 'employer') {
            this.grpId = this.profileData[0].user_id._id;
            this.joinGroup(this.profileData[0].user_id._id);
          } else if (this.userDetail.role === 'candidate') {
            this.grpId = this.profileData[0].user_id._id;
            this.joinGroup(this.profileData[0].user_id._id);
          } else if (this.userDetail.role === 'sub-employer') {
            this.grpId = this.profileData[0].emp_id;
            this.joinGroup(this.profileData[0].emp_id);
          }
        } else {
          // const profile = await this.commonService.decrypt(localStorage.getItem('profile'));
          // const profile = await ;
          const [profile] = await Promise.all([this.commonService.profileData()]);

          if (profile) {
            this.profileData = profile;
            if (!this.profileData[0].user_id.email_verified) {
              this.hide_list = true;
            }

            if (this.userDetail.role === 'employer') {
              this.grpId = this.profileData[0].user_id._id;
              this.joinGroup(this.profileData[0].user_id._id);
            } else if (this.userDetail.role === 'candidate') {
              this.grpId = this.profileData[0].user_id._id;
              this.joinGroup(this.profileData[0].user_id._id);
            } else if (this.userDetail.role === 'sub-employer') {
              this.grpId = this.profileData[0].emp_id;
              this.joinGroup(this.profileData[0].emp_id);
            }

          } else {
            console.log('profile data not found');
          }
        }
      });
    } else {
      console.log('it is admin!');
    }

    if (this.userDetail.role === 'employer' || this.userDetail.role === 'sub-employer') {
      this.dtOptions = {
        pagingType: 'full_numbers',
        pageLength: 10,
        serverSide: true,
        processing: true,
        order: [[0, 'desc']],
        language: { 'processing': '<i class="fa fa-spinner fa-spin" aria-hidden="true"></i>' },
        destroy: true,
        responsive: true,
        ajax: (dataTablesParameters: any, callback) => {
          this.service.view_offer(dataTablesParameters).subscribe(res => {
            if (res['status']) {
              // To hide spinner
              this.spinner.hide();
              this.offerData = res['offer'];
              this.offerData.forEach(element => {
                this.d = moment(new Date(element.expirydate));
                const current_date = moment();
                if ((element.status === 'Released') && (this.d.isBefore(current_date, 'day'))) {
                  element.isExpired = true;
                } else {
                  element.isExpired = false;
                }
              }
              );
              // this.d = moment(new Date(res[`offer`].expirydate));
              // console.log('this.d < new Date()=>', res[`offer`].expirydate);
              //


              // console.log('document.getElementById(`offer-tr`)=>', document.getElementById('offer-tr'));

              //

              //
              // }
              //  changed offer type valu to offer type label for display purpose only
              // this.offerData.forEach(offer => {
              //   offer.offertype = (this.offer_type_optoins
              //     .find(o => o.value === offer.offertype).label);
              // });



              // if (this.offerData.length == 0) {
              //   var el = document.getElementById('DataTables_Table_0_paginate');
              //   el.style.display = 'none';
              // }
              callback({
                recordsTotal: res[`recordsTotal`],
                recordsFiltered: res[`recordsTotal`],
                data: []
              });
            }
          }, err => {
            // To hide spinner
            this.spinner.hide();
            this.toastr.error(err['error']['message'], 'Error!', { timeOut: 3000 });
          });
        },
        columnDefs: [{ orderable: false, targets: 9 },
        { targets: 1, width: '100%' },
          // { targets: 3, width: '40%' },
          // { targets: 6, width: '100%' },
          // { targets: 7, width: '100%' }
        ],
        columns: [
          {
            data: 'createdAt'
          },
          {
            data: 'candidate.user.email'
          },
          {
            data: 'candidate.firstname'
          },
          {
            data: 'title'
          },
          {
            data: 'location.city'
          },
          {
            data: 'expirydate'
          },
          {
            data: 'joiningdate'
          },
          {
            data: 'acceptedAt'
          },
          {
            data: 'status'
          },
          {
            data: 'actions'
          }
        ]
      };
    } else if (this.userDetail.role === 'candidate') {
      this.dtOptions = {
        pagingType: 'full_numbers',
        pageLength: 10,
        serverSide: true,
        processing: true,
        order: [[0, 'desc']],
        language: { 'processing': '<i class="fa fa-spinner fa-spin" aria-hidden="true"></i>' },
        destroy: true,
        ajax: (dataTablesParameters: any, callback) => {
          this.service.view_offer_candidate(dataTablesParameters).subscribe(res => {
            if (res['status']) {
              // To hide spinner
              this.spinner.hide();
              this.offerData = res['offer'];
              // this.offerData.forEach(element => {

              //   this.d = moment(new Date(element.expirydate));
              //   if ((element.status === 'Released') && this.d < new Date()) {
              //     element.isExpired = true;
              //   } else {
              //     element.isExpired = false;
              //   }
              // }
              this.offerData.forEach(element => {
                this.d = moment(new Date(element.expirydate));
                const current_date = moment();
                if ((element.status === 'Released') && (this.d.isBefore(current_date, 'day'))) {
                  element.isExpired = true;
                } else {
                  element.isExpired = false;
                }
              }
              );
              // if (this.offerData.status === 'Released' && this.offerData.expirydate > new Date()) {
              //   document.getElementById('accept').classList.add('d-0');
              // }
              // this.offerData.forEach((offer) => {
              //   offer.isExpired = false;
              //   const d = new Date();
              //   // d.setDate(d.getDate() - 1);

              //   if (offer.status && ((d > new Date(offer.expirydate) &&
              //     (Math.floor(d.getTime() / 86400000) !== Math.floor(new Date(offer.expirydate).getTime() / 86400000))))) {
              //     offer['isExpired'] = true;
              //   } else {
              //     offer['isExpired'] = false;
              //   }

              // this.salaryDuration = this.offerData.salaryduration;
              // if (offer.salaryduration === null) {
              //   offer.salaryduration = '-';
              // } else {
              //   offer.salaryduration;
              // }

              //  changed offer type valu to offer type label for display purpose only
              // offer.offertype = (this.offer_type_optoins.find(o => o.value === offer.offertype).label);

              // if (offer['created_by'].length > 0) {
              //   console.log('res sub emp=======>', offer['created_by'].username);
              //   this.userName = offer['created_by'].username;
              // } else {
              //   console.log('res emp=>', offer[`employer_id`][`employer`].username);
              //   this.userName = offer['employer_id']['employer'].username;
              // }
              // });

              // if (this.offerData.length == 0) {
              //   var el = document.getElementById('DataTables_Table_0_paginate');
              //   el.style.display = 'none';
              // }
              callback({
                recordsTotal: res[`recordsTotal`],
                recordsFiltered: res[`recordsTotal`],
                data: []
              });
            }
          }, err => {
            // To hide spinner
            this.spinner.hide();
            this.toastr.error(err['error']['message'], 'Error!', { timeOut: 3000 });
          });
        },
        columnDefs: [{ orderable: false, targets: 10 },
        { targets: 2, width: '50%' },
        { targets: 5, width: '30%' }],
        columns: [
          {
            data: 'createdAt'
          },
          {
            data: 'username'
          },
          {
            data: 'title'
          },
          {
            data: 'salarytype'
          },
          {
            data: 'salaryduration'
          },

          {
            data: 'salarybracket.from'
          },
          {
            data: 'expirydate'
          },
          {
            data: 'acceptedAt'
          },
          {
            data: 'joiningdate'
          },
          {
            data: 'status'
          },
          // {
          //   data: 'offertype'
          // },
          // {
          //   data: 'group.name'
          // },
          // {
          //   data: 'commitstatus'
          // },
          // {
          //   data: 'customfeild[0].key'
          // },
          {
            data: 'actions'
          }
        ]
      };
    }
  }

  edit(id) {
    if (this.userDetail.role === 'employer') {
      this.route.navigate(['/employer/offers/edit/' + id]);
    } else if (this.userDetail.role === 'sub-employer') {
      this.route.navigate(['/sub_employer/offers/edit/' + id]);
    }
  }

  detail(id) {

    if (this.userDetail.role === 'employer') {
      this.route.navigate(['/employer/offers/view/' + id]);
    } else if (this.userDetail.role === 'sub-employer') {
      this.route.navigate(['/sub_employer/offers/view/' + id]);
    } else if (this.userDetail.role === 'candidate') {
      this.route.navigate(['/candidate/offers/view/' + id]);
    }
  }

  add(content) {
    if (this.profileData[0].user_id.isAllow === false) {
      this.modalService.open(content);
      this.empService.check_approved(this.userDetail.id).subscribe(res => {
        if (res['status'] === 0 || res['status'] === 2) {
          // this.hide_list = false;
        } else {
          // this.hide_list = true;
          this.message = res['message'];
        }
      }, (err) => {
        // this.hide_list = true;
        this.toastr.error(err['error']['message'], 'Error!', { timeOut: 3000 });
      });
    } else if (this.userDetail.role === 'employer') {
      this.route.navigate(['/employer/offers/add']);
    } else if (this.userDetail.role === 'sub-employer') {
      this.route.navigate(['/sub_employer/offers/add']);
    }
  }

  history(id) {
    if (this.userDetail.role === 'employer') {
      this.route.navigate(['/employer/offers/history/' + id]);
    } else if (this.userDetail.role === 'sub-employer') {
      this.route.navigate(['/sub_employer/offers/history/' + id]);
    }
  }

  delete(id) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to Delete this Offer?',
      accept: () => {
        this.service.deactivate_employer_offer(id).subscribe(res => {
          this.rrerender();
        }, (err) => {
          this.toastr.error(err['error']['message'], 'Error!', { timeOut: 3000 });
        });
      }
    });
  }

  onAccept(id, type) {
    // type = (this.offer_type_optoins.find(o => o.label === this.offerData[0].offertype).value);
    this.accept_btn = true;
    this.service.type_message({ 'type': type }).subscribe(res => {
      if (type === 'noCommit') {
        this.isNoCommit = true;
        this.Info_msg = res[`data`][`message`];
        this.modalService.open(this.content1, ModalOptions);
      } else {
        this.isNoCommit = false;
        this.Info_msg = res[`data`][`message`];
        this.modalService.open(this.content1, ModalOptions);
      }
    }, (err) => {
      this.toastr.error(err['error']['message'], 'Error!', { timeOut: 3000 });
    });
    this.offerID = id;

    // this.service.offer_accept(obj).subscribe(res => {
    //   console.log('accepted!!', res['data']['data'].employer_id);
    //   this.socketService.leaveGrp(this.grpId);
    //   this.socketService.joinGrp(res['data']['data'].employer_id);
    //   this.socketService.changeOffer(res['data']['data'].employer_id);
    //   this.socketService.leaveGrp(res['data']['data'].employer_id);
    //   this.joinGroup(this.grpId);

    //   this.rrerender();
    //   // this.s
    //   this.accept_btn = false;
    //   if (res['data'].status === 1) {
    //     Swal.fire(
    //       {
    //         type: 'success',
    //         text: res['message']
    //       }
    //     );
    //   }
    // });
  }
  acceptOffer(e) {
    if (this.selectedValue === 'accept') {
      this.isAccept = true;
    } else {
      this.isAccept = false;
    }
  }
  acceptedOffer() {
    this.modalService.dismissAll(this.content1);
    this.service.offer_accept({ 'id': this.offerID }).subscribe(res => {
      this.socketService.leaveGrp(this.grpId);
      this.socketService.joinGrp(res['data']['data'].employer_id);
      this.socketService.changeOffer(res['data']['data'].employer_id);
      this.socketService.leaveGrp(res['data']['data'].employer_id);
      this.joinGroup(this.grpId);
      this.accept_btn = false;
      Swal.fire(
        {
          type: 'success',
          text: res['message']
        }
      );
      this.rrerender();

    }, (err) => {
      this.toastr.error(err['error']['message'], 'Error!', { timeOut: 3000 });
    });
  }
  disabledAccept() {
    this.accept_btn = false;
  }


  rrerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngOnDestroy() {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
    this.socketService.leaveGrp(this.grpId);
  }
}
