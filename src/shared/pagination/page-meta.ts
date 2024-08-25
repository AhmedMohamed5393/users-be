import { IPageMetaParameters } from '../interfaces/IPageMetaParameters';

export class PageMeta {
  readonly page: number;
  readonly take: number;
  readonly itemsPerPage: number;
  readonly total: number;
  readonly pageCount: number;
  readonly hasPreviousPage: boolean;
  readonly hasNextPage: boolean;
  constructor({ pageOptionsDto, total, itemsPerPage }: IPageMetaParameters) {
    this.page = pageOptionsDto.page;
    this.take = pageOptionsDto.take;
    this.itemsPerPage = itemsPerPage;
    this.total = total;
    this.pageCount = Math.ceil(this.total / this.take);
    this.hasPreviousPage = this.page > 1;
    this.hasNextPage = this.page < this.pageCount;
  }
}
