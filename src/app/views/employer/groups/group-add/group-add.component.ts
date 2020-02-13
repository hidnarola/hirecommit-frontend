import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { GroupService } from '../manage-groups.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CommonService } from '../../../../services/common.service';
import { NgxSummernoteDirective } from 'ngx-summernote';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EmployerService } from '../../employer.service';
@Component({
  selector: 'app-group-add',
  templateUrl: './group-add.component.html',
  styleUrls: ['./group-add.component.scss']
})
export class GroupAddComponent implements OnInit, OnDestroy {
  @ViewChild('editor') editorDir: NgxSummernoteDirective;
  @ViewChild('editor') summernote: ElementRef;
  public Editor = ClassicEditor;
  addGroup: FormGroup;
  communicationForm: FormGroup;
  isFormSubmitted = false;
  group: any;
  msg: any;
  isSubmitted = false;
  cancel_link = '/employer/groups/list';
  groupData: any = [];
  editedData: any;
  show_communication: Boolean = false;
  communicationData: any = [];
  group_id: any;
  formData: FormData;
  show_spinner = false;
  disabled = false;
  Priority_Options = [
    { label: 'Select Priority', value: '' },
    { label: 'High', value: 'High' },
    { label: 'Medium', value: 'Medium' },
    { label: 'Low', value: 'Low' }
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
  userDetail: any;
  cursorPos: any;
  days: any;
  id: any;
  communication = false;
  currentUrl = '';
  constructor(
    public fb: FormBuilder,
    private service: GroupService,
    private toastr: ToastrService,
    private router: Router,
    private commonService: CommonService,
    private modalService: NgbModal,
    private EmpService: EmployerService

  ) {
    this.currentUrl = this.router.url;
    this.userDetail = this.commonService.getLoggedUserDetail();

    // form controls
    this.formInit();

    this.service.alert_days().subscribe(res => {
      this.groupData = res[`data`];
    }, (err) => {
      this.toastr.error(err['error']['message'], 'Error!', { timeOut: 3000 });
    });

    // add communications
    this.communicationForm = this.fb.group({
      communicationFieldItems: this.fb.array([])
    });

  }
  formInit = () => {
    this.addGroup = this.fb.group({
      name: new FormControl('', [Validators.required, this.noWhitespaceValidator]),
      high_unopened: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]\d*$/)]),
      high_notreplied: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]\d*$/)]),
      medium_unopened: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]\d*$/)]),
      medium_notreplied: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]\d*$/)])
    });
  }
  get f() { return this.addGroup.controls; }

  ngOnInit() {

    this.commonService.getuserdata.subscribe(res => {
      if (res) {
        setTimeout(() => {
          this.groupData.name = res[`group`].name;
          if (res[`communication`] !== '' && res[`group`] !== '' && res[`group`].medium_notreplied !== ''
            && res[`group`].medium_unopened !== '' && res[`group`].high_notreplied !== '' && res[`group`].high_unopened !== '') {
            this.groupData.medium_notreplied = res[`group`].medium_notreplied;
            this.groupData.medium_unopened = res[`group`].medium_unopened;
            this.groupData.high_notreplied = res[`group`].high_notreplied;
            this.groupData.high_unopened = res[`group`].high_unopened;

          }
          this.group_id = res['group_id'];
          if (res[`communication`].length > 0) {
            this.communicationData = res['communication'];
            this.updatecommunication();
            this.show_communication = true;
          }
          const obj = {
            id: this.group_id,
            name: this.groupData['name'],
            high_unopened: res[`group`].medium_notreplied,
            high_notreplied: res[`group`].medium_unopened,
            medium_unopened: res[`group`].high_notreplied,
            medium_notreplied: res[`group`].high_unopened,
            // low_unopened: this.groupData['low_unopened'],
            // low_notreplied: this.groupData['low_notreplied'],
            data: JSON.stringify(this.communicationData)
          };

          for (const key in obj) {
            if (key) {
              const value = obj[key];
              this.formData.append(key, value);
            }
          }
        }, 1000);
      } else {
        this.formInit();
      }

      // this.addGroup.controls['name'].setValue(res[`group`].name);



    });
  }



  // communbication field items controls
  get communicationFieldItems() {
    return this.communicationForm.get('communicationFieldItems') as FormArray;
  }
  getCursor = (e) => {
    const selection = document.getSelection();
    this.cursorPos = selection.anchorOffset;
  }

  updatecommunication() {
    let index = this.communicationData.length;
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
    // if (data_index === 4) {
    //   this.disabled = true;
    // }
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
      // message: ['', Validators.required]
    }));

    this.communicationData.push(new_communication);
    this.communicationForm.updateValueAndValidity();

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

  }

  public onReady(editor) {
    editor.ui.getEditableElement().parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.getEditableElement()
    );
  }

  noWhitespaceValidator(control: FormControl) {
    if (typeof (control.value || '') === 'string' || (control.value || '') instanceof String) {
      const isWhitespace = (control.value || '').trim().length === 0;
      const isValid = !isWhitespace;
      return isValid ? null : { 'whitespace': true };
    }
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

  onSubmit(valid) {
    this.isFormSubmitted = true;
    if (valid) {
      this.show_spinner = true;
      const obj = {
        ...this.addGroup.value,
        high_unopened: this.addGroup.controls[`high_unopened`].value,
        high_notreplied: this.addGroup.controls[`high_notreplied`].value,
        medium_unopened: this.addGroup.controls[`medium_unopened`].value,
        medium_notreplied: this.addGroup.controls[`medium_notreplied`].value,
      };
      this.service.addGroup(obj).subscribe(res => {
        if (res['data']['status'] === 1) {
          this.toastr.success(res['message'], 'Succsess!', { timeOut: 3000 });
          this.isFormSubmitted = false;
          this.group_id = res['data']['data']['_id'];
          // add communication
          this.add_new_communication();
          this.show_communication = true;
          this.show_spinner = false;
        }
      }, (err) => {
        this.show_spinner = false;
        this.toastr.error(err['error'].message, 'Error!', { timeOut: 3000 });
      });
    } else {
      this.show_spinner = false;
    }
  }
  // remove zero
  removeZeroCommunication(index) {
    if (this.communicationForm.controls['communicationFieldItems'].value[index].day >= 0) {
      this.communicationForm.controls['communicationFieldItems'][`controls`][index].controls['day'].setValue(parseFloat(this.communicationForm.value[`communicationFieldItems`][index].day));
    }
  }
  removeZero_high_unopened() {
    if (this.addGroup.value.high_unopened && this.addGroup.value.high_unopened >= 0) {
      this.addGroup.controls['high_unopened'].setValue(parseFloat(this.addGroup.value[`high_unopened`]));
    }
  }
  removeZero_high_notreplied() {
    if (this.addGroup.value.high_notreplied && this.addGroup.value.high_notreplied >= 0) {
      this.addGroup.controls['high_notreplied'].setValue(parseFloat(this.addGroup.value[`high_notreplied`]));
    }
  }
  removeZero_medium_unopened() {
    if (this.addGroup.value.medium_unopened && this.addGroup.value.medium_unopened >= 0) {
      this.addGroup.controls['medium_unopened'].setValue(parseFloat(this.addGroup.value[`medium_unopened`]));
    }
  }
  removeZero_medium_notreplied() {
    if (this.addGroup.value.medium_notreplied && this.addGroup.value.medium_notreplied >= 0) {
      this.addGroup.controls['medium_notreplied'].setValue(parseFloat(this.addGroup.value[`medium_notreplied`]));
    }
  }

  //  on submit of communication
  onCommunicationSubmit(flag) {
    this.isSubmitted = true;
    this.formData = new FormData();
    if (flag) {
      if (this.show_communication) {
        const communication_array = [];
        if (this.communicationData.length > 0) {
          this.show_spinner = true;
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
          this.show_spinner = false;
          communication_array.push();
        }

        const obj = {
          id: this.group_id,
          name: this.groupData['name'],
          high_unopened: this.groupData['high_unopened'],
          high_notreplied: this.groupData['high_notreplied'],
          medium_unopened: this.groupData['medium_unopened'],
          medium_notreplied: this.groupData['medium_notreplied'],
          // low_unopened: this.groupData['low_unopened'],
          // low_notreplied: this.groupData['low_notreplied'],
          data: JSON.stringify(communication_array)
        };
        for (const key in obj) {
          if (key) {
            const value = obj[key];
            this.formData.append(key, value);
          }
        }

        this.service.edit_group(this.formData).subscribe(res => {
          this.show_spinner = true;
          if (res['data']['status'] === 1) {
            this.isFormSubmitted = false;
            this.toastr.success(res['message'], 'Success!', { timeOut: 3000 });
            this.commonService.setuserData('');
          }
          if (this.userDetail.role === 'employer') {
            this.router.navigate(['/employer/groups/list']);
          } else if (this.userDetail.role === 'sub-employer') {
            this.router.navigate(['/sub_employer/groups/list']);
          }

        }, (err) => {
          this.show_spinner = false;
          this.toastr.error(err['error']['message'][0].msg, 'Error!', { timeOut: 3000 });
        });
      }

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

  Cancel() {
    this.isSubmitted = true;
    if (this.userDetail.role === 'employer') {
      this.router.navigate([this.cancel_link]);
    } else if (this.userDetail.role === 'sub-employer') {
      this.router.navigate(['/sub_employer/groups/list']);
    }
  }

  ngOnDestroy(): void {
    if (this.userDetail.role === 'employer' || this.userDetail.role === 'sub-employer') {
      this.group = this.addGroup.value;

      if (this.group.name !== null || !this.isSubmitted) {
        const obj = {
          group: this.group,
          group_id: this.group_id,
          communication: this.communicationData,
          ispopup: true
        };
        this.router.navigate([this.currentUrl]);
        this.commonService.setUnSavedData({ value: true, url: this.currentUrl, newurl: this.router.url });
        this.commonService.setuserData(obj);
      }

    }
  }


}
