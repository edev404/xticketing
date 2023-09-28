import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { IconDefinition } from '@ant-design/icons-angular';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import {
  MenuFoldOutline,
  MenuUnfoldOutline
} from '@ant-design/icons-angular/icons';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzTimelineModule } from 'ng-zorro-antd/timeline';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NgxPaginationModule } from 'ngx-pagination';

const icons: IconDefinition[] = [MenuFoldOutline, MenuUnfoldOutline];
const MODULES:any[] = [
  NzIconModule.forChild(icons),
  NzButtonModule,
  NzGridModule,
  NzLayoutModule,
  NzCarouselModule,
  NzBreadCrumbModule,
  NzMenuModule,
  NzCardModule,
  NzAvatarModule,
  NzFormModule,
  NzInputModule,
  NzNotificationModule,
  NzSelectModule,
  NzDropDownModule,
  NzTableModule,
  NzSwitchModule,
  NzPaginationModule,
  NzDatePickerModule,
  NzPageHeaderModule,
  NzDescriptionsModule,
  NzCheckboxModule,
  NzTimePickerModule,
  NzInputNumberModule,
  NzTabsModule,
  NzToolTipModule,
  NzModalModule,
  NzDividerModule,
  NzStatisticModule,
  NzUploadModule,
  NzMessageModule,
  NzTimelineModule,
  NzSpaceModule,
  NzCollapseModule,
  NgxPaginationModule
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ...MODULES
  ],
  exports:[
    ...MODULES
  ]
})
export class AntDesignModule { }
