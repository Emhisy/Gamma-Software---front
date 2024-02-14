import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { BandComponent } from "./band.component";
import { bandRoutes } from "./band.routes";
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { MatInputModule } from '@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker'; 
import { MatButtonModule } from "@angular/material/button";
import {provideNativeDateAdapter} from '@angular/material/core';

@NgModule({
    declarations: [BandComponent],
    imports: [
        MatFormFieldModule,
        CommonModule,
        ReactiveFormsModule,
        MatInputModule,
        MatDatepickerModule,
        MatButtonModule,
        RouterModule.forChild(bandRoutes)
    ],
    providers: [provideNativeDateAdapter()],
})

export class BandModule  { }