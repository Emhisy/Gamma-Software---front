import { Routes } from "@angular/router";
import { BandComponent } from "./band.component";
import { BandResolver } from "./band.resolver";

export const bandRoutes: Routes = [
    {
        path: '',
        component: BandComponent,
        resolve: {
            band: BandResolver
        }
    }
]