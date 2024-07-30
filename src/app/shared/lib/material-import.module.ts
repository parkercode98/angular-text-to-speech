import { NgModule, inject } from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DomSanitizer } from '@angular/platform-browser';

@NgModule({
  imports: [
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatPaginatorModule,
    MatRadioModule,
    MatSelectModule,
    MatSidenavModule,
    MatSlideToggleModule,
    MatSortModule,
    MatTableModule,
    MatTooltipModule,
  ],
  exports: [
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatPaginatorModule,
    MatRadioModule,
    MatSelectModule,
    MatSidenavModule,
    MatSlideToggleModule,
    MatSortModule,
    MatTableModule,
    MatTooltipModule,
  ],
})
export class MaterialImportModule {
  private _icons = [
    { name: 'chart_view', path: 'assets/icons/ChartView.svg' },
    { name: 'export', path: 'assets/icons/Export.svg' },
    { name: 'map_view', path: 'assets/icons/MapView.svg' },
    { name: 'outline', path: 'assets/icons/Outline.svg' },
    { name: 'pause', path: 'assets/icons/Pause.svg' },
    { name: 'play', path: 'assets/icons/Play.svg' },
    { name: 'caret_double_left', path: 'assets/icons/CaretDoubleLeft.svg' },
    { name: 'caret_double_right', path: 'assets/icons/CaretDoubleRight.svg' },
    { name: 'add', path: 'assets/icons/add.svg' },
    { name: 'remove', path: 'assets/icons/remove.svg' },
    { name: 'circle_arrow_left', path: 'assets/icons/CaretCircleLeft.svg' },
    { name: 'circle_arrow_right', path: 'assets/icons/CaretCircleRight.svg' },
  ];

  private _matIconRegistry = inject(MatIconRegistry);
  private _domSanitizer = inject(DomSanitizer);

  constructor() {
    this._icons.forEach((i) => {
      this._matIconRegistry.addSvgIcon(i.name, this._domSanitizer.bypassSecurityTrustResourceUrl(i.path));
    });
  }
}
