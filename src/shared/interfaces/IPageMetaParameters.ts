import { PageOptionsDto } from '../pagination/pageOption.dto';

export interface IPageMetaParameters {
  itemsPerPage: number;
  pageOptionsDto: PageOptionsDto;
  total: number;
}
