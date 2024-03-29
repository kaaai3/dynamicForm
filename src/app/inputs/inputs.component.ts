import { Component, OnInit, Input } from '@angular/core';
import { ReactiveFormsModule, ControlContainer, FormGroupDirective } from '@angular/forms';
import { NgForOf } from "@angular/common";

@Component({ template: '',standalone: true,})
export class BaseComponent {
  @Input() formName: any;
  @Input() sessionData: any;
  @Input() data: any;

  constructor(public controlContainer: ControlContainer, public formGroupDirective: FormGroupDirective) {}
}

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
      <div>
        <div><strong>{{data.label}}</strong></div>
        {{sessionData}}
      </div>
    } @else {
      <div><strong>{{data.label}}</strong></div>
      <input [formControlName]="formName">
    }

  `})
export class TextInput extends BaseComponent {

}

@Component({selector: 'ind-radios',
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
      <div>
      <div><strong>{{data.label}}</strong></div>
      {{sessionData}}
      </div>
    } @else {
      <div>
        <strong>{{data.label}}</strong>
      </div>
        <ng-container *ngFor="let option of data.options">
          <label>{{option.label}}</label>
          <input type="radio" [value]="option.value" [name]="formName" [formControlName]="formName">
        </ng-container>

    }

`})
export class Radios extends BaseComponent {

}

@Component({selector: 'ind-dropdown',
  imports: [NgForOf, ReactiveFormsModule],
  standalone: true,
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective
    },
  ],
  template: `
    @if(sessionData){
      <div>
        <div><strong>{{data.label}}</strong></div>
        {{sessionData}}
      </div>
    } @else {
      <div><strong>{{data.label}}</strong></div>
      <select [formControlName]="formName">
        <option *ngFor="let option of data.options"  [value]="option.value">{{option.label}}</option>
      </select>
    }

`})
export class Dropdown extends BaseComponent {

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
