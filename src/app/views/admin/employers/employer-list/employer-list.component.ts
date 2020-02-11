import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { EmployerService } from '../employer.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService } from 'primeng/api';
import { SocketService } from '../../../../services/socket.service';

@Component({
  selector: 'app-employer-list',
  templateUrl: './employer-list.component.html',
  styleUrls: ['./employer-list.component.scss']
})
export class EmployerListComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  employer_data: any = [];
  country: any;
  userDetail: any = [];
  isApproved = false;
  employer_type = 'Approved';
  id: any;

  constructor(
    private route: Router,
    private router: ActivatedRoute,
    private service: EmployerService,
    private toastr: ToastrService,
    private confirmationService: ConfirmationService,
    private socketService: SocketService
  ) {
    // console.log('this.router.snapshot.data.type => ', this.router.snapshot.data.type);
    if (this.router.snapshot.data.type === 'new') {
      this.employer_type = 'New';
    }
  }


  // joinGroup = (id) => {
  //   this.socketService.joinGrp(id);

  // }

  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      order: [[0, 'desc']],
      language: { 'processing': '<i class="fa fa-spinner fa-spin" aria-hidden="true"></i>' },
      destroy: true,
      ajax: (dataTablesParameters: any, callback) => {
        if (this.router.snapshot.data.type === 'approved') {
          this.service.get_approved_employer(dataTablesParameters).subscribe(res => {
            if (res['status'] === 1) {
              this.employer_data = res['user'];
              // if ($(`DataTables_Table_0_paginate`).length === 0) {
              //   $('#DataTables_Table_0_paginate').hide();
              // }
              callback({ recordsTotal: res[`recordsTotal`], recordsFiltered: res[`recordsTotal`], data: [] });
            }
          }, err => {
            this.toastr.error(err['error'].message, 'Error!', { timeOut: 3000 });
            callback({ recordsTotal: 0, recordsFiltered: 0, data: [] });
          });
        } else if (this.router.snapshot.data.type === 'new') {
          this.service.get_new_employer(dataTablesParameters).subscribe(res => {
            if (res['status'] === 1) {
              this.employer_data = res['user'];
              if ($(`DataTables_Table_0_paginate`).length === 0) {
                $('#DataTables_Table_0_paginate').hide();
              }
              callback({ recordsTotal: res[`recordsTotal`], recordsFiltered: res[`recordsTotal`], data: [] });

            }
          }, err => {
            this.toastr.error(err['error'].message, 'Error!', { timeOut: 3000 });
            callback({ recordsTotal: 0, recordsFiltered: 0, data: [] });
          });
        }
      },
      columnDefs: [{ orderable: false, targets: 1 }, { orderable: false, targets: 5 }],
      columns: [
        {
          data: 'firstname'
        }, {
          data: 'lsatname'
        }, {
          data: 'user.email'
        }, {
          data: 'business.country'
        }, {
          data: 'companyname'
        }, {
          data: 'action'
        }
      ]
    };
  }


  // buttonInRowClick(event: any): void {
  //   event.stopPropagation();
  //   console.log('Button in the row clicked.');
  // }

  // wholeRowClick(): void {
  //   console.log('Whole row clicked.');
  // }

  // nextButtonClickEvent(): void {
  //   // do next particular records like  101 - 200 rows.
  //   // we are calling to api
  //   console.log('next clicked');
  // }

  // previousButtonClickEvent(): void {
  //   // do previous particular the records like  0 - 100 rows.
  //   // we are calling to API
  // }

  aprrove(id) {
    this.isApproved = true;
    const obj = {
      'id': id
    };
    this.confirmationService.confirm({
      message: 'Are you sure that you want to Approve this Employer?',
      accept: () => {
        this.isApproved = true;
        this.service.aprroved_employer(obj).subscribe(res => {
          // console.log("hiii", res['data']['data']._id);
          this.socketService.joinGrp(res['data']['data']._id);
          this.socketService.isAllow(res['data']['data']._id);
          this.socketService.leaveGrp(res['data']['data']._id);
          this.toastr.success(res['message'], 'Success!', { timeOut: 3000 });
          this.isApproved = false;
          this.rrerender();
        }, (err) => {
          this.toastr.error(err['error']['message'], 'Error!', { timeOut: 3000 });
        });
      }, reject: () => {
        this.isApproved = false;
      }
    });
  }

  // detail(id) {
  //   this.route.navigate(['admin/employers/detail/' + id]);
  // }emplo

  delete(id) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to Reject this Employer?',
      accept: () => {
        this.service.deactivate_employer(id).subscribe(res => {
          this.toastr.success(res['message'], 'Success!', { timeOut: 3000 });
          this.rrerender();
        }, (err) => {
          this.toastr.error(err['error']['message'], 'Error!', { timeOut: 3000 });
        });
      }
    });
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
    // this.socketService.leaveGrp(this.id);
  }

}
