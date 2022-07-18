export interface Blacklist {
  id: number;
  environmentId: number;
  banId: string;
  banName: string;
  reason: string;
}
export interface PageResult<T> {
  list?: Array<T>;
  pagination: Pagination;
}
export interface Pagination {
  total: number;
  page: number;
  size: number;
}