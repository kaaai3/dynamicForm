import { Component, OnInit, Input } from '@angular/core';
import { ReactiveFormsModule, ControlContainer, FormGroupDirective } from '@angular/forms';
import { NgForOf } from "@angular/common";

@Component({selector: 'ind-input',
  imports: [ReactiveFormsModule],
  standalone: true,
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective
    },
  ],
  styles: [`
    input {
      padding: 10px;
      font-size: 16px;
      border-radius: 5px;
      border: 1px solid #ccc;
    }
  `],
  template: `
    @if(sessionData){
      <div><strong>{{data.label}}</strong></div>
      {{sessionData}}
    } @else {
      <div><strong>{{data.label}}</strong></div>
      <input [formControlName]="formName">
    }

  `})
export class TextInput {
  @Input() formName: any;
  @Input() sessionData: any;
  @Input() data: any;
}

@Component({selector: 'ind-radios',
  imports: [ReactiveFormsModule],
  standalone: true,
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective
    },
  ],
  template: `
    @if(sessionData){
      <div><strong>{{data.label}}</strong></div>
      {{sessionData}}
    } @else {
      <div>
        <strong>{{data.label}}</strong>
      </div>
      @for(option of data.options; track $index) {
        <label>{{option.label}}</label>
        <input type="radio" [value]="option.value" [name]="formName" [formControlName]="formName">
      }
    }

`})
export class Radios {
  @Input() formName: any;
  @Input() sessionData: any;
  @Input() data: any;
}

@Component({selector: 'ind-dropdown',
  imports: [ReactiveFormsModule, NgForOf],
  standalone: true,
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective
    },
  ],
  template: `
    @if(sessionData){
      <div><strong>{{data.label}}</strong></div>
      {{sessionData}}
    } @else {
      <div><strong>{{data.label}}</strong></div>
      <select [formControlName]="formName">
        <option *ngFor="let option of data.options"  [value]="option.value">{{option.label}}</option>
      </select>
    }

`})
export class Dropdown {
  @Input() formName: any;
  @Input() sessionData: any;
  @Input() data: any;
}

export const customInputs = [
  {
    type: 'text',
    component: TextInput
  },
  {
    type: 'radio',
    component: Radios
  },
  {
    type: 'dropdown',
    component: Dropdown
  }
]
