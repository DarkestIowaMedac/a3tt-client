import { InjectionToken, ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as toastr from 'toastr';

export interface ToastrOptions {
  closeButton: boolean;
  progressBar: boolean;
  positionClass: string;
  timeOut: number;
  extendedTimeOut: number;
  preventDuplicates: boolean;
  enableHtml: boolean;
  newestOnTop: boolean;
  tapToDismiss: boolean;
  toastClass: string;
  containerId: string;
  target: string;

}

export const DEFAULT_TOASTR_CONFIG: ToastrOptions = {

  timeOut: 4000,
  closeButton: true,
  progressBar: true,
  positionClass: 'toast-top-right',               
  extendedTimeOut: 3000,
  preventDuplicates: true,
  enableHtml: false,
  newestOnTop: false,
  tapToDismiss: true,
  toastClass: 'toast-custom',
  containerId: 'toast-container',
  target: 'body'
};

@NgModule({
  declarations: [],
  imports: [CommonModule]
})
export class ToastrModule {
  static forRoot(): ModuleWithProviders<ToastrModule> {
    // Aplicar la configuración por defecto
    Object.assign(toastr, { options: DEFAULT_TOASTR_CONFIG });
    
    return {
      ngModule: ToastrModule,
      providers: [
        {
          provide: 'TOASTR_CONFIG',
          useValue: DEFAULT_TOASTR_CONFIG
        }
      ]
    };
  }
}