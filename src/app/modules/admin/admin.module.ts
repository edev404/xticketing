import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin/admin.component';
import { UserComponent } from './admin/user/user.component';
import { AntDesignModule } from 'src/app/ant-design.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProfilesComponent } from './admin/user/profiles/profiles.component';
import { CreateUserComponent } from './admin/user/create-user/create-user.component';
import { ViewUserComponent } from './admin/user/view-user/view-user.component';
import { CompanyComponent } from './admin/company/company.component';
import { ViewFleetCompaniesComponent } from './admin/company/view-fleet-companies/view-fleet-companies.component';
import { ViewTypesCompaniesComponent } from './admin/company/view-types-companies/view-types-companies.component';
import { ViewCollectorsCompaniesComponent } from './admin/company/view-collectors-companies/view-collectors-companies.component';
import { ServicesAdminComponent } from './admin/services-admin/services.component';
import { CharacteristicsServicesComponent } from './admin/services-admin/characteristics-services/characteristics-services.component';
import { ServicesComponent } from './admin/services-admin/services/services.component';
import { ClearingComponent } from './admin/clearing/clearing.component';
import { RechargesComponent } from './admin/clearing/recharges/recharges.component';
import { PercentageTicketsComponent } from './admin/clearing/percentage-tickets/percentage-tickets.component';
import { TypeActorsComponent } from './admin/clearing/type-actors/type-actors.component';
import { CreateServiceComponent } from './admin/services-admin/services/create-service/create-service.component';
import { CreateCharacteristicsServiceComponent } from './admin/services-admin/characteristics-services/create-characteristics-service/create-characteristics-service.component';
import { CreateCollectorCompaniesComponent } from './admin/company/view-collectors-companies/create-collector-companies/create-collector-companies.component';
import { EntitesComponent } from './admin/entites/entites.component';
import { CreateEntitesComponent } from './admin/entites/create-entites/create-entites.component';
import { CreateRechargesComponent } from './admin/clearing/recharges/create-recharges/create-recharges.component';
import { CreateActorsComponent } from './admin/clearing/type-actors/create-actors/create-actors.component';
import { CreateConfigTicketsComponent } from './admin/clearing/percentage-tickets/create-config-tickets/create-config-tickets.component';
import { ConfigTicketsComponent } from './admin/clearing/percentage-tickets/config-tickets/config-tickets.component';
import { ParametersComponent } from './admin/parameters/parameters.component';
import { GeneralComponent } from './admin/parameters/general/general.component';
import { AdminListComponent } from './admin/parameters/admin-list/admin-list.component';
import { MobileComponent } from './admin/parameters/mobile/mobile.component';
import { ConfigFileComponent } from './admin/parameters/config-file/config-file.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgxPaginationModule } from 'ngx-pagination';
import { PlantillaComponent } from './admin/parameters/plantilla/plantilla.component';
import { LogComponent } from './admin/log/log.component';
import { TypeFindingComponent } from './admin/clearing/type-finding/type-finding.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

@NgModule({
  declarations: [
    AdminComponent,
    UserComponent,
    ProfilesComponent,
    CreateUserComponent,
    ViewUserComponent,
    CompanyComponent,
    ViewFleetCompaniesComponent,
    ViewTypesCompaniesComponent,
    ViewCollectorsCompaniesComponent,
    ServicesAdminComponent,
    CharacteristicsServicesComponent,
    ServicesComponent,
    ClearingComponent,
    RechargesComponent,
    PercentageTicketsComponent,
    TypeActorsComponent,
    CreateServiceComponent,
    CreateCharacteristicsServiceComponent,
    CreateCollectorCompaniesComponent,
    EntitesComponent,
    CreateEntitesComponent,
    CreateRechargesComponent,
    CreateActorsComponent,
    CreateConfigTicketsComponent,
    ConfigTicketsComponent,
    ParametersComponent,
    GeneralComponent,
    AdminListComponent,
    MobileComponent,
    ConfigFileComponent,
    PlantillaComponent,
    LogComponent,
    TypeFindingComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    AntDesignModule,
    FormsModule,
    DragDropModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    CKEditorModule
  ]
})
export class AdminModule { }
