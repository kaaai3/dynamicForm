import { Injectable } from '@angular/core';
import { FormGroup } from "@angular/forms";
import { of } from "rxjs";

 @Injectable({
   providedIn: 'root'
 })
 export class FormService {

   customFormStructure = [
     {
       type: 'text',
       key: 'custom1',
       data: {
         label: 'Text input 1',
       },
       validations: [
       ]
     },
     {
       type: 'radio',
       key: 'custom2',
       data: {
         label: 'Radio 1',
         name: 'radio-1',
         options: [{label: 'bla', value: '1'}, {label: 'bla2', value: '2'}],
       },
       validations: [
       ]
     },
     {
       type: 'dropdown',
       key: 'custom3',
       shouldShowWhen: [{ key: 'custom2', operator: 'equals', value: '1' }],
       visibilityCondition: (formGroup: FormGroup) => of(formGroup.get('custom2')?.value === '1'),
       data: {
         label: 'dropdown',
         options: [{label: 'bla', value: '1'}, {label: 'bla2', value: '2'}],
       },
       validations: []
     },
     {
        type: 'radio',
        key: 'custom4',
        shouldShowWhen: [{ key: 'custom3', operator: 'equals', value: '2' }, { key: 'custom1', operator: 'equals', value: 'test' }],
        visibilityCondition: (formGroup: FormGroup) => of(formGroup.get('custom3')?.value === '2'),
        data: {
          label: 'Radio 2',
          options: [{label: 'blaaa', value: '1'}, {label: 'blaaa2', value: '2'}, {label: 'blaaa2', value: '3'}],
        },
        validations: []
     }
   ];

   getCustomFormStructure() {
     return this.customFormStructure;
   }
 }
