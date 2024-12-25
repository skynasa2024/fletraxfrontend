export interface ResponseModel<T> {
  success: boolean;
  message: string;
  result: T;
}

export interface PagenatetionModel<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: any[];
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalPages: number;
  totalElements: number;
  first: boolean;
  size: number;
  number: number;
  sort: any[];
  numberOfElements: number;
  empty: boolean;
}

export type PagenatedResponseModel<T> = ResponseModel<PagenatetionModel<T>>;
