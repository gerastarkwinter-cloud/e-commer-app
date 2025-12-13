import { CommonModule } from '@angular/common';
import { Component, computed, inject, input, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CatalogStore } from '../../../application';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, ReactiveFormsModule, FormsModule],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  private readonly catalogStore = inject(CatalogStore);
  private readonly fb = inject(FormBuilder);

  readonly categories = this.catalogStore.categories;

  readonly userName = signal('Marcos Maure');
  readonly userInitial = computed(() => this.userName()[0]?.toUpperCase() ?? '?');

  /** INPUTS */
  readonly title = input.required<string>();
  readonly items = input<number>(0);

  readonly searchForm = this.fb.nonNullable.group({
    category: this.fb.nonNullable.control(''),
    query: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(4)]),
  });

  constructor() {
    this.searchForm.controls.category.valueChanges.subscribe((selectedCategory) => {
      this.catalogStore.setCategoryFilter(selectedCategory || null);
    });

    this.searchForm.controls.query.valueChanges.subscribe((rawValue) => {
      const queryControl = this.searchForm.controls.query;
      const searchQuery = (rawValue ?? '').trim();
      this.catalogStore.setSearchQuery(queryControl.valid ? searchQuery : '');
    });


  }

  onSubmit() {
    
    if (this.searchForm.invalid) {
      this.searchForm.markAllAsTouched();
      return;
    }

    const q = this.searchForm.controls.query.value.trim();
    this.catalogStore.setSearchQuery(q);
  }

  onClear() {
    this.searchForm.reset({ category: '', query: '' });
    this.catalogStore.clearFilters();
  }
}
