import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ProductsManagementService } from '../../Services/products-management.service';
import { Confirmation, ConfirmationService } from '@abp/ng.theme.shared';
import ProductListComponent from './product-list.component';
import { ListService, LocalizationModule, LocalizationService } from '@abp/ng.core';
import { FiltersComponent } from '../../components/filters/filters.component';
import ProductFormComponent from '../product-form/product-form.component';
import { IProduct } from '../../utilities/models/product';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let mockProductService: jasmine.SpyObj<ProductsManagementService>;
  let mockConfirmationService: jasmine.SpyObj<ConfirmationService>;
  let mockListService: jasmine.SpyObj<ListService>;
  let mockLocalizationService: jasmine.SpyObj<LocalizationService>;

  beforeEach(async () => {
    mockProductService = jasmine.createSpyObj('ProductsManagementService', [
      'getCategories',
      'getProducts',
      'filterProductsBasedOnCategory',
      'deleteProduct',
    ]);
    mockConfirmationService = jasmine.createSpyObj('ConfirmationService', ['warn']);
    mockListService = jasmine.createSpyObj('ListService', ['hookToQuery', 'get']);

    await TestBed.configureTestingModule({
      declarations: [],
      imports: [FiltersComponent, ProductFormComponent,ProductListComponent,LocalizationModule],
      providers: [
        { provide: ProductsManagementService, useValue: mockProductService },
        { provide: ConfirmationService, useValue: mockConfirmationService },
        { provide: ListService, useValue: mockListService },
        { provide: LocalizationService, useValue: mockLocalizationService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

//   describe('ngOnInit', () => {
//     it('should call getLookup and getData', () => {
//       spyOn(component, 'getLookup').and.callThrough();
//       spyOn(component, 'getData').and.callThrough();

//       component.ngOnInit();

//       expect(component.getLookup).toHaveBeenCalled();
//       expect(component.getData).toHaveBeenCalled();
//     });
//   });

  describe('getLookup', () => {
    it('should populate categoriesList from service', () => {
      const categoriesMock = [
        {
          id: '1',
          name: 'Electronics',
        },
      ];
      mockProductService.getCategories.and.returnValue(of(categoriesMock));

      component.getLookup();

      expect(component.categoriesList).toEqual(categoriesMock);
    });
  });

//   describe('getData', () => {
//     it('should hook to query and call service', () => {
//       mockListService.hookToQuery.and.returnValue(of({ items: [], totalCount: 0 }));

//       component.getData();

//       expect(mockListService.hookToQuery).toHaveBeenCalled();
//     });
//   });

//   describe('onOpenModal', () => {
//     it('should open modal and reset editedProductId if not in edit mode', () => {
//       component.onOpenModal(false);
//       expect(component.isModalOpen).toBeTrue();
//       expect(component.editedProductId).toEqual('');
//     });

//     it('should open modal and set editedProductId if in edit mode', () => {
//       component.onOpenModal(true);
//       expect(component.isModalOpen).toBeTrue();
//       expect(component.editedProductId).toBeDefined();
//     });
//   });

//   describe('onSearch', () => {
//     it('should filter products based on search input', () => {
//       const searchEvent = { target: { value: 'test' } } as unknown as Event;
//       component.onSearch(searchEvent);
//       expect(mockListService.filter).toEqual('test');
//       expect(mockListService.get).toHaveBeenCalled();
//     });
//   });

  describe('onFilterByCategory', () => {
    it('should filter products by selected category', () => {
      const filterEvent = { target: { value: '1' } } as unknown as Event;
      component.onFilterByCategory(filterEvent);
      expect(component.selectedCategory).toEqual('1');
      expect(mockProductService.filterProductsBasedOnCategory).toHaveBeenCalledWith('1');
    });
  });

  describe('onClearFilter', () => {
    it('should clear the selected category and reset the filter', () => {
      component.onClearFilter();
      expect(component.selectedCategory).toEqual('');
      expect(mockProductService.filterProductsBasedOnCategory).toHaveBeenCalledWith('');
    });
  });

  describe('onEdit', () => {
    it('should set editedProductId and open modal in edit mode', () => {
      const productId = '123';
      component.onEdit(productId);
      expect(component.editedProductId).toEqual(productId);
      expect(component.isModalOpen).toBeTrue();
    });
  });
//   describe('onPage', () => {
//     it('should update the page in ListService', () => {
//       // Spy on the 'page' setter to track updates
//       const pageSetterSpy = spyOnProperty(mockListService, 'page', 'set').and.callThrough();
      
//       const pageEvent = { offset: 2 };
//       component.onPage(pageEvent);
  
//       // Ensure the setter was called with the correct value
//       expect(pageSetterSpy).toHaveBeenCalledWith(3);
//     });
//   });

//   describe('onPage', () => {
//     it('should update the page in ListService', () => {
//         debugger
//       const pageEvent = { offset: 2 };
//       component.onPage(pageEvent);
//       console.log(mockListService)
//       expect(mockListService.page).toEqual(3);
//     });
//   });

  describe('onDelete', () => {
    it('should confirm and delete the product', () => {
      const productMock = {
        id: 'cnlba0cunm0tk2flq',
        name: 'iPhone 14',
        price: 999.99,
        category: 'Electronics',
        categoryId: '1',
        creationDate: '2024-08-01',
      } as IProduct;
      mockConfirmationService.warn.and.returnValue(of(Confirmation.Status.confirm));
      mockProductService.deleteProduct.and.returnValue(of());

      component.onDelete(productMock, 1);

      expect(mockConfirmationService.warn).toHaveBeenCalled();
      expect(mockProductService.deleteProduct).toHaveBeenCalledWith(1);
    });
  });
});
