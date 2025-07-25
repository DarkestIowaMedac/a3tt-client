import { Component } from '@angular/core';

@Component({
  selector: 'app-incoming-features',
  standalone: false,
  templateUrl: './incoming-features.component.html',
  styleUrls: ['./incoming-features.component.scss']
})
export class IncomingFeaturesComponent {
  features = [
    {
      title: 'Integración con Calendario',
      description: 'Sincroniza tus tareas con Google Calendar o Outlook.',
      status: 'En desarrollo',
      icon: 'bi bi-calendar-week'
    },
    {
      title: 'App Móvil',
      description: 'Versión nativa para iOS y Android.',
      status: 'Planeado',
      icon: 'bi bi-phone'
    },
    {
      title: 'Colaboración en Equipo',
      description: 'Comparte tareas y proyectos con tu equipo.',
      status: 'En roadmap',
      icon: 'bi bi-people-fill'
    }
  ];
}