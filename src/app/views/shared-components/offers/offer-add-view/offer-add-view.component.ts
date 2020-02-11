import { Component, OnInit, OnDestroy, ElementRef, ViewChild, HostListener } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray, FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, Params, ActivatedRouteSnapshot } from '@angular/router';
import { OfferService } from '../offer.service';
import { CommonService } from '../../../../services/common.service';
import { ToastrService } from 'ngx-toastr';
import { GroupService } from '../../../employer/groups/manage-groups.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmationService } from 'primeng/api';
import { EmployerService } from '../../../admin/employers/employer.service';
import Swal from 'sweetalert2';
import { SocketService } from '../../../../services/socket.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalOptions } from '../../../../shared/modal_options';
import * as moment from 'moment';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { environment } from '../../../../../environments/environment';
import { NgxSummernoteDirective } from 'ngx-summernote';
import { Observable, BehaviorSubject } from 'rxjs';

declare const $: any;
@Component({
  selector: 'app-offer-add-view',
  templateUrl: './offer-add-view.component.html',
  styleUrls: ['./offer-add-view.component.scss']
})
export class OfferAddViewComponent implements OnInit, OnDestroy {
  @ViewChild('content') content: ElementRef;
  @ViewChild('content1') content1: ElementRef;
  @ViewChild('content2') content2: ElementRef;
  @ViewChild('editor') summernote: ElementRef;
  @ViewChild('editor') editorDir: NgxSummernoteDirective;
  userName: any;
  public Editor = ClassicEditor;
  resData: any;
  isPopup = false;
  form: FormGroup;
  isRelaeased: boolean = false;
  form_validation = false;
  offer_data: any = {};
  panelTitle = 'Add';
  user_detail: any = {};
  currentUrl = '';
  candidate: any = [];
  isValid = false;
  is_Add: boolean = false;
  groupByID: any;
  candidateList: any = [];
  groupForm: FormGroup;
  date: any;
  ast = false;
  isJoiningDate = false;
  country: any = [];
  isSetCommunication = false;
  countryList: any = [];
  candidateData: any;
  salary_bracket: any = [];
  salarybracketList: any = [];
  isSubmit = false;
  location: any = [];
  display_msg = false;
  expirydate: any;
  joiningdate: any;
  isAccepted = false;
  isAccept = false;
  istouchedArray = [];
  pastDetails: any;
  msg: any;
  offer: any;
  offerExpired = false;
  err_msg: any;
  isShow = false;
  valueForEditor: any;
  details: any;
  isPopup_Show = false;
  groupData: any = {};
  selectedValue: string;
  Candidate: HTMLElement;
  is_communication_added = false;
  cursorPos: any;
  d: any;
  response: any = '';
  joining_Date; any;
  isSalaryBracket: Boolean = false;
  isAdHoc_ButtonShow = false;
  destroyform = false;
  locationList: any = [
    { label: 'Select Location', value: '' }
  ];
  config: any = {
    height: '200px',
    uploadImagePath: '/api/upload',
    toolbar: [
      ['misc', ['codeview', 'undo', 'redo', 'codeBlock', 'paste']],
      ['font', ['bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript', 'clear']],
      ['fontsize', ['fontname', 'fontsize', 'color']],
      ['para', ['style0', 'ul', 'ol', 'paragraph', 'height']],
      ['insert', ['table', 'picture', 'link', 'video', 'hr']]
    ]
  };
  from: any;
  to: any;
  customfield: any = [];
  group_optoins: any = [{ label: 'Select Group', value: '' }];
  arrayItems: any = [];
  key: any;
  disabled: boolean = false;
  error = false;
  err_to = '';
  err_from = '';
  offerStatus: any = [];
  custom_field: any = [];
  id: any;
  Info_msg: any;
  isNoCommit: any;
  OfferID: any;
  is_Edit: boolean = false;
  is_View: boolean = false;
  // salary duration options
  salary_duration_optoins = [
    { label: 'Select Salary Duration', value: '' },
    { label: '1 week', value: '1week' },
    { label: '2 week', value: '2week' }
  ];
  // offer type options
  offer_type_optoins = [
    { label: 'Select Offer Type', value: '' },
    { label: 'No Commit', value: 'noCommit' },
    { label: 'Candidate Commit', value: 'candidateCommit' },
    { label: 'Both Commit', value: 'bothCommit' }
  ];
  Trigger_Option = [
    { label: 'Select Trigger', value: '' },
    { label: 'Before Joining', value: 'beforeJoining' },
    { label: 'After Joining', value: 'afterJoining' },
    { label: 'After Offer', value: 'afterOffer' },
    { label: 'Before Expiry', value: 'beforeExpiry' },
    { label: 'After Expiry', value: 'afterExpiry' },
    { label: 'After Acceptance', value: 'afterAcceptance' }

  ];

  Priority_Options = [
    { label: 'Select Priority', value: '' },
    { label: 'High', value: 'High' },
    { label: 'Medium', value: 'Medium' },
    { label: 'Low', value: 'Low' }
  ];
  contryList: any;
  cancel_link = '/employer/offers/list';
  cancel_link1 = '/sub_employer/offers/list';
  show_spinner = false;
  formData: FormData;
  communicationData: any = [];
  AdHocCommunicationData: any = [];
  is_disabled_btn = false;
  profileData: any;
  min_date = new Date();
  min_expiry_date = new Date();
  default_date = new Date();
  max_date = new Date(new Date().setFullYear(new Date().getFullYear() + 20));
  userDetail: any = [];
  offerList: any;
  grpId: string;
  getGroupDetails = false;
  isExpired = false;
  is_submitted = false;
  accept_btn = false;
  isAcceptedView: any;
  isSalaryFrom_To: Boolean = false;
  isCustomFieldView = false;
  isCustomFieldAdd = false;
  offer_Details: any;
  offerDetail: any;
  forms: any;
  _array: any;
  astSalary = false;
  constructor(
    private fb: FormBuilder,
    private service: OfferService,
    private Groupservice: GroupService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private commonService: CommonService,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private adminService: EmployerService,
    private socketService: SocketService,
    private modalService: NgbModal,
  ) {

    this.spinner.show();

    this.userDetail = this.commonService.getLoggedUserDetail();
    if (this.userDetail.role === 'employer' || this.userDetail.role === 'sub-employer') {
      this.getLocation();
      this.currentUrl = this.router.url;
    }
    if (this.userDetail.role === 'employer') {
      this.commonService.profileData().then(res => {
        this.profileData = res;
      });
    }

    // check for add or edit
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
    });



  }

  formInit = () => {
    this.form = this.fb.group({
      candidate_name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required,
      Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]),
      title: new FormControl('', [Validators.required, this.noWhitespaceValidator]),
      salarytype: new FormControl('', [Validators.required]),
      salaryduration: new FormControl(''),
      location: new FormControl('', [Validators.required]),
      salarybracket: new FormControl('', [Validators.required]),
      salarybracket_from: new FormControl('', [Validators.required]),
      salarybracket_to: new FormControl('', [Validators.required]),
      expirydate: new FormControl('', [Validators.required]),
      joiningdate: new FormControl('', [Validators.required]),
      status: new FormControl(),
      offertype: new FormControl('', [Validators.required]),
      group: new FormControl(''),
      notes: new FormControl(''),
      employer_id: new FormControl(''),
      customfieldItem: this.fb.array([]),
      communicationFieldItems: this.fb.array([]),
      AdHocCommunication: this.fb.array([]),
      // summerNotes
      editor: new FormControl(''),
      offerStatus: new FormControl(''),
      acceptanceDate: new FormControl('')
    });
    this.setGroupFormControl();

  }

  get f() { return this.form.controls; }

  // custom field items controls
  get customfieldItem() {
    return this.form.get('customfieldItem') as FormArray;
  }

  // communication field items controls
  get communicationFieldItems() {
    return this.form.get('communicationFieldItems') as FormArray;
  }

  // AdHoc Communication
  get AdHocCommunication() {
    return this.form.get('AdHocCommunication') as FormArray;
  }

  // Update form validation
  updateValidation() {
    this.form.updateValueAndValidity();
  }

  // get country list
  async findData(value) {
    this.salarybracketList = [];
    this.country.forEach(element => {
      if (value.value === element.country_id) {
        // this.offer_data.currency_type = element.currency;
        // this.form.controls.currency_type.setValue(element.currency);
      }
    });
    const promise = new Promise((resolve, reject) => {
      this.service.get_location(value.value).subscribe(
        async res => {
          this.location = await res[`data`].data;
          this.salary_bracket = await res['salary'].data;
          this.salary_bracket.forEach(element => {
            this.salarybracketList.push({
              label: element.from + ' - ' + element.to,
              value: element._id
            });
          });

          if (this.route.snapshot.data.title === 'Edit') {
            const locationById = this.location.find(x => x._id === this.resData.location._id);
            this.form.controls.location.setValue(locationById);
            const salarybracketById = this.salarybracketList.find(x => x.value === this.resData.salarybracket._id);
            this.form.controls.salarybracket.setValue(salarybracketById.value);
          }
          resolve(this.salarybracketList);
        },
        err => {
          reject(err);
        });
    });
    return promise;
  }

  // salary duration positive check
  checkPositive() {
    if (this.form.value.salarytype === 'hourly') {
      if (this.form.value.salaryduration > 0) {
        this.form.controls['salaryduration'].setValue(parseFloat(this.form.value.salaryduration));
        this.form.controls['salaryduration'].setValidators([Validators.pattern(/^[0-9]*$/)]);
      }
      this.form.controls['salaryduration'].updateValueAndValidity();
    }
  }

  // remove Zero
  removeZero(index) {
    if (this.form.controls['AdHocCommunication'].value[index].AdHoc_day > 0) {
      this.form.controls['AdHocCommunication'][`controls`][index].controls['AdHoc_day'].setValue(parseFloat(this.form.value[`AdHocCommunication`][index].AdHoc_day));
    }
  }

  removeZeroCommunication(index) {
    if (this.form.controls['communicationFieldItems'].value[index].day > 0) {
      this.form.controls['communicationFieldItems'][`controls`][index].controls['day'].setValue(parseFloat(this.form.value[`communicationFieldItems`][index].day));
    }
  }

  // email blur pattern check
  checkEmail(value) {
    const email = value.target.value;
    if (this.form['controls'].email.valid) {
      this.service.email_exists({ 'email': this.form.value.email }).subscribe(res => {
      }, (err) => {
        this.form.controls['email'].setErrors({ 'isExist': true });
      });

      this.service.add_offer_pastOffer({ 'email': email }).subscribe(res => {
        this.isShow = false;
        this.isSubmit = true;
        this.pastDetails = res;
        if (this.pastDetails.ReleasedOffer.data.length > 0) {
          this.modalService.open(this.content1, ModalOptions);
          this.err_msg = this.pastDetails.ReleasedOffer.displayMessage;
        } else {
          if (this.pastDetails.data.data.length > 0 && this.pastDetails.previousOffer.data.length === 0) {
            this.details = res['data']['data'];
            this.isShow = true;
            this.modalService.open(this.content, ModalOptions);
            this.msg = this.pastDetails.data.displayMessage;
          } else if (this.pastDetails.data.data.length === 0 && this.pastDetails.previousOffer.data.length > 0) {
            this.details = res['data']['data'];
            this.isShow = true;
            this.modalService.open(this.content1, ModalOptions);
            this.err_msg = this.pastDetails.previousOffer.displayMessage;

          }
          if ((this.pastDetails.data.data.length > 0) && (this.pastDetails.previousOffer.data.length > 0)) {
            this.isShow = false;
            this.details = res['data']['data'];
            this.isShow = true;
            this.modalService.open(this.content, ModalOptions);
            this.msg = this.pastDetails.data.displayMessage;
            // this.d();
          }
          //  else {
          //   this.details = res['data']['data'];
          //   this.isShow = true;
          //   this.modalService.open(this.content, ModalOptions);
          //   this.msg = this.pastDetails.data.displayMessage;
          // }
          // //  error popup
          // if (this.pastDetails.previousOffer.data.length > 0) {
          //   this.isShow = false;
          //   this.modalService.open(this.content, ModalOptions);
          //   this.msg = this.pastDetails.previousOffer.displayMessage;
          // };
          // //  info popup
          // if (this.pastDetails.data.data.length > 0) {
          //   this.details = res['data']['data'];
          //   this.isShow = true;
          //   this.modalService.open(this.content, ModalOptions);
          //   this.msg = this.pastDetails.data.displayMessage;
          // };
        }
      });

    } else {
      if (this.form.value.email.length > 0) {
        this.form.controls['email'].setValidators(
          [Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]
        );
      } else {
        this.form.controls['email'].setValidators([Validators.required]);
      }
      this.form.controls['email'].updateValueAndValidity();
    }


    // this.service.email_exists({ 'email': this.form.value.email }).subscribe(res => {
    //   console.log('res=>', res);

    // }, (err) => {
    //   console.log('err=>', err);

    //   this.form.controls['email'].setErrors({ 'isExist': true });
    // });
    // if (this.form.value.email.length > 0) {
    // this.form.controls['email'].setValidators(
    //   [Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]
    // );
    // } else {
    //   this.form.controls['email'].setValidators([Validators.required]);
    // }
    // this.form.controls['email'].updateValueAndValidity();

    // this.service.add_offer_pastOffer({ 'email': email }).subscribe(res => {
    //   this.pastDetails = res[`data`][`data`];
    //   if (this.pastDetails.length > 0) {
    //     this.modalService.open(this.content, ModalOptions);
    //   }
    // });
  }
  next(e) {
    this.isSubmit = true;
    this.isRelaeased = false;
    this.commonService.setUnSavedData('');
    this.modalService.dismissAll(this.content);
    if (this.pastDetails.previousOffer.data.length > 0) {
      this.modalService.open(this.content1, ModalOptions);
      this.err_msg = this.pastDetails.previousOffer.displayMessage;
    }
  }
  send() {
    this.isSubmit = true;
    if (this.pastDetails.ReleasedOffer.data.length > 0) {
      this.isRelaeased = true;
      if (this.userDetail.role === 'employer') {
        this.modalService.dismissAll(this.content1);
        this.router.navigate(['/employer/offers/list']);
      } else if (this.userDetail.role === 'sub-employer') {
        this.modalService.dismissAll(this.content1);
        this.router.navigate(['/sub_employer/offers/list']);
      }
    } else {
      this.modalService.dismissAll(this.content1);

    }
  }

  // key up event for email
  findEmail(value) {
    for (let index = 0; index < this.candidate.length; index++) {
      const element = this.candidate[index];
      if (value.target.value.toLowerCase() === element.user.email) {
        this.display_msg = true;
        this.form.controls.candidate_name.setValue(element.firstname + ' ' + element.lastname);
        document.getElementById('candidate_name').setAttribute('disabled', 'true');
        break;
      } else {
        this.display_msg = false;
        this.form.controls.candidate_name.setValue('');
        document.getElementById('candidate_name').removeAttribute('disabled');
      }
    }
    this.isTouched(value.target.value);
  }

  // get location
  getLocation() {
    const promise = new Promise((resolve, reject) => {
      this.service.get_locations().subscribe(
        async res => {
          // this.location = await res[`data`].data;
          // this.locationList.push(res[`data`].data)
          if (res[`data`]) {
            res[`data`].forEach(element => {
              this.locationList.push({ label: element.city, value: element._id });
            });
          }
        },
        err => {
          reject(err);
        });
    });
    return promise;
  }

  //  On change of salary type
  getSalaryType() {
    this.isTouched(this.form.value.salarytype);
    if (this.form.value.salarytype === 'hourly') {
      this.disabled = false;
      this.form.controls['salaryduration'].setValidators([Validators.required, Validators.pattern(/^\s*(?=.*[1-9])\d*(?:\.\d{1,2})?\s*$/)]);
      // if (this.form.value.salaryduration.length > 0) {
      this.form.controls['salaryduration'].setValidators([Validators.pattern(/^\s*(?=.*[1-9])\d*(?:\.\d{1,2})?\s*$/)]);
      // }
      // this.form.controls['salaryduration'].updateValueAndValidity();
    } else {
      this.disabled = true;
      this.form.controls['salaryduration'].setValidators(null);
      this.form.controls['salaryduration'].setValue(null);
    }
    this.updateValidation();
    this.form.controls['salaryduration'].updateValueAndValidity();
  }
  getGroupdays() {
    return new Promise((ok, fail) => {
      this.Groupservice.alert_days().subscribe(res => {
        this.groupData = res[`data`];
        ok(this.groupData);
      }, (err) => {
        this.toastr.error(err['error']['message'], 'Error!', { timeOut: 3000 });
        fail(err);
      });
    });
  }

  ngOnInit() {
    this.userDetail = this.commonService.getLoggedUserDetail();
    // this.setGroupFormControl()
    //   To get candidates list
    if (this.userDetail.role === 'employer' || this.userDetail.role === 'sub-employer') {
      this.getCandidateList()
        .then(res => {
          this.groupList();
          this.getGroupdays();
          this.customFieldList();
        })
        .then(res => {
          if (this.route.snapshot.data.title !== 'Edit' && this.route.snapshot.data.title !== 'View') {
            //  spinner hide
            this.spinner.hide();
          } else {
            this.spinner.hide();
          }
        })
        .then(res => {
          if (this.route.snapshot.data.title === 'Edit') {
            this.spinner.show();
            this.panelTitle = 'Edit';
            this.is_Edit = true;

          } else if (this.route.snapshot.data.title === 'View') {
            this.spinner.show();
            this.panelTitle = 'View';
            this.is_View = true;
            this.getDetail(this.id);
          } else if (this.route.snapshot.data.title === 'Add') {
            this.is_Add = true;
            this.panelTitle = 'Add';
          }

        }).then(res => {
          this.commonService.getuserdata.subscribe(res => {
            console.log('in getuser=======>');

            this.response = res['offer'];
            this.formInit();
            console.log('this.response=>', this.response);

            if (this.response === undefined
              || this.response.email === ''
              || this.response === 'undefined') {
              this.response = '';
            }
            if (this.response) {
              if (this.is_Add) {
                console.log('IN ADD=======>');

                this.form.controls['email'].setValue(res['offer'].email);
                this.form.controls['candidate_name'].setValue(res['offer'].candidate_name);
                if (res['offer'].title) {
                  this.form.controls['title'].setValue(res['offer'].title);
                }
                this.form.controls['location'].setValue(res['offer'].location);

                this.form.controls.salarytype.setValue(res['offer'].salarytype);
                if (res['offer'].salarybracket !== '') {
                  this.form.controls['salarybracket'].setValue(res['offer'].salarybracket);
                }
                if (res['offer'].salarybracket_from !== '' && res['offer'].salarybracket_to !== '') {
                  this.form.controls['salarybracket_from'].setValue(res['offer'].salarybracket_from);
                  this.form.controls['salarybracket_to'].setValue(res['offer'].salarybracket_to);
                }

                if (res['offer'].expirydate != null || res['offer'].joiningdate !== null) {
                  this.form.controls['expirydate'].setValue(new Date(res['offer'].expirydate));
                  this.form.controls['joiningdate'].setValue(new Date(res['offer'].joiningdate));
                }
                if (res['offer'].offertype) {
                  this.form.controls['offertype'].setValue(res['offer'].offertype);
                }

                this.form.controls['notes'].setValue(res['offer'].notes);

                // set group
                // this.groupList();
                this.service.get_groups().subscribe(resGrp => {

                  if (resGrp[`data`].data) {
                    resGrp[`data`].data.forEach(element => {
                      this.group_optoins.push({ label: element.name, value: element._id });
                    });
                  }
                });
                // console.log('this.group_optoins=>', this.group_optoins);
                this.groupByID = res[`offer`].group;
                // console.log('this.groupByID=>', this.groupByID);

                const groupName = this.group_optoins.find(x => x.value === this.groupByID);
                // console.log('groupById=>', groupName);

                if (groupName) {
                  this.form.controls.group.setValue(groupName.value);
                }
                this.form.controls['high_unopened'].setValue(res[`offer`].high_unopened);
                this.form.controls['high_notreplied'].setValue(res[`offer`].high_notreplied);
                this.form.controls['medium_unopened'].setValue(res[`offer`].medium_unopened);
                this.form.controls['medium_notreplied'].setValue(res[`offer`].medium_notreplied);
                // set communication

                if (res[`offer`]['communicationFieldItems'] && res[`offer`]['communicationFieldItems'].length > 0) {
                  this.communicationData = res[`offer`]['communicationFieldItems'];
                  this.isAdHoc_ButtonShow = true;
                  this.updatecommunication();
                  this.isSetCommunication = true;
                } else {
                  this.isAdHoc_ButtonShow = false;
                  this.isSetCommunication = false;
                }
                // set adhoc
                if (res[`offer`]['AdHocCommunication'].length > 0) {
                  this.AdHocCommunicationData = res[`offer`]['AdHocCommunication'];
                  this.update_adhoc_communication(this.AdHocCommunicationData);
                }
                const _array = [];
                const test = res[`offer`]['customfieldItem'];
                this.service.get_customfield().subscribe(
                  resp => {
                    this.customfield = resp['data'];
                    this.customfield.forEach((element, index) => {
                      const value = test.find(c => c.key === element.key) ?
                        test.find(c => c.key === element.key).value : '';
                      const new_customfield = {
                        key: element.key,
                        value,
                      };
                      this.customfieldItem.setControl(
                        index,
                        this.fb.group({
                          value: [value, [this.noWhitespaceValidatorForNotRequired]],
                          key: [element.key]
                        })
                      );
                      this.customfieldItem.updateValueAndValidity();
                      _array.push(new_customfield);
                    });
                    this.offer_data.customfieldItem = _array;
                  },
                  err => {
                    console.log(err);
                  });


                if (res['offer'].salarytype === 'annual') {
                  document.getElementById('salaryduration').setAttribute('disabled', 'true');
                } else {
                  document.getElementById('salaryduration').setAttribute('disabled', 'false');
                  this.form.controls['salaryduration'].setValue(res['offer'].salaryduration);
                }

              }
            }

            this.getDetail(this.id).then((resp: any) => {
              this.spinner.hide();


              if (res['offer'] && resp['offer']) {

                const current_date = moment();
                this.d = moment(new Date(res[`offer`].expirydate));
                setTimeout(() => {

                  this.form.controls['email'].setValue(res['offer'].email);
                  this.form.controls['candidate_name'].setValue(res['offer'].candidate_name);
                  if (res['offer'].title) {
                    this.form.controls['title'].setValue(res['offer'].title);
                  } else if (res['offer'].offerStatus.value === 'Accepted' || this.d.isBefore(current_date, 'day')) {
                    this.form.controls['title'].setValue(resp['offer'].title);
                  } else {
                    this.form.controls['title'].setValue(resp['offer'].title);
                  }

                  this.form.controls.salarytype.setValue(res['offer'].salarytype);
                  if (res['offer'].salarytype === 'annual') {
                    document.getElementById('salaryduration').setAttribute('disabled', 'true');
                  } else {
                    this.form.controls['salaryduration'].setValue(res['offer'].salaryduration);
                  }
                  this.form.controls['location'].setValue(res['offer'].location);
                  if (res['offer'].expirydate != null || res['offer'].joiningdate !== null) {
                    this.form.controls['expirydate'].setValue(new Date(res['offer'].expirydate));
                    this.form.controls['joiningdate'].setValue(new Date(res['offer'].joiningdate));
                  }
                  // resp['offer'].offertype = (this.offer_type_optoins.find(o => o.value === resp['offer'].offertype).label);
                  // console.log('resp.offer.offertype=>', resp['offer'].offertype);
                  if (res['offer'].offertype) {
                    this.form.controls['offertype'].setValue(res['offer'].offertype);
                  } else {
                    this.form.controls['offertype'].setValue(resp['offer'].offertype);
                  }
                  this.form.controls['salarybracket_from'].setValue(res['offer'].salarybracket_from);
                  this.form.controls['salarybracket_to'].setValue(res['offer'].salarybracket_to);
                  this.form.controls['salarybracket'].setValue(res['offer'].salarybracket);
                  this.form.controls['notes'].setValue(res['offer'].notes);

                  // if ((res[`offer`].high_unopened !== undefined && res[`offer`].high_unopened !== '') &&
                  //   (res[`offer`].high_notreplied !== undefined && res[`offer`].high_unopened !== '') &&
                  //   (res[`offer`].medium_unopened !== undefined && res[`offer`].high_unopened !== '') &&
                  //   (res[`offer`].medium_notreplied !== undefined && res[`offer`].medium_notreplied !== '') || !this.is_Edit) {
                  this.form.controls['high_unopened'].setValue(res[`offer`].high_unopened);
                  this.form.controls['high_notreplied'].setValue(res[`offer`].high_notreplied);
                  this.form.controls['medium_unopened'].setValue(res[`offer`].medium_unopened);
                  this.form.controls['medium_notreplied'].setValue(res[`offer`].medium_notreplied);

                  // set group
                  const groupById = this.group_optoins.find(x => x.value === res[`offer`].group);

                  if (groupById) {
                    this.form.controls.group.setValue(groupById.value);
                  }

                  // set communication

                  if (res[`offer`]['communicationFieldItems'] && res[`offer`]['communicationFieldItems'].length > 0) {
                    this.communicationData = res[`offer`]['communicationFieldItems'];
                    this.isAdHoc_ButtonShow = true;
                    this.updatecommunication();
                    this.isSetCommunication = true;
                  } else {
                    this.isAdHoc_ButtonShow = false;
                    this.isSetCommunication = false;
                  }
                  // set adhoc
                  if (res[`offer`]['AdHocCommunication'].length > 0) {
                    this.AdHocCommunicationData = res[`offer`]['AdHocCommunication'];
                    this.update_adhoc_communication(this.AdHocCommunicationData);

                  }

                  // set custom fields
                  const _array = [];
                  const test = res[`offer`]['customfieldItem'];
                  this.service.get_customfield().subscribe(
                    resp => {
                      this.customfield = resp['data'];
                      this.customfield.forEach((element, index) => {
                        const value = test.find(c => c.key === element.key) ?
                          test.find(c => c.key === element.key).value : '';
                        const new_customfield = {
                          key: element.key,
                          value,
                        };
                        this.customfieldItem.setControl(
                          index,
                          this.fb.group({
                            value: [value, [this.noWhitespaceValidatorForNotRequired]],
                            key: [element.key]
                          })
                        );
                        this.customfieldItem.updateValueAndValidity();
                        _array.push(new_customfield);
                      });
                      this.offer_data.customfieldItem = _array;
                    },
                    err => {
                      console.log(err);
                    });
                  // set custome fields
                  this.service.status(res[`offer`]['offerStatus'].value).subscribe(res1 => {
                    this.offerStatus = res1['status'];
                  });

                  this.form.controls['offerStatus']
                    .setValue({ label: `${res[`offer`][`offerStatus`].value}`, value: `${res[`offer`][`offerStatus`].value}` });

                  // resp['offer'].offerStatus = (this.offerStatus.find(o => o.value === resp['offer'].offerStatus).label);
                  if (!(res['offer'].acceptanceDate === 'Date of Offer Acceptance')) {
                    this.form.controls['acceptanceDate'].setValue(moment(new Date(res['offer'].acceptanceDate)).format('DD/MM/YYYY'));
                  } else {
                    this.form.controls['acceptanceDate'].setValue('Date of Offer Acceptance');
                  }// this.form.controls['acceptanceDate'].setValue(res['data'].acceptedAt);
                  if (this.is_Edit) {

                    setTimeout(() => {
                      const current_date = moment();
                      this.d = moment(new Date(res[`offer`].expirydate));
                      this.joining_Date = moment(new Date(res[`offer`].joiningdate));
                      if (res['offer'].title) {
                        this.form.controls['title'].setValue(res['offer'].title);
                      } else if (resp['offer'].title) {
                        this.form.controls['title'].setValue(resp['offer'].title);
                      } else if (res['offer'].offerStatus.value === 'Accepted' || this.d.isBefore(current_date, 'day')) {
                        this.form.controls['title'].setValue(resp['offer'].title);
                      }
                      // offer is accepted
                      if (res[`offer`].offerStatus.value === 'Accepted') {

                        this.isAccepted = true;

                        this.max_date = new Date(res[`offer`].expirydate);
                        this.form.controls['title'].disable();
                        if (res[`offer`][`salary`]) {
                          // this.form.controls['salarybracket'].disable();
                          document.getElementById('salarybracket').setAttribute('disabled', 'true');
                        } else if (res[`offer`][`salary_from`] && res[`offer`][`salary_to`]) {
                          // this.form.controls['salarybracket_from'].disable();
                          // this.form.controls['salarybracket_to'].disable();
                          document.getElementById('salarybracket_from').setAttribute('disabled', 'true');
                          document.getElementById('salarybracket_to').setAttribute('disabled', 'true');
                        }
                        this.disabled = true;
                        this.form.controls['offertype'].disable();
                        this.form.controls['notes'].disable();
                        document.getElementById('annual').setAttribute('disabled', 'true');
                        document.getElementById('hourly').setAttribute('disabled', 'true');

                        if (!(this.joining_Date.isBefore(current_date, 'day'))) {
                          this.isJoiningDate = true;
                        } else {
                          this.isJoiningDate = false;

                        }
                        this.updateValidation();
                      } else if (this.d.isBefore(current_date, 'day')) {

                        this.offerExpired = true;
                        // this.max_date = new Date(res[`data`].expirydate);
                        this.isAccepted = true;
                        this.form.controls['title'].disable();

                        if (res[`offer`][`salary`]) {

                          this.form.controls['salarybracket_from'].setValidators(null);
                          this.form.controls['salarybracket_to'].setValidators(null);
                          document.getElementById('salarybracket').setAttribute('disabled', 'true');
                          this.updateValidation();

                        } else if (res[`offer`][`salary_from`] && res[`offer`][`salary_to`]) {

                          this.form.controls['salarybracket'].setValidators(null);
                          document.getElementById('salarybracket_from').setAttribute('disabled', 'true');
                          document.getElementById('salarybracket_to').setAttribute('disabled', 'true');
                          this.updateValidation();

                        }


                        document.getElementById('expirydate').removeAttribute('disabled');
                        this.disabled = true;
                        // this.form.controls['offertype'].disable();
                        this.form.controls['notes'].disable();
                        document.getElementById('annual').setAttribute('disabled', 'true');
                        document.getElementById('hourly').setAttribute('disabled', 'true');

                        // disabled summernote
                        setTimeout(function () {
                          const len = document.getElementsByClassName('note-editable').length;
                          for (let p = 0; p < len; p++) {
                            document.getElementsByClassName('note-editable')[p].setAttribute('contenteditable', 'false');
                          }
                        }, 500);
                      }
                      // set communication
                      // this.isAccepted = false;
                      if (res[`offer`]['communication'] && res[`offer`]['communication'].length > 0) {
                        this.isSetCommunication = true;
                        this.communicationData = res[`offer`]['communication'];
                        const _communication_array = [];
                        let new_communication;
                        this.communicationData.forEach((element, index) => {
                          if (element.open !== undefined && element.reply !== undefined && element.reply_date !== undefined && element.open_date !== undefined && element.mail_send !== undefined) {
                            new_communication = {
                              'communicationname': element.communicationname,
                              'trigger': element.trigger,
                              'priority': element.priority,
                              'day': element.day,
                              'subject': element.subject,
                              'message': element.message,
                              '_id': element._id,
                              'open': element.open,
                              'reply': element.reply,
                              'open_date': element.open_date,
                              'reply_date': element.reply_date,
                              'mail_send': element.mail_send
                            };
                          } else if (element.open !== undefined && element.reply !== undefined && element.open_date !== undefined && element.mail_send !== undefined) {

                            new_communication = {
                              'communicationname': element.communicationname,
                              'trigger': element.trigger,
                              'priority': element.priority,
                              'day': element.day,
                              'subject': element.subject,
                              'message': element.message,
                              '_id': element._id,
                              'open': element.open,
                              'reply': element.reply,
                              'open_date': element.open_date,
                              'mail_send': element.mail_send
                            };
                          } else if (element.open !== undefined && element.reply !== undefined && element.mail_send !== undefined) {
                            new_communication = {
                              'communicationname': element.communicationname,
                              'trigger': element.trigger,
                              'priority': element.priority,
                              'day': element.day,
                              'subject': element.subject,
                              'message': element.message,
                              '_id': element._id,
                              'open': element.open,
                              'reply': element.reply,
                              'mail_send': element.mail_send
                            };
                          } else {
                            new_communication = {
                              'communicationname': element.communicationname,
                              'trigger': element.trigger,
                              'priority': element.priority,
                              'day': element.day,
                              'subject': element.subject,
                              'message': element.message,
                              '_id': element._id
                            };
                          }

                          this.communicationFieldItems.setControl(index, this.fb.group({
                            communicationname: ['', [Validators.required, this.noWhitespaceValidator]],
                            trigger: ['', Validators.required],
                            priority: ['', Validators.required],
                            day: ['', Validators.required],
                            subject: ['', [Validators.required, this.noWhitespaceValidator]],
                            message: ['', [Validators.required, this.noWhitespaceValidator]]
                          }));
                          _communication_array.push(new_communication);
                        });
                        this.communicationData = _communication_array;
                      } else {
                        this.isSetCommunication = false;
                      }
                      // set communication

                      // set AdHoc
                      if (res[`offer`]['AdHoc'] && res[`offer`]['AdHoc'].length > 0) {
                        this.AdHocCommunicationData = res[`offer`]['AdHoc'];
                        const _Adhoc_communication_array = [];
                        this.AdHocCommunicationData.forEach((element, index) => {
                          let new_communication;
                          if (element.AdHoc_open !== undefined && element.AdHoc_reply !== undefined && element.AdHoc_reply_date !== undefined && element.AdHoc_open_date !== undefined && element.AdHoc_mail_send !== undefined) {
                            new_communication = {
                              'AdHoc_communicationname': element.AdHoc_communicationname,
                              'AdHoc_trigger': element.AdHoc_trigger,
                              'AdHoc_priority': element.AdHoc_priority,
                              'AdHoc_day': element.AdHoc_day,
                              'AdHoc_subject': element.AdHoc_subject,
                              'AdHoc_message': element.AdHoc_message,
                              '_id': element._id,
                              'AdHoc_open': element.AdHoc_open,
                              'AdHoc_reply': element.AdHoc_reply,
                              'AdHoc_open_date': element.AdHoc_open_date,
                              'AdHoc_reply_date': element.AdHoc_reply_date,
                              'AdHoc_mail_send': element.AdHoc_mail_send
                            };
                          } else if (element.AdHoc_open !== undefined && element.AdHoc_reply !== undefined && element.AdHoc_open_date !== undefined && element.AdHoc_mail_send !== undefined) {
                            new_communication = {
                              'AdHoc_communicationname': element.AdHoc_communicationname,
                              'AdHoc_trigger': element.AdHoc_trigger,
                              'AdHoc_priority': element.AdHoc_priority,
                              'AdHoc_day': element.AdHoc_day,
                              'AdHoc_subject': element.AdHoc_subject,
                              'AdHoc_message': element.AdHoc_message,
                              '_id': element._id,
                              'AdHoc_open': element.AdHoc_open,
                              'AdHoc_reply': element.AdHoc_reply,
                              'AdHoc_open_date': element.AdHoc_open_date,
                              'AdHoc_mail_send': element.AdHoc_mail_send
                            };
                          } else if (element.AdHoc_open !== undefined && element.AdHoc_reply !== undefined && element.AdHoc_mail_send !== undefined) {
                            new_communication = {
                              'AdHoc_communicationname': element.AdHoc_communicationname,
                              'AdHoc_trigger': element.AdHoc_trigger,
                              'AdHoc_priority': element.AdHoc_priority,
                              'AdHoc_day': element.AdHoc_day,
                              'AdHoc_subject': element.AdHoc_subject,
                              'AdHoc_message': element.AdHoc_message,
                              '_id': element._id,
                              'AdHoc_open': element.AdHoc_open,
                              'AdHoc_reply': element.AdHoc_reply,
                              'AdHoc_mail_send': element.AdHoc_mail_send
                            };
                          } else {
                            new_communication = {
                              'AdHoc_communicationname': element.AdHoc_communicationname,
                              'AdHoc_trigger': element.AdHoc_trigger,
                              'AdHoc_priority': element.AdHoc_priority,
                              'AdHoc_day': element.AdHoc_day,
                              'AdHoc_subject': element.AdHoc_subject,
                              'AdHoc_message': element.AdHoc_message,
                              '_id': element._id
                            };
                          }
                          this.AdHocCommunication.setControl(index, this.fb.group({
                            AdHoc_communicationname: ['', [Validators.required, this.noWhitespaceValidator]],
                            AdHoc_trigger: ['', Validators.required],
                            AdHoc_priority: ['', Validators.required],
                            AdHoc_day: ['', Validators.required],
                            AdHoc_subject: ['', [Validators.required, this.noWhitespaceValidator]],
                            AdHoc_message: ['', [Validators.required, this.noWhitespaceValidator]]
                          }));

                          _Adhoc_communication_array.push(new_communication);
                        });
                        this.AdHocCommunicationData = _Adhoc_communication_array;
                      }
                      // set AdHoc
                      this.form.controls['email'].setValue(res[`offer`].user_id.email);
                      this.form.controls['candidate_name'].setValue(
                        res[`candidate`]['data'].firstname + ' ' + res[`candidate`]['data'].lastname
                      );



                      // this.form.controls['title'].setValue(resp[`offer`].title);
                      this.form.controls.salarytype.setValue(res[`offer`].salarytype);
                      if (res[`offer`].salarytype === 'annual') {
                        document.getElementById('salaryduration').setAttribute('disabled', 'true');
                      } else {
                        document.getElementById('salaryduration').setAttribute('disabled', 'false');
                        this.form.controls['salaryduration'].setValue(res[`offer`].salaryduration);
                      }
                      this.form.controls['location'].setValue(res[`offer`]['location'][`_id`]);
                      this.form.controls['expirydate'].setValue(new Date(res[`offer`].expirydate));
                      this.form.controls['joiningdate'].setValue(new Date(res[`offer`].joiningdate));
                      this.form.controls['offertype'].setValue(res[`offer`].offertype);

                      if (res[`offer`].acceptanceDate) {
                        this.form.controls['acceptanceDate'].setValue(moment(new Date(res[`offer`].acceptanceDate)).format('DD/MM/YYYY'));
                      } else {
                        this.form.controls['acceptanceDate'].setValue('Date of Offer Acceptance');
                      }// this.form.controls['acceptanceDate'].setValue(res['data'].acceptedAt);


                      this.form.controls['notes'].setValue(res[`offer`].notes);
                      this.service.status(res[`offer`]['status']).subscribe(res1 => {
                        this.offerStatus = res1['status'];
                      });

                      this.form.controls['offerStatus']
                        .setValue({ label: `${res[`offer`][`status`]}`, value: `${res[`offer`][`status`]}` });

                      if (res[`offer`].salary) {
                        this.form.controls['salarybracket'].setValue(res[`offer`].salary);
                        document.getElementById('salarybracket_to').setAttribute('disabled', 'true');
                        document.getElementById('salarybracket_from').setAttribute('disabled', 'true');
                        this.form.controls['salarybracket_from'].setValidators(null);
                        this.form.controls['salarybracket_to'].setValidators(null);
                        this.updateValidation();
                      }

                      if (res[`offer`].salary_from && res[`offer`].salary_to) {
                        this.form.controls['salarybracket_from'].setValue(res[`offer`].salary_from);
                        this.form.controls['salarybracket_to'].setValue(res[`offer`].salary_to);
                        document.getElementById('salarybracket').setAttribute('disabled', 'true');
                        this.form.controls['salarybracket'].setValidators(null);
                        this.updateValidation();
                      }
                      // if (res['data'].groups) {
                      // this.form.controls['group'].setValue(res['groups']);
                      // this.form.controls['high_unopened'].setValue(res.high_unopened);
                      // this.form.controls['high_notreplied'].setValue(res[`data`].high_notreplied);
                      // this.form.controls['medium_unopened'].setValue(res[`data`].medium_unopened);
                      // this.form.controls['medium_notreplied'].setValue(res[`data`].medium_notreplied);

                      // }
                      const _array = [];
                      const test = res[`offer`]['customfeild'];
                      this.service.get_customfield().subscribe(
                        res => {
                          this.customfield = res['data'];
                          this.customfield.forEach((element, index) => {
                            const value = test.find(c => c.key === element.key) ?
                              test.find(c => c.key === element.key).value : '';
                            const new_customfield = {
                              key: element.key,
                              value,
                            };
                            this.customfieldItem.setControl(
                              index,
                              this.fb.group({
                                value: [value, [this.noWhitespaceValidatorForNotRequired]],
                                key: [element.key]
                              })
                            );
                            this.customfieldItem.updateValueAndValidity();
                            _array.push(new_customfield);
                          });
                          this.offer_data.customfieldItem = _array;
                        },
                        err => {
                          console.log(err);
                        });



                      this.resData = res[`offer`];
                      // if (this.resData.[`offer`]high_unopened !== '' && this.resData.high_notreplied !== '' && this.resData.medium_unopened !== '' && this.resData.medium_notreplied !== '') {
                      this.groupData.high_unopened = this.resData.high_unopened;
                      this.groupData.high_notreplied = this.resData.high_notreplied;
                      this.groupData.medium_unopened = this.resData.medium_unopened;
                      this.groupData.medium_notreplied = this.resData.medium_notreplied;
                      // }

                      if (this.resData.acceptanceDate) {
                        this.isAcceptedView = moment(new Date(this.resData.acceptanceDate)).format('DD/MM/YYYY');
                      } else {
                        this.isAcceptedView = 'Date of Offer Acceptance';
                      }
                      // if (
                      //   !(this.resData.high_notreplied || this.resData.high_unopened || this.resData.medium_notreplied || this.resData.medium_unopened)) {
                      //   this.getGroupDetails = false;
                      // } else if (this.group_optoins.value === '') {
                      //   this.getGroupDetails = false;
                      // }

                      this.resData.customfeild.map(res => {
                        if (res.value) {
                          this.isCustomFieldView = true;
                        }
                      });

                      this.candidateData = res['candidate']['data'];
                      this.grpId = this.resData.user_id;
                      this.socketService.joinGrp(this.resData.user_id);

                      this.spinner.hide();
                      this.groupDetail(res[`offer`].groups);

                    }, 200);
                  }
                }, 300);
              } else if (resp[`offer`] && (this.response === '' || this.response === undefined)) {
                if (this.userDetail.role === 'employer' || this.userDetail.role === 'sub-employer') {
                  // edit offer
                  if (this.is_Edit) {
                    setTimeout(() => {
                      const current_date = moment();
                      this.d = moment(new Date(resp[`offer`].expirydate));
                      this.joining_Date = moment(new Date(resp[`offer`].joiningdate));
                      // offer is accepted
                      if (resp[`offer`].status === 'Accepted') {
                        this.isAccepted = true;
                        this.max_date = new Date(resp[`offer`].expirydate);
                        this.form.controls['title'].disable();
                        if (resp[`offer`][`salary`]) {
                          // this.form.controls['salarybracket'].disable();
                          document.getElementById('salarybracket').setAttribute('disabled', 'true');
                        } else if (resp[`offer`][`salary_from`] && resp[`offer`][`salary_to`]) {
                          // this.form.controls['salarybracket_from'].disable();
                          // this.form.controls['salarybracket_to'].disable();
                          document.getElementById('salarybracket_from').setAttribute('disabled', 'true');
                          document.getElementById('salarybracket_to').setAttribute('disabled', 'true');
                        }
                        this.disabled = true;
                        this.form.controls['offertype'].disable();
                        this.form.controls['notes'].disable();
                        document.getElementById('annual').setAttribute('disabled', 'true');
                        document.getElementById('hourly').setAttribute('disabled', 'true');

                        if (!(this.joining_Date.isBefore(current_date, 'day'))) {
                          this.isJoiningDate = true;
                        } else {
                          this.isJoiningDate = false;
                        }
                        this.updateValidation();
                      } else if (this.d.isBefore(current_date, 'day')) {
                        this.offerExpired = true;
                        // this.max_date = new Date(resp[`data`].expirydate);
                        this.isAccepted = true;
                        this.form.controls['title'].disable();

                        if (resp[`offer`][`salary`]) {

                          this.form.controls['salarybracket_from'].setValidators(null);
                          this.form.controls['salarybracket_to'].setValidators(null);
                          document.getElementById('salarybracket').setAttribute('disabled', 'true');
                          this.updateValidation();

                        } else if (resp[`offer`][`salary_from`] && resp[`offer`][`salary_to`]) {

                          this.form.controls['salarybracket'].setValidators(null);
                          document.getElementById('salarybracket_from').setAttribute('disabled', 'true');
                          document.getElementById('salarybracket_to').setAttribute('disabled', 'true');
                          this.updateValidation();

                        }


                        document.getElementById('expirydate').removeAttribute('disabled');
                        this.disabled = true;
                        // this.form.controls['offertype'].disable();
                        this.form.controls['notes'].disable();
                        document.getElementById('annual').setAttribute('disabled', 'true');
                        document.getElementById('hourly').setAttribute('disabled', 'true');

                        // disabled summernote
                        setTimeout(function () {
                          const len = document.getElementsByClassName('note-editable').length;
                          for (let p = 0; p < len; p++) {
                            document.getElementsByClassName('note-editable')[p].setAttribute('contenteditable', 'false');
                          }
                        }, 500);
                      }
                      // set communication
                      // this.isAccepted = false;
                      if (resp[`offer`]['communication'] && resp[`offer`]['communication'].length > 0) {
                        this.isSetCommunication = true;
                        this.communicationData = resp[`offer`]['communication'];
                        const _communication_array = [];
                        let new_communication;
                        this.communicationData.forEach((element, index) => {
                          if (element.open !== undefined && element.reply !== undefined && element.reply_date !== undefined && element.open_date !== undefined && element.mail_send !== undefined) {
                            new_communication = {
                              'communicationname': element.communicationname,
                              'trigger': element.trigger,
                              'priority': element.priority,
                              'day': element.day,
                              'subject': element.subject,
                              'message': element.message,
                              '_id': element._id,
                              'open': element.open,
                              'reply': element.reply,
                              'open_date': element.open_date,
                              'reply_date': element.reply_date,
                              'mail_send': element.mail_send
                            };
                          } else if (element.open !== undefined && element.reply !== undefined && element.open_date !== undefined && element.mail_send !== undefined) {

                            new_communication = {
                              'communicationname': element.communicationname,
                              'trigger': element.trigger,
                              'priority': element.priority,
                              'day': element.day,
                              'subject': element.subject,
                              'message': element.message,
                              '_id': element._id,
                              'open': element.open,
                              'reply': element.reply,
                              'open_date': element.open_date,
                              'mail_send': element.mail_send
                            };
                          } else if (element.open !== undefined && element.reply !== undefined && element.mail_send !== undefined) {
                            new_communication = {
                              'communicationname': element.communicationname,
                              'trigger': element.trigger,
                              'priority': element.priority,
                              'day': element.day,
                              'subject': element.subject,
                              'message': element.message,
                              '_id': element._id,
                              'open': element.open,
                              'reply': element.reply,
                              'mail_send': element.mail_send
                            };
                          } else {
                            new_communication = {
                              'communicationname': element.communicationname,
                              'trigger': element.trigger,
                              'priority': element.priority,
                              'day': element.day,
                              'subject': element.subject,
                              'message': element.message,
                              '_id': element._id
                            };
                          }

                          this.communicationFieldItems.setControl(index, this.fb.group({
                            communicationname: ['', [Validators.required, this.noWhitespaceValidator]],
                            trigger: ['', Validators.required],
                            priority: ['', Validators.required],
                            day: ['', Validators.required],
                            subject: ['', [Validators.required, this.noWhitespaceValidator]],
                            message: ['', [Validators.required, this.noWhitespaceValidator]]
                          }));
                          _communication_array.push(new_communication);
                        });
                        this.communicationData = _communication_array;
                      } else {
                        this.isSetCommunication = false;
                      }
                      // set communication

                      // set AdHoc
                      if (resp[`offer`]['AdHoc'] && resp[`offer`]['AdHoc'].length > 0) {
                        this.AdHocCommunicationData = resp[`offer`]['AdHoc'];
                        const _Adhoc_communication_array = [];
                        this.AdHocCommunicationData.forEach((element, index) => {
                          let new_communication;
                          if (element.AdHoc_open !== undefined && element.AdHoc_reply !== undefined && element.AdHoc_reply_date !== undefined && element.AdHoc_open_date !== undefined && element.AdHoc_mail_send !== undefined) {
                            new_communication = {
                              'AdHoc_communicationname': element.AdHoc_communicationname,
                              'AdHoc_trigger': element.AdHoc_trigger,
                              'AdHoc_priority': element.AdHoc_priority,
                              'AdHoc_day': element.AdHoc_day,
                              'AdHoc_subject': element.AdHoc_subject,
                              'AdHoc_message': element.AdHoc_message,
                              '_id': element._id,
                              'AdHoc_open': element.AdHoc_open,
                              'AdHoc_reply': element.AdHoc_reply,
                              'AdHoc_open_date': element.AdHoc_open_date,
                              'AdHoc_reply_date': element.AdHoc_reply_date,
                              'AdHoc_mail_send': element.AdHoc_mail_send
                            };
                          } else if (element.AdHoc_open !== undefined && element.AdHoc_reply !== undefined && element.AdHoc_open_date !== undefined && element.AdHoc_mail_send !== undefined) {
                            new_communication = {
                              'AdHoc_communicationname': element.AdHoc_communicationname,
                              'AdHoc_trigger': element.AdHoc_trigger,
                              'AdHoc_priority': element.AdHoc_priority,
                              'AdHoc_day': element.AdHoc_day,
                              'AdHoc_subject': element.AdHoc_subject,
                              'AdHoc_message': element.AdHoc_message,
                              '_id': element._id,
                              'AdHoc_open': element.AdHoc_open,
                              'AdHoc_reply': element.AdHoc_reply,
                              'AdHoc_open_date': element.AdHoc_open_date,
                              'AdHoc_mail_send': element.AdHoc_mail_send
                            };
                          } else if (element.AdHoc_open !== undefined && element.AdHoc_reply !== undefined && element.AdHoc_mail_send !== undefined) {
                            new_communication = {
                              'AdHoc_communicationname': element.AdHoc_communicationname,
                              'AdHoc_trigger': element.AdHoc_trigger,
                              'AdHoc_priority': element.AdHoc_priority,
                              'AdHoc_day': element.AdHoc_day,
                              'AdHoc_subject': element.AdHoc_subject,
                              'AdHoc_message': element.AdHoc_message,
                              '_id': element._id,
                              'AdHoc_open': element.AdHoc_open,
                              'AdHoc_reply': element.AdHoc_reply,
                              'AdHoc_mail_send': element.AdHoc_mail_send
                            };
                          } else {
                            new_communication = {
                              'AdHoc_communicationname': element.AdHoc_communicationname,
                              'AdHoc_trigger': element.AdHoc_trigger,
                              'AdHoc_priority': element.AdHoc_priority,
                              'AdHoc_day': element.AdHoc_day,
                              'AdHoc_subject': element.AdHoc_subject,
                              'AdHoc_message': element.AdHoc_message,
                              '_id': element._id
                            };
                          }
                          this.AdHocCommunication.setControl(index, this.fb.group({
                            AdHoc_communicationname: ['', [Validators.required, this.noWhitespaceValidator]],
                            AdHoc_trigger: ['', Validators.required],
                            AdHoc_priority: ['', Validators.required],
                            AdHoc_day: ['', Validators.required],
                            AdHoc_subject: ['', [Validators.required, this.noWhitespaceValidator]],
                            AdHoc_message: ['', [Validators.required, this.noWhitespaceValidator]]
                          }));

                          _Adhoc_communication_array.push(new_communication);
                        });
                        this.AdHocCommunicationData = _Adhoc_communication_array;
                      } else {

                      }
                      // set AdHoc
                      this.form.controls['email'].setValue(resp[`offer`].user_id.email);
                      this.form.controls['candidate_name'].setValue(
                        resp[`candidate`]['data'].firstname + ' ' + resp[`candidate`]['data'].lastname
                      );
                      this.form.controls['title'].setValue(resp[`offer`].title);
                      this.form.controls.salarytype.setValue(resp[`offer`].salarytype);
                      if (resp[`offer`].salarytype === 'annual') {
                        document.getElementById('salaryduration').setAttribute('disabled', 'true');
                      } else {
                        this.form.controls['salaryduration'].setValue(resp[`offer`].salaryduration);
                      }
                      this.form.controls['location'].setValue(resp[`offer`]['location'][`_id`]);
                      this.form.controls['expirydate'].setValue(new Date(resp[`offer`].expirydate));
                      this.form.controls['joiningdate'].setValue(new Date(resp[`offer`].joiningdate));
                      this.form.controls['offertype'].setValue(resp[`offer`].offertype);

                      if (resp[`offer`].acceptedAt) {
                        this.form.controls['acceptanceDate'].setValue(moment(new Date(resp[`offer`].acceptedAt)).format('DD/MM/YYYY'));
                      } else {
                        this.form.controls['acceptanceDate'].setValue('Date of Offer Acceptance');
                      }// this.form.controls['acceptanceDate'].setValue(resp['data'].acceptedAt);


                      this.form.controls['notes'].setValue(resp[`offer`].notes);
                      this.service.status(resp[`offer`]['status']).subscribe(res1 => {
                        this.offerStatus = res1['status'];
                      });

                      this.form.controls['offerStatus']
                        .setValue({ label: `${resp[`offer`][`status`]}`, value: `${resp[`offer`][`status`]}` });

                      if (resp[`offer`].salary) {
                        this.form.controls['salarybracket'].setValue(resp[`offer`].salary);
                        document.getElementById('salarybracket_to').setAttribute('disabled', 'true');
                        document.getElementById('salarybracket_from').setAttribute('disabled', 'true');
                        this.form.controls['salarybracket_from'].setValidators(null);
                        this.form.controls['salarybracket_to'].setValidators(null);
                        this.updateValidation();
                      }

                      if (resp[`offer`].salary_from && resp[`offer`].salary_to) {
                        this.form.controls['salarybracket_from'].setValue(resp[`offer`].salary_from);
                        this.form.controls['salarybracket_to'].setValue(resp[`offer`].salary_to);
                        document.getElementById('salarybracket').setAttribute('disabled', 'true');
                        this.form.controls['salarybracket'].setValidators(null);
                        this.updateValidation();
                      }
                      // if (resp['data'].groups) {
                      // this.form.controls['group'].setValue(resp['groups']);
                      // this.form.controls['high_unopened'].setValue(resp.high_unopened);
                      // this.form.controls['high_notreplied'].setValue(resp[`data`].high_notreplied);
                      // this.form.controls['medium_unopened'].setValue(resp[`data`].medium_unopened);
                      // this.form.controls['medium_notreplied'].setValue(resp[`data`].medium_notreplied);

                      // }
                      const _array = [];
                      const test = resp[`offer`]['customfeild'];
                      this.service.get_customfield().subscribe(
                        resp => {
                          this.customfield = resp['data'];
                          this.customfield.forEach((element, index) => {
                            const value = test.find(c => c.key === element.key) ?
                              test.find(c => c.key === element.key).value : '';
                            const new_customfield = {
                              key: element.key,
                              value,
                            };
                            this.customfieldItem.setControl(
                              index,
                              this.fb.group({
                                value: [value, [this.noWhitespaceValidatorForNotRequired]],
                                key: [element.key]
                              })
                            );
                            this.customfieldItem.updateValueAndValidity();
                            _array.push(new_customfield);
                          });
                          this.offer_data.customfieldItem = _array;
                        },
                        err => {
                          console.log(err);
                        });



                      this.resData = resp[`offer`];
                      // if (this.resData.[`offer`]high_unopened !== '' && this.resData.high_notreplied !== '' && this.resData.medium_unopened !== '' && this.resData.medium_notreplied !== '') {
                      this.groupData.high_unopened = this.resData.high_unopened;
                      this.groupData.high_notreplied = this.resData.high_notreplied;
                      this.groupData.medium_unopened = this.resData.medium_unopened;
                      this.groupData.medium_notreplied = this.resData.medium_notreplied;
                      // }

                      if (this.resData.acceptedAt) {
                        this.isAcceptedView = moment(new Date(this.resData.acceptedAt)).format('DD/MM/YYYY');
                      } else {
                        this.isAcceptedView = 'Date of Offer Acceptance';
                      }
                      // if (
                      //   !(this.resData.high_notreplied || this.resData.high_unopened || this.resData.medium_notreplied || this.resData.medium_unopened)) {
                      //   this.getGroupDetails = false;
                      // } else if (this.group_optoins.value === '') {
                      //   this.getGroupDetails = false;
                      // }

                      this.resData.customfeild.map(res => {
                        if (res.value) {
                          this.isCustomFieldView = true;
                        }
                      });

                      this.candidateData = resp['candidate']['data'];
                      this.grpId = this.resData.user_id;
                      this.socketService.joinGrp(this.resData.user_id);

                      this.spinner.hide();
                      this.groupDetail(resp[`offer`].groups);

                    }, 200);
                  }


                }
              } else if (res === undefined && resp === undefined) {
                this.spinner.hide();
                this.formInit();
              }
            });
            // this.spinner.hide();
          });
          // this.formInit();
        }
        );



    } else if (this.userDetail.role === 'candidate' || this.userDetail.role === 'admin') {
      this.spinner.hide();
      this.getDetail(this.id);
    }
  }

  // getDetail
  async getDetail(id: string) {
    id = this.id;
    if (id) {
      if (this.userDetail.role === 'employer' || this.userDetail.role === 'sub-employer') {
        return new Promise((pass, fail) => {
          this.service.offer_detail(id).subscribe((resp: any) => {
            this.spinner.hide();
            if (this.is_View) {
              // if (!(resp['data'].status === 'Accepted')) {
              resp['data'].offertype = (this.offer_type_optoins.find(o => o.value === resp['data'].offertype).label);
              // }
              if (resp['data'][`AdHoc`].length > 0) {

                resp['data'][`AdHoc`].forEach(element => {
                  element.AdHoc_trigger = (this.Trigger_Option.find(o => o.value === element.AdHoc_trigger).label);
                });
              }
              if (resp['data'][`communication`].length > 0) {
                this.isSetCommunication = true;

                resp['data'][`communication`].forEach(element => {
                  element.trigger =
                    (this.Trigger_Option.find(o => o.value === element.trigger).label);
                });
                // resp[`data`][`communication`][0].trigger =
                //   (this.Trigger_Option.find(o => o.value === resp[`data`][`communication`][0].trigger).label);
              } else {
                this.isSetCommunication = false;
              }

              // disabled summernote
              setTimeout(function () {
                // $(".note-editable").attr("contenteditable", "false")
                const len = document.getElementsByClassName('note-editable').length;
                for (let p = 0; p < len; p++) {
                  document.getElementsByClassName('note-editable')[p].setAttribute('contenteditable', 'false');
                }
              }, 500);

              this.resData = resp['data'];
              this.groupData.high_unopened = this.resData.high_unopened;
              this.groupData.high_notreplied = this.resData.high_notreplied;
              this.groupData.medium_unopened = this.resData.medium_unopened;
              this.groupData.medium_notreplied = this.resData.medium_notreplied;
              // }

              if (this.resData.acceptedAt) {
                this.isAcceptedView = moment(new Date(this.resData.acceptedAt)).format('DD/MM/YYYY');
              } else {
                this.isAcceptedView = 'Date of Offer Acceptance';
              }

              this.resData.customfeild.map(res => {
                if (res.value) {
                  this.isCustomFieldView = true;
                }
              });

              this.candidateData = resp['candidate_data']['data'];
              this.grpId = this.resData.user_id;
              this.socketService.joinGrp(this.resData.user_id);
              this.service.status(this.resData.status).subscribe(resp => {
                this.offerStatus = resp['status'];
              });
              this.spinner.hide();
              this.groupDetail(resp.groups);

            }
            const obj = {
              'offer': resp['data'],
              'candidate': resp['candidate_data']
            };
            pass(obj);
          }, err => {
            this.spinner.hide();
            fail(err);
          });

        });
      }

      if (this.userDetail.role === 'candidate') {
        this.service.offer_detail_candidate(this.id).subscribe((res) => {
          this.is_View = true;
          this.spinner.hide();
          this.resData = res[`data`][0];

          if (this.is_View) {
            this.resData.offertype = (this.offer_type_optoins.find(o => o.value === this.resData.offertype).label);
          }
          const d = new Date();
          d.setDate(d.getDate() - 1);
          if (this.resData.status && d > new Date(this.resData.expirydate)) {
            this.isExpired = true;
          } else {
            this.isExpired = false;
          }
          this.userName = this.resData.employer_id.employer.companyname;
          if (this.resData.acceptedAt) {
            this.isAcceptedView = moment(new Date(this.resData.acceptedAt)).format('DD/MM/YYYY');
          } else {
            this.isAcceptedView = 'Date of Offer Acceptance';
          }
          this.resData.customfeild.map(res => {
            if (res.value) {
              this.isCustomFieldView = true;
            }
          });
          this.spinner.hide();
          this.is_View = true;
          this.resData = res[`data`][0];
        });



      } else if (this.userDetail.role === 'admin') {

        //  do code here for admin side - offer detail
        this.adminService.offer_detail_admin(this.id).subscribe((res) => {
          this.spinner.hide();



          // res[`data`].offertype = (this.offer_type_optoins.find(o => o.value === res[`data`].offertype).label);
          if (res[`data`][`AdHoc`].length > 0) {
            res[`data`][`AdHoc`].forEach(element => {
              element.AdHoc_trigger = (this.Trigger_Option.find(o => o.value === element.AdHoc_trigger).label);
            });
          }

          if (res[`data`][`communication`].length > 0) {
            res[`data`][`communication`].forEach(element => {
              element.trigger =
                (this.Trigger_Option.find(o => o.value === element.trigger).label);
            });
            // res[`data`][`communication`][0].trigger =
            //   (this.Trigger_Option.find(o => o.value === res[`data`][`communication`][0].trigger).label);
          }


          // disabled summernote
          setTimeout(function () {
            const len = document.getElementsByClassName('note-editable').length;
            for (let p = 0; p < len; p++) {
              document.getElementsByClassName('note-editable')[p].setAttribute('contenteditable', 'false');
            }
          }, 500);


          this.resData = res[`data`];
          this.groupData.high_unopened = this.resData.high_unopened;
          this.groupData.high_notreplied = this.resData.high_notreplied;
          this.groupData.medium_unopened = this.resData.medium_unopened;
          this.groupData.medium_notreplied = this.resData.medium_notreplied;
          this.resData.offertype = (this.offer_type_optoins.find(o => o.value === this.resData.offertype).label);
          if (this.resData.acceptedAt) {
            this.isAcceptedView = moment(new Date(this.resData.acceptedAt)).format('DD/MM/YYYY');
          } else {
            this.isAcceptedView = 'Date of Offer Acceptance';
          }
          // if (
          //   !(this.resData.high_notreplied || this.resData.high_unopened || this.resData.medium_notreplied || this.resData.medium_unopened)) {
          //   this.getGroupDetails = false;
          // } else if (this.group_optoins.value === '') {
          //   this.getGroupDetails = false;
          // }
          this.resData.customfeild.map(res => {
            if (res.value) {
              this.isCustomFieldView = true;
            }
          });
          this.candidateData = res['candidate_data']['data'];
          this.spinner.hide();
          this.is_View = true;
          this.resData.groupName = res['data']['groups']['name'];
          this.groupDetail(res[`data`].groups);

        });

      }
    }

  }



  // get candidate details
  async getCandidateList() {
    const promise = new Promise((resolve, reject) => {
      this.service.get_candidate_list().subscribe(
        async res => {
          this.candidate = await res['data'];
          for (const element of res['data']) {
            this.candidateList.push({
              label: element.firstname + ' ' + element.lastname,
              value: element.user_id
            });
          }
          resolve(this.candidate);
        }, err => {
          reject(err);
        });
    });
    return promise;
  }

  async getCountryList() {
    this.service.get_salary_country().subscribe(
      res => {
        this.country = res['data'];
        res['data'].forEach(element => {
          this.countryList.push({
            label: element.country_name,
            value: element.country_id
          });
        });
      },
      err => {
        console.log(err);
      }
    );
  }

  // get customField list
  async customFieldList() {
    this.service.get_customfield().subscribe(
      res => {

        if (res[`data`].length > 0) {
          this.isCustomFieldAdd = true;
        }
        this.customfield = res['data'];

        const _array = [];
        this.customfield.forEach((element, index) => {
          const new_customfield = {
            key: element.key,
            value: '',
          };
          this.customfieldItem.setControl(
            index,
            this.fb.group({
              value: ['', [this.noWhitespaceValidatorForNotRequired]],
              key: [element.key],
            })
          );
          _array.push(new_customfield);
        });
        this.offer_data.customfieldItem = _array;

      },
      err => {
        console.log(err);
      }
    );
  }

  // get group list
  async groupList() {
    this.service.get_groups().subscribe(res => {

      if (res[`data`].data) {
        res[`data`].data.forEach(element => {
          this.group_optoins.push({ label: element.name, value: element._id });
        });
      }
    },
      err => {
        console.log(err);
      }
    );
  }

  async groupDetail(id) {
    if (!(this.userDetail.role === 'admin')) {
      const groupById = this.group_optoins.find(x => x.value === id);
      if (groupById) {
        this.form.controls.group.setValue(groupById.value);
        this.getGroupDetails = true;
        this.setGroupFormControl();

        // this.groupData.high_unopened = this.resData.high_unopened;
        // this.groupData.high_notreplied = this.resData.high_notreplied;
        // this.groupData.medium_unopened = this.resData.medium_unopened;
        // this.groupData.medium_notreplied = this.resData.medium_notreplied;

      }
      if (groupById && this.is_View) {
        this.resData.groupName = groupById.label;
      }
    } else {
      this.getGroupDetails = true;
    }

  }

  //  set controls for group form
  setGroupFormControl() {
    // this.getGroupdays().then((res: any) => {
    this.form.setControl('high_unopened',
      new FormControl('', [Validators.pattern(/^[0-9]\d*$/), Validators.required]));
    this.form.setControl('high_notreplied',
      new FormControl('', [Validators.pattern(/^[0-9]\d*$/), Validators.required]));
    this.form.setControl('medium_unopened',
      new FormControl('', [Validators.pattern(/^[0-9]\d*$/), Validators.required]));
    this.form.setControl('medium_notreplied',
      new FormControl('', [Validators.pattern(/^[0-9]\d*$/), Validators.required]));

    this.form.updateValueAndValidity();
    // }).catch(err => {
    // });
  }

  // unset controls for group form
  // unset_GroupFormControl() {
  //   this.form.removeControl('high_unopened');
  //   this.form.removeControl('high_notreplied');
  //   this.form.removeControl('medium_unopened');
  //   this.form.removeControl('medium_notreplied');

  //   this.form.updateValueAndValidity();
  // }

  // On change of group
  groupChange(e) {
    if (e.value) {
      if (this.form.value.salarybracket) {
        this.form.controls['salarybracket_from'].setValidators(null);
        this.form.controls['salarybracket_to'].setValidators(null);
        this.updateValidation();
      } else if (this.form.value.salarybracket_from && this.form.value.salarybracket_to) {
        this.form.controls['salarybracket'].setValidators(null);
        this.updateValidation();
      }

      this.Groupservice.get_detail(e.value).subscribe(res => {
        if (res) {
          // this.getGroupDetails = true;
          this.isSetCommunication = true;
          this.setGroupFormControl();
          this.form.controls['high_unopened'].setValue(res[`data`][`data`][0].high_unopened);
          this.form.controls['high_notreplied'].setValue(res[`data`][`data`][0].high_notreplied);
          this.form.controls['medium_unopened'].setValue(res[`data`][`data`][0].medium_unopened);
          this.form.controls['medium_notreplied'].setValue(res[`data`][`data`][0].medium_notreplied);
        } else {
          // this.getGroupDetails = false;
          this.isSetCommunication = false;
          // this.unset_GroupFormControl();
          this.unset_communication();
        }

        this.groupData = res['data']['data'][0];
        if (res['communication']['data'] && res['communication']['data'].length > 0) {
          this.communicationData = res['communication']['data'][0]['communication'];
          this.isAdHoc_ButtonShow = true;
        }

        // set communication
        if (this.communicationData && this.communicationData.length > 0) {
          this.is_communication_added = true;
          const _array = [];

          this.communicationData.forEach((element, index) => {
            // index = index.i
            const new_communication = {
              'communicationname': element.communicationname,
              'trigger': element.trigger,
              'priority': element.priority,
              'day': element.day,
              'subject': element.subject,
              'message': element.message,
            };
            this.communicationFieldItems.setControl(index, this.fb.group({
              communicationname: ['', [Validators.required, this.noWhitespaceValidator]],
              trigger: ['', Validators.required],
              priority: ['', Validators.required],
              day: ['', [Validators.required, Validators.pattern(/^[0-9]\d*$/)]],
              subject: ['', [Validators.required, , this.noWhitespaceValidator]],
              message: ['', [Validators.required, this.noWhitespaceValidator]]
              // message: ['', Validators.required]
            }));
            _array.push(new_communication);
          });
          this.communicationData = _array;
        } else {
          this.add_new_communication();
        }
      }, (err) => {
        this.getGroupDetails = false;
        this.isSetCommunication = false;
      });

    } else {
      this.getGroupDetails = false;
      this.isSetCommunication = false;
      // this.unset_GroupFormControl();s
      this.communicationData = null;
      this.unset_communication();
      this.getGroupdays();

      // this.communicationFieldItems['controls'].forEach(element => {
      //   console.log('element=>', element);
      //   element['controls'].setValidators(null);
      // });
      // this.updateValidation();
      // this.form.controls.communicationFieldItems.reset();
      // this.communicationFieldItems.removeAt
    }
    this.isTouched(e.value);
  }

  Accept(id, type) {
    // this.accept_btn = true;
    this.show_spinner = true;
    if (this.is_View) {
      type = (this.offer_type_optoins.find(o => o.label === this.resData.offertype).value);
    }

    this.service.type_message({ 'type': type }).subscribe(res => {
      if (type === 'noCommit') {
        this.isNoCommit = true;
        this.Info_msg = res[`data`][`message`];
        this.modalService.open(this.content2, ModalOptions);
      } else {
        this.isNoCommit = false;
        this.Info_msg = res[`data`][`message`];
        this.modalService.open(this.content2, ModalOptions);

      }
      this.OfferID = id;
    });
    // this.service.offer_accept(obj).subscribe(res => {
    //   if (res['data'].status === 1) {
    //     this.spinner.show();
    //     Swal.fire(
    //       {
    //         type: 'success',
    //         text: res['message']
    //       }
    //     );
    //     this.spinner.hide();

    //   }
    //   this.router.navigate(['/candidate/offers/list']);
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
    this.service.offer_accept({ 'id': this.OfferID }).subscribe(res => {
      // this.accept_btn = true;
      this.show_spinner = true;
      const routee = this.router;
      Swal.fire(
        {
          type: 'success',
          text: res['message']
        }
      ).then(function (isConfirm) {
        if (isConfirm) {
          routee.navigate(['/candidate/offers/list']);
        }
      });
      this.show_spinner = false;
    });

  }
  disabledAccept() {
    this.show_spinner = false;

    // document.getElementById('accept').setAttribute('disabled', 'false');
  }

  // get joining date
  // getJoiningDate(e) {
  //   const date = new Date(e);
  //   const month = date.getMonth() + 1;
  //   this.joiningdate = date.getFullYear() + '-' + month + '-' + date.getDate();
  //   this.min_expiry_date = this.form.value.joiningdate;
  // }

  getExpiryDate(e) {
    // if ((this.resData !== 'Accepted')){
    const date = new Date(e);
    const month = date.getMonth() + 1;
    this.expirydate = date.getFullYear() + '-' + month + '-' + date.getDate();
    this.max_date = this.form.value.expirydate;
    // if (this.is_Edit) {
    if (this.form.value.joiningdate < this.form.value.expirydate) {
      this.form.controls['joiningdate'].setErrors({ 'isGreater': true });
      // }
    }
    // }
    this.isTouched(e);
  }

  // add more communication
  addMoreCommunication() {
    this.add_new_AdHoc_communication();
  }

  updatecommunication() {
    const _array = [];
    this.communicationData.forEach((element, index) => {
      const new_communication = {
        'communicationname': element.communicationname,
        'trigger': element.trigger,
        'priority': element.priority,
        'day': element.day,
        'subject': element.subject,
        'message': element.message,
      };
      this.communicationFieldItems.setControl(index, this.fb.group({
        communicationname: ['', [Validators.required, this.noWhitespaceValidator]],
        trigger: ['', Validators.required],
        priority: ['', Validators.required],
        day: ['', [Validators.required, Validators.pattern(/^[0-9]\d*$/)]],
        subject: ['', [Validators.required, this.noWhitespaceValidator]],
        message: ['', [Validators.required, this.noWhitespaceValidator]]
        // message: ['', Validators.required]
      }));
      _array.push(new_communication);
    });
    this.communicationData = _array;
  }

  update_adhoc_communication(data: any) {
    this.AdHocCommunicationData = data;
    const _array = [];
    this.AdHocCommunicationData.forEach((element, index) => {
      const new_communication = {
        'AdHoc_communicationname': element.AdHoc_communicationname,
        'AdHoc_trigger': element.AdHoc_trigger,
        'AdHoc_priority': element.AdHoc_priority,
        'AdHoc_day': element.AdHoc_day,
        'AdHoc_subject': element.AdHoc_subject,
        'AdHoc_message': element.AdHoc_message,
      };
      this.AdHocCommunication.setControl(index, this.fb.group({
        AdHoc_communicationname: ['', [Validators.required, this.noWhitespaceValidator]],
        AdHoc_trigger: ['', Validators.required],
        AdHoc_priority: ['', Validators.required],
        AdHoc_day: ['', [Validators.required, Validators.pattern(/^[0-9]\d*$/)]],
        AdHoc_subject: ['', [Validators.required, this.noWhitespaceValidator]],
        AdHoc_message: ['', [Validators.required, this.noWhitespaceValidator]]
        // message: ['', Validators.required]
      }));
      _array.push(new_communication);
    });
    this.AdHocCommunicationData = _array;
  }


  // add new communication
  add_new_communication(data_index = null) {
    let index = 0;
    if (data_index == null) {
      if (this.communicationData && this.communicationData.length > 0) {
        index = this.communicationData.length;
      } else {
        this.communicationData = [];
      }
    } else {
      if (this.communicationData && this.communicationData.length > 0) {
        index = this.communicationData.length;
      }
    }
    const new_communication = {
      'communicationname': '',
      'trigger': '',
      'priority': '',
      'day': '',
      'subject': '',
      'message': '',
    };

    this.communicationFieldItems.setControl(index, this.fb.group({
      communicationname: ['', [Validators.required, this.noWhitespaceValidator]],
      trigger: ['', Validators.required],
      priority: ['', Validators.required],
      day: ['', [Validators.required, Validators.pattern(/^[0-9]\d*$/)]],
      subject: ['', Validators.required],
      message: ['', [Validators.required, this.noWhitespaceValidator]]
    }));
    if (this.communicationData.length === 1) {
      this.updateValidation();
    } else {
      this.communicationData.push(new_communication);
      this.updateValidation();

    }
  }

  // unset communication
  unset_communication(data_index = null) {

    let index = 0;
    if (data_index == null) {
      if (this.communicationData && this.communicationData.length > 0) {
        index = this.communicationData.length;
      } else {
        this.communicationData = [];
      }
    } else {
      if (this.communicationData && this.communicationData.length > 0) {
        index = this.communicationData.length;
      }
    }
    const new_communication = {
      'communicationname': '',
      'trigger': '',
      'priority': '',
      'day': '',
      'subject': '',
      'message': '',
    };

    this.communicationFieldItems.setControl(index, this.fb.group({
      communicationname: [''],
      trigger: [''],
      priority: [''],
      day: [''],
      subject: [''],
      message: ['']
    }));
    this.communicationData.push(new_communication);
    this.updateValidation();
  }



  // Add AdHoc Communication
  add_new_AdHoc_communication(data_index = null) {

    let index = 0;
    if (data_index == null) {
      if (this.AdHocCommunicationData && this.AdHocCommunicationData.length > 0) {
        index = this.AdHocCommunicationData.length;
      } else {
        this.AdHocCommunicationData = [];
      }
    } else {
      if (this.AdHocCommunicationData && this.AdHocCommunicationData.length > 0) {
        index = this.AdHocCommunicationData.length;
      }
    }
    const new_communication = {
      'AdHoc_communicationname': '',
      'AdHoc_trigger': '',
      'AdHoc_priority': '',
      'AdHoc_day': '',
      'AdHoc_subject': '',
      'AdHoc_message': '',
    };

    this.AdHocCommunication.setControl(index, this.fb.group({
      AdHoc_communicationname: ['', [Validators.required, this.noWhitespaceValidator]],
      AdHoc_trigger: ['', Validators.required],
      AdHoc_priority: ['', Validators.required],
      AdHoc_day: ['', [Validators.required, Validators.pattern(/^[0-9]\d*$/)]],
      AdHoc_subject: ['', [Validators.required, this.noWhitespaceValidator]],
      AdHoc_message: ['', [Validators.required, this.noWhitespaceValidator]]
    }));

    this.AdHocCommunicationData.push(new_communication);
    this.updateValidation();


  }

  // Remove communication
  remove_communication(index: number) {
    delete this.communicationData[index];
    this.communicationFieldItems.removeAt(index);
    const array = [];
    for (let i = 0; i < this.communicationData.length; i++) {
      if (this.communicationData[i] !== undefined) {
        array.push(this.communicationData[i]);
      }
    }
    this.communicationData = array;

    if (this.communicationData.length == 0) {
      this.isAdHoc_ButtonShow = false;
      this.is_Edit = false;
    } else {
      this.isAdHoc_ButtonShow = true;
    }
  }

  // Remove AdHOC
  remove_AdHoc_communication(index: number) {
    delete this.AdHocCommunicationData[index];
    this.AdHocCommunication.removeAt(index);
    const array = [];
    for (let i = 0; i < this.AdHocCommunicationData.length; i++) {
      if (this.AdHocCommunicationData[i] !== undefined) {
        array.push(this.AdHocCommunicationData[i]);
      }
    }
    this.AdHocCommunicationData = array;
  }



  public onReady(editor) {
    editor.ui.getEditableElement().parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.getEditableElement()
    );
  }

  // blur event for salary input
  onSalaryBlur() {
    if (this.form.value.salarybracket > 0) {
      this.isSalaryBracket = false;
      this.isSalaryFrom_To = true;
      this.astSalary = true;
      this.ast = false;
      this.form.controls['salarybracket'].setValue(parseFloat(this.form.value.salarybracket));
      this.form.controls['salarybracket'].setValidators([Validators.pattern(/^\s*(?=.*[1-9])\d*(?:\.\d{1,2})?\s*$/)]);

      document.getElementById('salarybracket_to').setAttribute('disabled', 'true');
      document.getElementById('salarybracket_from').setAttribute('disabled', 'true');
      this.form.controls.salarybracket_from.setValue('');
      this.form.controls.salarybracket_to.setValue('');
      this.form.controls['salarybracket_from'].setErrors(null);
      this.form.controls['salarybracket_to'].setErrors(null);
      this.updateValidation();
    } else {
      // if (this.form.value.salarybracket == '') {
      // this.isSalaryBracket = true;
      // this.isSalaryFrom_To = false;
      document.getElementById('salarybracket_to').removeAttribute('disabled');
      document.getElementById('salarybracket_from').removeAttribute('disabled');

      // } else {
      this.isSalaryBracket = true;
      this.isSalaryFrom_To = false;
      this.form.controls['salarybracket'].setValidators([Validators.pattern(/^\s*(?=.*[1-9])\d*(?:\.\d{1,2})?\s*$/)]);
      this.updateValidation();
      // this.ast = false;
      // this.form.controls['salarybracket'].setValidators([Validators.pattern(/^\s*(?=.*[1-9])\d*(?:\.\d{1,2})?\s*$/)]);
      // }
    }
  }

  // blur event of salary range
  onSalaryRangeBlur() {
    this.isSalaryFrom_To = false;
    this.isSalaryBracket = true;
    if (this.form.value.salarybracket_from > 0 && this.form.value.salarybracket_to > 0) {
      this.form.controls['salarybracket_from'].setValidators(
        [Validators.pattern(/^\s*(?=.*[1-9])\d*(?:\.\d{1,2})?\s*$/)]
      );
      this.form.controls['salarybracket_to'].setValidators(
        [Validators.pattern(/^\s*(?=.*[1-9])\d*(?:\.\d{1,2})?\s*$/)]
      );
      this.form.controls['salarybracket_from'].setValue(parseFloat(this.form.value.salarybracket_from));
      this.form.controls['salarybracket_to'].setValue(parseFloat(this.form.value.salarybracket_to));
      document.getElementById('salarybracket').setAttribute('disabled', 'true');
      this.form.controls.salarybracket.setValue('');
      this.form.controls['salarybracket'].setErrors(null);
      this.updateValidation();
    } else {
      this.isSalaryFrom_To = true;
      this.isSalaryBracket = false;
      // if (this.form.value.salarybracket_to == '' && this.form.value.salarybracket_from == '') {
      document.getElementById('salarybracket').removeAttribute('disabled');
      // } else {
      this.isSalaryFrom_To = true;
      this.isSalaryBracket = false;
      this.form.controls['salarybracket_from'].setValidators(
        [Validators.pattern(/^\s*(?=.*[1-9])\d*(?:\.\d{1,2})?\s*$/)]
      );
      this.form.controls['salarybracket_to'].setValidators(
        [Validators.pattern(/^\s*(?=.*[1-9])\d*(?:\.\d{1,2})?\s*$/)]
      );
      this.updateValidation();
      // }

      // this.form.controls['salarybracket'].setErrors(Validators.required);
    }
  }

  cancel() {
    if (this.userDetail.role === 'employer') {
      this.offer = this.form.value;
      if (this.is_Edit) {
        this.router.navigate([this.cancel_link]);
      }

      if (this.is_Add) {
        if (this.istouchedArray.length > 0) {
          if (this.offer.expirydate == null || this.offer.expirydate === '' || this.offer.joiningdate == null
            || this.offer.joiningdate == '') {
            this.offer.expirydate = null;
            this.offer.joiningdate = null;
          }
          const obj = {
            offer: this.offer,
            ispopup: true
          };

          this.router.navigate([this.currentUrl]);

          this.commonService.setUnSavedData({ value: true, url: this.currentUrl, newurl: this.cancel_link });
          this.commonService.setuserData(obj);

        } else if (this.istouchedArray.length == 0) {
          this.commonService.setuserData('');
        }

      }
    } else if (this.userDetail.role === 'sub-employer') {
      this.offer = this.form.value;
      if (this.is_Edit) {
        this.router.navigate([this.cancel_link1]);
      } if (this.is_Add) {
        if (this.istouchedArray.length > 0) {
          if (this.offer.expirydate == null || this.offer.expirydate === '' || this.offer.joiningdate == null
            || this.offer.joiningdate == '') {
            this.offer.expirydate = null;
            this.offer.joiningdate = null;
          }
          const obj = {
            offer: this.offer,
            ispopup: true
          };

          this.router.navigate([this.currentUrl]);

          this.commonService.setUnSavedData({ value: true, url: this.currentUrl, newurl: this.cancel_link1 });
          this.commonService.setuserData(obj);

        } else if (this.istouchedArray.length == 0) {
          this.commonService.setuserData('');
        }

      }

    }
    if (this.is_View) {
      if (this.userDetail.role === 'employer') {
        this.router.navigate([this.cancel_link]);
      } else if (this.userDetail.role === 'sub-employer') {
        this.router.navigate([this.cancel_link1]);
      }
      else if (this.userDetail.role === 'candidate') {
        this.router.navigate(['/candidate/offers/list']);
      } else if (this.userDetail.role === 'admin') {
        const backID = this.route.snapshot.params.report_id;
        this.router.navigate(['/admin/employers/approved_employer/report/' + backID + '/list']);
      }
    }

  }

  noWhitespaceValidator(control: FormControl) {
    if (typeof (control.value || '') === 'string' || (control.value || '') instanceof String) {
      const isWhitespace = (control.value || '').trim().length === 0;
      const isValid = !isWhitespace;
      return isValid ? null : { 'whitespace': true };
    }
  }

  noWhitespaceValidatorForNotRequired(control: FormControl) {
    if (control.value.length > 0) {
      if (typeof (control.value || '') === 'string' || (control.value || '') instanceof String) {
        const isWhitespace = (control.value || '').trim().length === 0;
        const isValid = !isWhitespace;
        return isValid ? null : { '_whitespace': true };
      }
    }
  }


  checkFrom(from, to) {
    this.isTouched(from);
    this.ast = true;
    this.astSalary = false;
    this.from = parseInt(from.target.value, 10);
    this.to = parseInt(to, 10);
    if (this.from > this.to) {
      this.error = true;
      this.err_from = 'Salary From can\'t be greater than Salary To';
      this.err_to = 'Salary To can\'t be lesser than Salary From.';
    } else if (this.from === this.to) {
      this.error = true;
      this.err_from = 'Can\'t be same!';
    } else {
      this.error = false;
    }
  }

  CheckAst(value) {
    this.isTouched(value);
    this.ast = false;
    this.astSalary = true;
  }

  checkTo(from, to) {
    this.isTouched(from);
    this.to = parseInt(from.target.value, 10);
    this.from = parseInt(to, 10);
    if (this.from > this.to) {
      this.error = true;
      this.err_from = 'Salary From can\'t be greater than Salary To';
      this.err_to = 'Salary To can\'t be lesser than Salary From.';
    } else if (this.from === this.to) {
      this.error = true;
      this.err_from = 'Can\'t be same!';
      this.err_to = 'Can\'t be same!';
    } else {
      this.error = false;
    }
  }

  // getCursor = (e) => {
  //   const selection = document.getSelection();
  //   this.cursorPos = selection.anchorOffset;
  // }

  append(value) {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = value;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

  removeZero_high_unopened() {
    if (this.form.value.high_unopened && this.form.value.high_unopened >= 0) {
      this.form.controls['high_unopened'].setValue(parseFloat(this.form.value[`high_unopened`]));
    }
  }
  removeZero_high_notreplied() {
    if (this.form.value.high_notreplied && this.form.value.high_notreplied >= 0) {
      this.form.controls['high_notreplied'].setValue(parseFloat(this.form.value[`high_notreplied`]));
    }
  }
  removeZero_medium_unopened() {
    if (this.form.value.medium_unopened && this.form.value.medium_unopened >= 0) {
      this.form.controls['medium_unopened'].setValue(parseFloat(this.form.value[`medium_unopened`]));
    }
  }
  removeZero_medium_notreplied() {
    if (this.form.value.medium_notreplied && this.form.value.medium_notreplied >= 0) {
      this.form.controls['medium_notreplied'].setValue(parseFloat(this.form.value[`medium_notreplied`]));
    }
  }

  isTouched(value) {
    if (value) {
      this.istouchedArray.push(value);
    }
  }
  // setRequired() {
  //   this.form.controls['high_unopened'].setValidators([Validators.required]);
  //   this.form.controls['high_notreplied'].setValidators([Validators.required]);
  //   this.form.controls['medium_unopened'].setValidators([Validators.required]);
  //   this.form.controls['medium_notreplied'].setValidators([Validators.required]);
  //   this.form.updateValueAndValidity();
  // }


  // submit offers
  onSubmit(flag) {
    this.isSubmit = true;
    if (this.form.value.salarybracket) {
      this.form.controls['salarybracket_from'].setErrors(null);
      this.form.controls['salarybracket_to'].setErrors(null);
      this.updateValidation();
    } else if (this.form.value.salarybracket_from && this.form.value.salarybracket_to) {
      this.form.controls['salarybracket'].setErrors(null);
      this.updateValidation();
    }
    this.is_submitted = true;
    // customised fields
    const _coustomisedFieldsArray = [];
    this.form.value.customfieldItem.forEach(element => {
      if (element.value) {
        _coustomisedFieldsArray.push({
          key: element.key,
          value: element.value
        });
      }
    });
    // communication records
    const communication_array = [];
    if (this.form.value.group) {
      if (this.communicationData.length > 0) {
        this.communicationData.forEach(element => {
          communication_array.push({
            communicationname: element.communicationname,
            trigger: element.trigger,
            priority: element.priority,
            day: element.day,
            subject: element.subject,
            message: element.message,
            _id: element._id,
            open: element.open,
            reply: element.reply,
            open_date: element.open_date,
            reply_date: element.reply_date,
            mail_send: element.mail_send
          });
        });
        // this.setRequired();
      } else {
        communication_array.push();
      }
    }


    // AdHoc Communication
    const AdHOc_communication_array = [];
    if (this.AdHocCommunicationData.length > 0) {
      this.AdHocCommunicationData.forEach(element => {
        AdHOc_communication_array.push({
          AdHoc_communicationname: element.AdHoc_communicationname,
          AdHoc_trigger: element.AdHoc_trigger,
          AdHoc_priority: element.AdHoc_priority,
          AdHoc_day: element.AdHoc_day,
          AdHoc_subject: element.AdHoc_subject,
          AdHoc_message: element.AdHoc_message,
          _id: element._id,
          AdHoc_open: element.AdHoc_open,
          AdHoc_reply: element.AdHoc_reply,
          AdHoc_open_date: element.AdHoc_open_date,
          AdHoc_reply_date: element.AdHoc_reply_date,
          AdHoc_mail_send: element.AdHoc_mail_send
        });
      });
      // this.setRequired();
    } else {
      AdHOc_communication_array.push();
    }

    this.formData = new FormData();
    const unwantedFields = [
      'candidate',
      'customfieldItem',
      'group',
      'offerStatus',
      'status',
      'employer_id',
      'communicationFieldItems',
      'AdHocCommunication',
      'salarybracket',
      'salarybracket_from',
      'salarybracket_to',
    ];

    const form_data = {
      ...this.form.value,
      location: this.form.value.location,
      expirydate: this.commonService.current_time_to_UTC(this.form.value.expirydate),
      joiningdate: this.commonService.current_time_to_UTC(this.form.value.joiningdate),
      salary: this.form.value.salarybracket ? this.form.value.salarybracket : '',
      salary_from: this.form.value.salarybracket_from ? this.form.value.salarybracket_from : '',
      salary_to: this.form.value.salarybracket_to ? this.form.value.salarybracket_to : '',
      customfeild: JSON.stringify(_coustomisedFieldsArray),
      data: JSON.stringify(communication_array),
      AdHoc: JSON.stringify(AdHOc_communication_array),
      medium_notreplied: this.form.value.medium_notreplied >= 0 ? this.form.value.medium_notreplied : '',
      medium_unopened: this.form.value.medium_unopened >= 0 ? this.form.value.medium_unopened : '',
      high_notreplied: this.form.value.high_notreplied >= 0 ? this.form.value.high_notreplied : '',
      high_unopened: this.form.value.high_unopened >= 0 ? this.form.value.high_unopened : '',
    };
    Object.keys(form_data).map(key => {
      if (unwantedFields.includes(key)) {
        delete form_data[key];
      }
    });



    for (const key in form_data) {
      if (key) {
        const value = form_data[key];
        this.formData.append(key, value);
      }
    }
    if (this.form.value.group && this.route.snapshot.data.title === 'Add') {
      this.formData.append('groups', this.form.value.group);
    } else if (this.route.snapshot.data.title === 'Edit') {
      this.formData.append('groups', this.form.value.group !== undefined && this.form.value.group !== null &&
        this.form.value.group !== '' ? this.form.value.group : '');
    }

    if (flag) {
      this.isSubmit = false;
      this.show_spinner = true;
      if (this.route.snapshot.data.title === 'Edit') {
        this.isSubmit = true;
        this.formData.append('id', this.id);
        this.formData.append('status', this.form.value.offerStatus.value);

        this.confirmationService.confirm({
          message: 'Are you sure that you want to Update this Offer?',
          accept: () => {
            this.service.update_offer(this.formData).subscribe(
              res => {
                this.isRelaeased = true;
                this.commonService.setuserData('');
                this.socketService.changeOffer(this.grpId);
                this.socketService.leaveGrp(this.grpId);
                this.socketService.joinGrp(res['data']['data'].employer_id);
                this.socketService.changeOffer(res['data']['data'].employer_id);
                this.socketService.leaveGrp(res['data']['data'].employer_id);
                this.toastr.success(res['message'], 'Success!', { timeOut: 3000 });
                if (this.userDetail.role === 'employer') {
                  this.router.navigate([this.cancel_link]);
                } else if (this.userDetail.role === 'sub-employer') {
                  this.router.navigate([this.cancel_link1]);
                }
              },
              err => {
                this.show_spinner = false;
                this.toastr.error(err['error']['message'], 'Error!', {
                  timeOut: 3000
                });
              }

            );
          }, reject: () => {
            this.show_spinner = false;
          }
        });
      } else {
        if (this.userDetail.role === 'employer' || this.userDetail.role === 'sub-employer') {
          this.isSubmit = true;
          this.confirmationService.confirm({
            message: 'Are you sure that you want to Add this Offer?',
            accept: () => {
              this.show_spinner = true;
              this.service.add_offer(this.formData).subscribe(
                res => {
                  this.isRelaeased = true;
                  this.commonService.setuserData('');
                  this.socketService.joinGrp(res['data']['data'].user_id);
                  this.socketService.changeOffer(res['data']['data'].user_id);
                  this.socketService.leaveGrp(res['data']['data'].user_id);
                  this.socketService.joinGrp(res['data']['data'].employer_id);
                  this.socketService.changeOffer(res['data']['data'].employer_id);
                  this.socketService.leaveGrp(res['data']['data'].employer_id);
                  this.toastr.success(res['message'], 'Success!', { timeOut: 3000 });
                  if (this.userDetail.role === 'employer') {
                    this.router.navigate([this.cancel_link]);
                  } else if (this.userDetail.role === 'sub-employer') {
                    this.router.navigate([this.cancel_link1]);
                  }
                },
                err => {
                  this.show_spinner = false;
                  this.toastr.error(err['error']['message'], 'Error!', {
                    timeOut: 3000
                  });
                }
              );
            }, reject: () => {
              this.show_spinner = false;
            }
          });
        }
        // else if (this.userDetail.role === 'sub-employer') {
        //   this.show_spinner = true;
        //   this.service.add_offer(this.formData).subscribe(
        //     res => {
        //       this.toastr.success(res['message'], 'Success!', { timeOut: 3000 });
        //       this.router.navigate([this.cancel_link1]);
        //     },
        //     err => {
        //       this.show_spinner = false;
        //       this.toastr.error(err['error']['message'], 'Error!', {
        //         timeOut: 3000
        //       });
        //     }
        //   );
        // }

      }

    }
    this.form_validation = !flag;
  }

  ngOnDestroy(): void {
    if (this.userDetail.role === 'employer' || this.userDetail.role === 'sub-employer') {

      if (!this.is_View) {
        this.offer = this.form.value;
        this.isPopup = true;

        if (this.isSubmit) {
          this.commonService.setUnSavedData('');
        }
        if (this.is_Edit) {
          if (this.offer.email != null || this.offer.candidate_name != null || this.offer.title != null
            || this.offer.salarytype != null || this.offer.location != null || this.offer.salarytype != null || this.offer.salarybracket != null || this.offer.salarybracket_from != null || this.offer.salarybracket_to != null || this.offer.salaryduration != null || this.offer.offertype != null || this.offer.group != null) {
            if (this.istouchedArray.length > 0) {
              // tslint:disable-next-line: max-line-length
              if (this.offer.expirydate == null || this.offer.expirydate === '' || this.offer.joiningdate == null || this.offer.joiningdate == '') {
                this.offer.expirydate = null;
                this.offer.joiningdate = null;
              }
              const obj = {
                offer: this.offer,
                ispopup: true
              };

              this.router.navigate([this.currentUrl]);
              this.commonService.setUnSavedData({ value: true, url: this.currentUrl, newurl: this.router.url });
              this.commonService.setuserData(obj);


            } else if (this.istouchedArray.length == 0) {
              this.commonService.setuserData('');
            }
          }

        } else if (this.is_Add) {
          console.log('in add from destroy=======>');

          if (this.istouchedArray.length > 0) {
            if (this.offer.expirydate == null || this.offer.expirydate === '' || this.offer.joiningdate == null
              || this.offer.joiningdate == '') {
              this.offer.expirydate = null;
              this.offer.joiningdate = null;
            }
            const obj = {
              offer: this.offer,
              ispopup: true
            };
            console.log('this.isRelaeased=>', this.isRelaeased);

            if (!this.isRelaeased) {
              console.log('in released condition=======>');

              this.router.navigate([this.currentUrl]);
              this.commonService.setUnSavedData({ value: true, url: this.currentUrl, newurl: this.router.url });
              this.commonService.setuserData(obj);
            } else {
              this.commonService.setUnSavedData('');
              this.commonService.setuserData('');
            }


          } else if (this.istouchedArray.length == 0) {
            this.commonService.setuserData('');
          }

        }

      }
    }
    this.socketService.leaveGrp(this.grpId);
  }



}
