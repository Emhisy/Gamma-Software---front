import { NgModule } from "@angular/core";
import { BandListComponent } from "./list.component";
import { RouterModule } from "@angular/router";
import { bandListRoutes } from "./list.routes";
import { BandService } from "../../../services/band/band.service";
import { CommonModule } from "@angular/common";
import { MatButtonModule, MatIconButton } from "@angular/material/button";
import {MatIconModule} from '@angular/material/icon';

@NgModule({
    declarations: [
        BandListComponent,
    ],
    providers: [BandService],
    imports: [
        MatButtonModule,
        MatIconButton,
        MatIconModule,
        CommonModule,
        RouterModule.forChild(bandListRoutes),
    ]
})

export class BandListModule {}