import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { ProductsManagementService } from '../../Services/products-management.service';
import { ICategory } from '../../utilities/models/category';
import { IProduct } from '../../utilities/models/product';
import { CommonModule } from '@angular/common';
import { FiltersComponent } from '../../components/filters/filters.component';
import { RouterModule } from '@angular/router';
import { ListService, LocalizationModule } from '@abp/ng.core';
import { PageModule } from '@abp/ng.components/page';
import { SharedModule } from '../../../shared/shared.module';
import { Confirmation, ConfirmationService, ThemeSharedModule } from '@abp/ng.theme.shared';
import ProductFormComponent from '../product-form/product-form.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    FiltersComponent,
    RouterModule,
    LocalizationModule,
    PageModule,
    SharedModule,
    ThemeSharedModule,
    ProductFormComponent
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ListService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export default class ProductListComponent implements OnInit {
  categoriesList: ICategory[] = [];
  selectedCategory: string = '';
  isModalOpen: boolean = false;
  editedProductId:string;
  modalOptions:any={
    // backdrop:'static',
    centered:true
  }
  constructor(
    public readonly list: ListService,
    public productManagementService: ProductsManagementService,
    private confirmation: ConfirmationService
  ) {
    console.log('List', list);
    // list.hookToQuery()
  }

  ngOnInit(): void {
    this.getLookup();
    this.getData();
  }
  getLookup() {
    this.productManagementService.getCategories().subscribe({
      next: res => {
        this.categoriesList = res;
      },
    });
  }
  getData() {
    this.productManagementService.getProducts().subscribe();
  }
  onOpenModal(isEditMode:boolean=false) {
    this.isModalOpen = true;
    if(!isEditMode){
      this.editedProductId=''
    }
  }
  onSearch(event: Event) {
    const searchKey = (event.target as HTMLInputElement).value;
    this.productManagementService.searchOnProducts(searchKey);
  }
  onFilterByCategory(event: Event) {
    const categoryId = (event.target as HTMLSelectElement).value;
    this.selectedCategory = categoryId;
    this.productManagementService.filterProductsBasedOnCategory(categoryId);
  }
  onClearFilter() {
    this.selectedCategory = '';
    this.productManagementService.filterProductsBasedOnCategory('');
  }
  onEdit(productId:string){
    this.editedProductId=productId;
    this.onOpenModal(true);

  }

  onDelete(product: IProduct, index: number) {
    this.confirmation.warn(`::Are You sure You Want to delete ${product.name} product ?`,"::Delete Product").subscribe(
      (state:Confirmation.Status)=>{
        if(state === Confirmation.Status.confirm){
          this.productManagementService.deleteProduct(index).subscribe();
        }

      }
    )
    // const isActionConfirmed = window.confirm(
    //   `Are You sure You Want to delete ${product.name} product ?`
    // );
    // if (isActionConfirmed) {
    //   this.productManagementService.deleteProduct(index).subscribe();
    // }
  }
}
