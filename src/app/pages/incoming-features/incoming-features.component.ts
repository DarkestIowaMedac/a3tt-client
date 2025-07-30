import { Component } from '@angular/core';

@Component({
  selector: 'app-incoming-features',
  standalone: false,
  templateUrl: './incoming-features.component.html',
  styleUrls: ['./incoming-features.component.scss']
})
export class IncomingFeaturesComponent {
  databaseFeatures = [
    {
      title: 'Timestamps',
      description: 'Adición de campos de creación y modificación en todas las tablas',
      status: 'En desarrollo',
      icon: 'bi bi-clock-history'
    },
    {
      title: 'Borrado blando',
      description: 'Campo para marcar usuarios como eliminados sin borrarlos físicamente',
      status: 'En desarrollo',
      icon: 'bi bi-trash'
    },
    {
      title: 'Gestión de colores',
      description: 'Campo color en categorías para personalización visual',
      status: 'Planeado',
      icon: 'bi bi-palette'
    },
    {
      title: 'Estructura de tareas avanzada',
      description: 'Campos para prioridad, tareas padre y posición en categoría',
      status: 'Planeado',
      icon: 'bi bi-diagram-3'
    }
  ];

  backendFeatures = [
    {
      title: 'Actualización de modelos',
      description: 'Ajuste de modelos y DTOs para nuevos campos de la base de datos',
      status: 'En desarrollo',
      icon: 'bi bi-database'
    },
    {
      title: 'Nuevos endpoints',
      description: 'Creación de endpoints para soportar las nuevas funcionalidades del frontend',
      status: 'Planeado',
      icon: 'bi bi-server'
    }
  ];

  frontendFeatures = [
    {
      title: 'Drag & Drop avanzado',
      description: 'Arrastrar tareas entre categorías y organizar jerarquías',
      status: 'En roadmap',
      icon: 'bi bi-arrows-move'
    },
    {
      title: 'Subtareas infinitas',
      description: 'Creación de subtareas en múltiples niveles jerárquicos',
      status: 'En roadmap',
      icon: 'bi bi-list-nested'
    },
    {
      title: 'Personalización visual',
      description: 'Cambiar colores de categorías y prioridades de tareas',
      status: 'Planeado',
      icon: 'bi bi-eyedropper'
    }
  ];

  designFeatures = [
    {
      title: 'Refactorización SASS',
      description: 'Uso de variables y funciones para un diseño más consistente',
      status: 'En desarrollo',
      icon: 'bi bi-brush'
    },
    {
      title: 'Diseño dinámico',
      description: 'Mejoras en la interfaz para una experiencia más fluida',
      status: 'Planeado',
      icon: 'bi bi-layout-wtf'
    }
  ];

  releaseFeatures = [
    {
      title: 'Versión Web',
      description: 'Despliegue en servidor web con todas las funcionalidades',
      status: 'Planeado',
      icon: 'bi bi-layout-wtf'
    },
    {
      title: 'Aplicación móvil',
      description: 'Lanzamiento de versiones nativas para iOS y Android',
      status: 'En roadmap',
      icon: 'bi bi-phone'
    }
  ];
}