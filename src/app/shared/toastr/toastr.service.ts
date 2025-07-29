import { Injectable, Inject } from '@angular/core';
import * as toastr from 'toastr';
import { ToastrOptions, DEFAULT_TOASTR_CONFIG } from './toastr.module';

@Injectable({
  providedIn: 'root'
})
export class ToastrService {
  constructor(@Inject('TOASTR_CONFIG') private config: ToastrOptions) {
    this.initializeToastr();
  }

  private initializeToastr() {
    // Configuración inicial
    Object.assign(toastr, { options: this.config });
  }

  /**
   * Muestra notificación de éxito
   * @param message Mensaje a mostrar
   * @param title Título opcional
   * @param overrideConfig Configuración específica para esta notificación
   */
  success(message: string, title?: string, overrideConfig?: Partial<ToastrOptions>) {
    this.showNotification('success', message, title, overrideConfig);
  }

  /**
   * Muestra notificación de error
   * @param message Mensaje a mostrar
   * @param title Título opcional
   * @param overrideConfig Configuración específica para esta notificación
   */
  error(message: string, title?: string, overrideConfig?: Partial<ToastrOptions>) {
    this.showNotification('error', message, title, overrideConfig);
  }

  /**
   * Muestra notificación de información
   * @param message Mensaje a mostrar
   * @param title Título opcional
   * @param overrideConfig Configuración específica para esta notificación
   */
  info(message: string, title?: string, overrideConfig?: Partial<ToastrOptions>) {
    this.showNotification('info', message, title, overrideConfig);
  }

  /**
   * Muestra notificación de advertencia
   * @param message Mensaje a mostrar
   * @param title Título opcional
   * @param overrideConfig Configuración específica para esta notificación
   */
  warning(message: string, title?: string, overrideConfig?: Partial<ToastrOptions>) {
    this.showNotification('warning', message, title, overrideConfig);
  }

  /**
   * Limpia todas las notificaciones visibles
   */
  clear() {
    toastr.clear();
  }

  /**
   * Elimina una notificación específica
   * @param toastElement Elemento DOM de la notificación
   */
  remove(toastId: string) {
    
    const toastContainer = document.getElementById(this.config.containerId);
  if (toastContainer) {
    const toastElement = toastContainer.querySelector(`#${toastId}`);
    if (toastElement) {
      toastElement.remove();
    }
  }
  }

  /**
   * Actualiza la configuración global de Toastr
   * @param newConfig Nueva configuración
   */
  updateGlobalConfig(newConfig: Partial<ToastrOptions>) {
    Object.assign(this.config, newConfig);
    this.initializeToastr();
  }

  /**
   * Obtiene la configuración actual
   */
  getCurrentConfig(): ToastrOptions {
    return { ...this.config };
  }

  /**
   * Restablece la configuración a los valores por defecto
   */
  resetToDefaultConfig() {
    Object.assign(this.config, DEFAULT_TOASTR_CONFIG);
    this.initializeToastr();
  }

  private showNotification(
  type: 'success' | 'error' | 'info' | 'warning',
  message: string,
  title?: string,
  overrideConfig?: Partial<ToastrOptions>
) {
  // 1. Prepara configuración FINAL
  const finalConfig = {
    ...this.config,
    ...overrideConfig,
  };

  // 2. Aplica configuración DIRECTAMENTE a toastr
  this.applyToastrConfig(finalConfig);

  // 3. Muestra el toast con configuración EXPLÍCITA
  let toast: any;
  switch (type) {
    case 'success':
      toast = toastr.success(message, title, finalConfig);
      break;
    case 'error':
      toast = toastr.error(message, title, finalConfig);
      break;
    case 'info':
      toast = toastr.info(message, title, finalConfig);
      break;
    case 'warning':
      toast = toastr.warning(message, title, finalConfig);
      break;
  }

  // 4. Respaldo manual INFALIBLE
  setTimeout(() => {
    if (toast && toast.toastId) {
      this.remove(toast.toastId);
    }
  }, finalConfig.timeOut+1);

  return toast;
}

private applyToastrConfig(config: ToastrOptions) {
  // Asignación PROPERTY BY PROPERTY
  const toastrOptions = toastr.options as any;
  Object.keys(config).forEach(key => {
    if (key in toastrOptions) {
      toastrOptions[key] = config[key as keyof ToastrOptions];
    }
  });
}
}