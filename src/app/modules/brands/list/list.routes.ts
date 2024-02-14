import { Route } from "@angular/router";
import { BandListComponent } from "./list.component";
import { BandListResolver } from "./list.resolver";

export const bandListRoutes: Route[] = [
    {
        path: '',
        component: BandListComponent,
        resolve: {
            inventoryInitialState: BandListResolver,
        },
    }
]