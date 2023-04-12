import { Component, OnInit } from '@angular/core';
import { StorageService } from 'src/app/services/storage.service';
import { IGREJA, PAGES_LIST, PAGES_TAB, SOCIAL } from './model/shared';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  public igreja = IGREJA;
  public pagesList = PAGES_LIST;
  public pagesTab = PAGES_TAB;
  public social = SOCIAL;
  public icons = [
    { name: 'code-slash', color: 'success' },
    { name: 'fitness-outline', color: 'danger' },
    { name: 'barbell-outline', color: 'dark' },
    { name: 'cafe-outline', color: 'secondary'},
    { name: 'bug-outline', color: 'warning'}
  ];

  constructor(private storageService: StorageService) {
    this.storageService.create();
    this.storageService.clear();
  }

  async ngOnInit() {
  }
}
