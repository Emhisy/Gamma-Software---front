import { inject } from "@angular/core"
import { BandService } from "../../../services/band/band.service";
import { ActivatedRouteSnapshot } from "@angular/router";

export const BandResolver = (route: ActivatedRouteSnapshot) => 
{
    const bandService = inject(BandService);

    return bandService.get(
        route.params['id']
    );
}