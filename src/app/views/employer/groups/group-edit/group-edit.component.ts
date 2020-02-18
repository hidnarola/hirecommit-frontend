import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Validators, FormControl, FormBuilder, FormArray, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { GroupService } from '../manage-groups.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmationService } from 'primeng/api';
import { CommonService } from '../../../../services/common.service';
import { NgxSummernoteDirective } from 'ngx-summernote';
import { variable } from '@angular/compiler/src/output/output_ast';
import { EmployerService } from '../../employer.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-group-edit',
  templateUrl: './group-edit.component.html',
  styleUrls: ['./group-edit.component.scss']
})
export class GroupEditComponent implements OnInit {
  @ViewChild('editor') editorDir: NgxSummernoteDirective;
  @ViewChild('editor') summernote: ElementRef;
  public Editor = ClassicEditor;
  groupForm: FormGroup;
  istouchedArray = [];
  communicationForm: FormGroup;
  isFormSubmitted = false;
  cancel_link = '/employer/groups/list';
  id: any;
  group: any;
  isNavigate = false;
  groupData: any = [];
  communicationData: any = [];
  panelTitle = 'View Group';
  editedData: any;
  isEdit: Boolean = false;
  arr: FormArray;
  msg: any;
  is_communication_added: boolean = false;
  formData: FormData;
  currentUrl = '';
  Comm_Flag: boolean = true;
  show_spinner = false;
  cursorPos: any;
  userDetail: any;
  Trigger_Option = [
    { label: 'Select Trigger', value: '' },
    { label: 'Before Joining', value: 'beforeJoining' },
    { label: 'After Joining', value: 'afterJoining' },
    { label: 'After Offer', value: 'afterOffer' },
    { label: 'Before Expiry', value: 'beforeExpiry' },
    { label: 'After Expiry', value: 'afterExpiry' },
    { label: 'After Acceptance', value: 'afterAcceptance' }

  ]
  Priority_Options = [
    { label: 'Select Priority', value: '' },
    { label: 'High', value: 'High' },
    { label: 'Medium', value: 'Medium' },
    { label: 'Low', value: 'Low' }
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
  constructor(
    public fb: FormBuilder,
    private service: GroupService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private commonService: CommonService,
    private EmpService: EmployerService,
    private modalService: NgbModal,
  ) {
    this.currentUrl = this.router.url;
    this.userDetail = this.commonService.getLoggedUserDetail();
    // show spinner
    this.spinner.show();
    // form controls
    this.forminit();

    // check for add or edit
    if (((this.route.snapshot.url[1] &&
      this.route.snapshot.url[1].path === 'edit') || this.router.url.includes('groups/edit'))) {
      this.panelTitle = 'Edit Group';
      this.isEdit = true;
    }

    this.id = this.route.snapshot.params.id;
    this.service.get_detail(this.id).subscribe(res => {
      this.groupData = res['data']['data'][0];
      // hide spinner
      this.spinner.hide();

      if (res['communication']['data'] && res['communication']['data'].length > 0) {
        this.communicationData = res['communication']['data'][0]['communication'];
      }

      // set communication
      if (this.communicationData && this.communicationData.length > 0) {
        this.is_communication_added = true;
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
      } else {
        // if (this.Comm_Flag) {

        this.add_new_communication();
        // }
      }
      // set communication
    }, (err) => {
      this.toastr.error(err['error']['message'], 'Error!', { timeOut: 3000 });
    });

  }

  forminit = () => {
    this.groupForm = this.fb.group({
      name: new FormControl('', [Validators.required, this.noWhitespaceValidator]),
      high_unopened: new FormControl('', [Validators.pattern(/^[0-9]\d*$/), Validators.required]),
      high_notreplied: new FormControl('', [Validators.pattern(/^[0-9]\d*$/), Validators.required]),
      medium_notreplied: new FormControl('', [Validators.pattern(/^[0-9]\d*$/), Validators.required]),
      medium_unopened: new FormControl('', [Validators.pattern(/^[0-9]\d*$/), Validators.required]),
      // low_unopened: new FormControl('', [Validators.required, Validators.pattern(/^(3[01]|[12][0-9]|[1-9])$/)]),
      // low_notreplied: new FormControl('', [Validators.required, Validators.pattern(/^(3[01]|[12][0-9]|[1-9])$/)]),
      communicationFieldItems: this.fb.array([])
    });
  }

  ngOnInit() {
    this.commonService.getuserdata.subscribe(res => {
      if (res) {
        setTimeout(() => {
          if ((res[`group`].name !== '' && res[`group`].name !== undefined) &&
            (res[`group`].medium_notreplied !== '' && res[`group`].medium_notreplied !== undefined) &&
            (res[`group`].medium_unopened !== '' && res[`group`].medium_notreplied !== undefined) &&
            (res[`group`].high_notreplied !== '' && res[`group`].high_notreplied !== undefined) &&
            (res[`group`].high_unopened !== '' && res[`group`].high_unopened !== undefined)) {
            this.groupData.name = res[`group`].name;
            this.groupData.medium_notreplied = res[`group`].medium_notreplied;
            this.groupData.medium_unopened = res[`group`].medium_unopened;
            this.groupData.high_notreplied = res[`group`].high_notreplied;
            this.groupData.high_unopened = res[`group`].high_unopened;
          }
          if (res[`communication`]) {
            if (res[`communication`].length > 0) {
              this.communicationData = res[`communication`];
              if (this.communicationData !== '' && this.communicationData) {
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
                  }));
                  _array.push(new_communication);
                });
                this.communicationData = _array;
              }
            }
          }
          // else {
          //   this.communicationData = '';
          // }
        }, 1000);
      } else {
        this.forminit();
        // this.communicationData = '';
        this.groupData = '';
      }


    });
  }

  isTouched(value) {
    if (value) {
      this.istouchedArray.push(value);
    }
  }

  cancel() {
    this.commonService.setuserData('');
    if (this.userDetail.role === 'employer') {
      this.router.navigate([this.cancel_link]);
    } else if (this.userDetail.role === 'sub-employer') {
      this.router.navigate(['/sub_employer/groups/list']);
    }
  }

  get f() { return this.groupForm.controls; }

  // communbication field items controls
  get communicationFieldItems() {
    return this.groupForm.get('communicationFieldItems') as FormArray;
  }

  // Update form validation
  updateValidation() {
    this.groupForm.updateValueAndValidity();
  }
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

  getCursor = (e) => {
    const selection = document.getSelection();
    this.cursorPos = selection.anchorOffset;
    // console.log('values=>', this.form.value);
    // console.log('this.form.controls[`AdHoc_message`].value=>',
    //   this.form.controls['AdHocCommunication'][`controls`][i][`controls`][`AdHoc_message`].value);
  }

  // On change of communication
  // changeCommunication(e) {
  //   console.log('e => ', e);
  //   if (e.checked) {
  //     this.add_new_communication();
  //   } else {
  //     this.communicationData = [];
  //     console.log('communicationFieldItems => ', this.communicationFieldItems);
  //     console.log('this.groupForm => ', this.groupForm);
  //     this.communicationFieldItems.setControl(0, this.fb.group({}));
  //     this.updateValidation();
  //     this.isFormSubmitted = false;
  //   }
  // }

  // add new communication
  add_new_communication(data_index = null) {
    let index = 0;
    this.spinner.show();
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
      subject: ['', [Validators.required, this.noWhitespaceValidator]],
      message: ['', [Validators.required, this.noWhitespaceValidator]]
    }));
    setTimeout(() => {
      this.spinner.hide()
      this.communicationData.push(new_communication);
      this.updateValidation();
    }, 500);

  }

  // no white space
  noWhitespaceValidator(control: FormControl) {
    if (typeof (control.value || '') === 'string' || (control.value || '') instanceof String) {
      const isWhitespace = (control.value || '').trim().length === 0;
      const isValid = !isWhitespace;
      return isValid ? null : { 'whitespace': true };
    }
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

  }

  public onReady(editor) {
    editor.ui.getEditableElement().parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.getEditableElement()
    );
  }
  //remove zero
  removeZeroCommunication(index) {
    if (this.groupForm.controls['communicationFieldItems'].value[index].day >= 0) {
      this.groupForm.controls['communicationFieldItems'][`controls`][index].controls['day'].setValue(parseFloat(this.groupForm.value[`communicationFieldItems`][index].day));
    }
  }

  removeZero_high_unopened() {
    if (this.groupForm.value.high_unopened && (this.groupForm.value.high_unopened >= 0)) {
      this.groupForm.controls['high_unopened'].setValue(parseFloat(this.groupForm.value[`high_unopened`]));
    }
  }
  removeZero_high_notreplied() {
    if (this.groupForm.value.high_notreplied && (this.groupForm.value.high_notreplied >= 0)) {
      this.groupForm.controls['high_notreplied'].setValue(parseFloat(this.groupForm.value[`high_notreplied`]));
    }
  }
  removeZero_medium_unopened() {
    if (this.groupForm.value.medium_unopened && (this.groupForm.value.medium_unopened >= 0)) {
      this.groupForm.controls['medium_unopened'].setValue(parseFloat(this.groupForm.value[`medium_unopened`]));
    }
  }
  removeZero_medium_notreplied() {
    if (this.groupForm.value.medium_notreplied && (this.groupForm.value.medium_notreplied >= 0)) {
      this.groupForm.controls['medium_notreplied'].setValue(parseFloat(this.groupForm.value[`medium_notreplied`]));
    }
  }

  onSubmit(valid) {
    this.isNavigate = true;
    this.isFormSubmitted = true;
    this.show_spinner = true;
    this.formData = new FormData();
    if (valid) {
      if (this.isEdit) {
        const communication_array = [];
        if (this.communicationData.length > 0) {
          this.communicationData.forEach(element => {
            communication_array.push({
              communicationname: element.communicationname,
              trigger: element.trigger,
              priority: element.priority,
              day: element.day,
              subject: element.subject,
              message: element.message
            });
          });
        } else {
          communication_array.push();
        }

        const obj = {
          id: this.id,
          name: this.groupData['name'],
          high_unopened: this.groupData['high_unopened'],
          high_notreplied: this.groupData['high_notreplied'],
          medium_unopened: this.groupData['medium_unopened'],
          medium_notreplied: this.groupData['medium_notreplied'],
          data: JSON.stringify(communication_array)
        };
        for (const key in obj) {
          if (key) {
            const value = obj[key];
            this.formData.append(key, value);
          }
        }
        this.confirmationService.confirm({
          message: 'Are you sure that you want to Update this record?',
          accept: () => {
            this.service.edit_group(this.formData).subscribe(res => {
              if (res['data']['status'] === 1) {
                this.commonService.setuserData('');

                this.isFormSubmitted = false;
                this.toastr.success(res['message'], 'Success!', { timeOut: 3000 });
                this.groupForm.reset();
              }
              if (this.userDetail.role === 'employer') {
                this.router.navigate(['/employer/groups/list']);
              } else {
                this.router.navigate(['/sub_employer/groups/list']);
              }
            }, (err) => {
              this.show_spinner = false;
              this.toastr.error(err['error']['message'], 'Error!', { timeOut: 3000 });
            });
          }, reject: () => {
            this.show_spinner = false;
          }
        });
      }
    }
    else {
      this.show_spinner = false;
    }

  }
  open(content) {
    this.modalService.open(content);
    this.EmpService.information({ 'msg_type': 'groups' }).subscribe(res => {
      this.msg = res['message'];
    }, (err) => {
      this.toastr.error(err['error']['message'], 'Error!', { timeOut: 3000 });
    });
  }

  ngOnDestroy(): void {
    if (this.userDetail.role === 'employer' || this.userDetail.role === 'sub-employer') {
      this.group = this.groupForm.value;

      if (this.istouchedArray.length > 0) {
        if (this.group.name !== '' || this.communicationData.communicationname! == '' ||
          this.communicationData.trigger !== '' || this.communicationData.priority !== '' ||
          this.communicationData.subject !== '' || this.communicationData.message !== '') {
          if (!this.isNavigate) {
            const obj = {
              group: this.group,
              communication: this.communicationData,
              ispopup: true
            };
            this.router.navigate([this.currentUrl]);
            this.commonService.setUnSavedData({ value: true, url: this.currentUrl, newurl: this.router.url });
            this.commonService.setuserData(obj);
          }
        }
        // if () {


        // }
      } else if (this.istouchedArray.length == 0) {
        this.commonService.setuserData('');
      }
    }
  }

}
