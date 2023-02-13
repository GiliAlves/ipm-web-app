import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public header = "Igreja Presbiteriana de Mauá";
  public note = "Esta Igreja crê na Biblia, está empenhada em viver os seus ensinos e a proclamar as verdades da Palavra de Deus!";

  public pagesList = [
    { title: 'Pastoral', url: 'pastoral', icon: 'bookmarks', line: 'none', color: "secondary" },
    { title: 'Devocional', url: 'devocional', icon: 'newspaper', line: 'inset', color: "secondary" },
    { title: 'Novo Cântico', url: 'novo-cantico', icon: 'musical-notes', line: 'none', color: "primary" },
    { title: 'Cancioneiro', url: 'cancioneiro', icon: 'volume-high', line: 'inset', color: "primary" },
    // { title: 'Calendário', url: 'calendario', icon: 'calendar-number', line: 'none', color: "tertiary" },
    // { title: 'Downloads', url: 'downloads', icon: 'download', line: 'inset', color: "tertiary" },

  ];
  public pagesTab = [
    { title: 'Inicio', url: 'pastoral', icon: 'reader', line: 'inset', color: "primary" },
    // { title: 'Oração', url: 'oracao', icon: 'chatbubbles', line: 'full', color: "warning" },
    { title: 'Sobre', url: 'sobre', icon: 'finger-print', line: 'none', color: "danger" },
  ];

  public social = [
    { url: 'https://www.youtube.com/@IgrejaPresbiterianadeMaua', icon: 'logo-youtube', color: "primary" },
    { url: 'https://www.instagram.com/ipmaua/', icon: 'logo-instagram', color: "primary" },
    { url: 'https://www.facebook.com/IgrejaPresbiterianaDeMaua', icon: 'logo-facebook', color: "primary" },
    { url: 'https://goo.gl/maps/eEnZyx1YuF8RJ8N5A', icon: 'location-outline', color: 'primary'}
  ];

  constructor() {}
}
