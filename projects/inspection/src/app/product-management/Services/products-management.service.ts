import { HttpClient } from '@angular/common/http';
import { computed, Injectable, signal, Signal } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject, tap } from 'rxjs';
import { IProduct, IProductFilters, IRequestQuery } from '../utilities/models/product';
import { ICategory } from '../utilities/models/category';
import { PagedResultDto } from '@abp/ng.core';

@Injectable()
export class ProductsManagementService {
  apisBasePath = 'assets';

  private productsListSource = signal<IProduct[]>([]);
  // productsList$ = this.displayedProductsList.asObservable();
  categoriesList$ = signal<ICategory[]>([]);
  // filters: IProductFilters = {
  //   searchKey: '',
  //   categoryId: '',
  // };
  filters = signal<IProductFilters>({
    searchKey: signal(''),
    categoryId: signal(''),
  });
  totalCount: number = 0;

  private displayedProductsList = computed(() => {
    const list = this.productsListSource().filter(product => {
      const matchesSearch = this.filters().searchKey()
        ? product.name.toLowerCase().includes(this.filters().searchKey().toLowerCase())
        : true;
      const matchesCategory = this.filters().categoryId()
        ? product.categoryId === this.filters().categoryId()
        : true;
      return matchesSearch && matchesCategory;
    });

    if (!!this.filters().categoryId() || !!this.filters().searchKey()) {
      this.totalCount = list.length;
    }
    return list;
  });

  constructor(private http: HttpClient) {
    this.rehydrateDataFromLocalStorage();
  }

  getCategories(): Observable<ICategory[]> {
    if (!!this.categoriesList$()?.length) {
      return of(this.categoriesList$());
    }
    return this.http.get<ICategory[]>(`${this.apisBasePath}/categories.json`).pipe(
      tap(res => {
        this.categoriesList$.set(res);
      })
    );
  }
  getProducts(query: IRequestQuery): Observable<PagedResultDto<IProduct>> {
      this.searchOnProducts(query.filter);
    
    // if (this.productsList?.length) {
    //   // this.displayedProductsList.set(this.productsList);
    //   return of();
    // }
    return this.http
      .get<PagedResultDto<IProduct>>(`${this.apisBasePath}/products.json`)
      .pipe(
        tap(res => {
          if (res.items.length) {
            const slicedList = res.items.slice(
              query.skipCount > 0 ? query.skipCount - 1 : query.skipCount,
              query.skipCount + query.maxResultCount
            );
            this.productsListSource.set(slicedList);
            // this.displayedProductsList.set(res);
            localStorage.setItem('Products', JSON.stringify(slicedList));
            debugger;
            this.totalCount = res.totalCount;
          }
        })
      );
  }

  getProductById(productId: string): Observable<IProduct | null> {
    const targetProduct = this.productsList?.find(product => product.id === productId);
    if (!!targetProduct) {
      return of(targetProduct);
    }
    return of(null);
  }

  addNewProduct(product: IProduct): Observable<boolean> {
    const products = [...this.productsList];
    products.unshift(product);
    this.productsListSource.set(products);
    // this.displayedProductsList.set(products);
    return of(true);
  }

  updateProduct(product: IProduct, productId: string): Observable<boolean> {
    const updatedProductIndex = this.productsList.findIndex(
      product => product.id === productId
    );
    if (updatedProductIndex > -1) {
      this.productsList[updatedProductIndex] = product;
      this.productsListSource.set([...this.productsList]);
      return of(true);
    }
    return of(false);
  }

  deleteProduct(productIndex: number): Observable<boolean> {
    this.productsList.splice(productIndex, 1);
    this.productsListSource.set([...this.productsList]);
    return of(true);
  }

  searchOnProducts(searchKey: string) {
    this.filters().searchKey.set(searchKey);
    // if (!!searchKey) {
    //   const newList = this.filters.categoryId
    //     ? this.productsList.filter(
    //         (product) =>
    //           product.name
    //             .toLowerCase()
    //             .includes(searchKey.toLocaleLowerCase()) &&
    //           product.categoryId == this.filters.categoryId
    //       )
    //     : this.productsList.filter((product) =>
    //         product.name.toLowerCase().includes(searchKey.toLocaleLowerCase())
    //       );
    //   this.displayedProductsList.set(newList);
    // } else {
    //   if (!this.filters.categoryId) {
    //     this.displayedProductsList.set(this.productsList);
    //   } else {
    //     this.filterProductsBasedOnCategory(this.filters.categoryId);
    //   }
    // }
  }

  filterProductsBasedOnCategory(categoryId: string) {
    this.filters().categoryId.set(categoryId);
    // if (!!categoryId) {
    //   const newList = this.filters.searchKey
    //     ? this.productsList.filter(
    //         (product) =>
    //           product.categoryId == categoryId &&
    //           product.name
    //             .toLowerCase()
    //             .includes(this.filters.searchKey.toLocaleLowerCase())
    //       )
    //     : this.productsList.filter(
    //         (product) => product.categoryId == categoryId
    //       );
    //   this.displayedProductsList.set(newList);
    // } else {
    //   if (!this.filters.searchKey) {
    //     this.displayedProductsList.set(this.productsList);
    //   } else {
    //     this.searchOnProducts(this.filters.searchKey);
    //   }
    // }
  }

  rehydrateDataFromLocalStorage() {
    if (!this.productsList.length) {
      this.productsListSource.set(JSON.parse(localStorage.getItem('Products')!));
    }
  }

  resetFilter() {
    this.filters.set({ searchKey: signal(''), categoryId: signal('') });
  }

  get productsList() {
    return this.productsListSource() ?? [];
  }
  get displayedProducts() {
    return this.displayedProductsList() ?? [];
  }
}
