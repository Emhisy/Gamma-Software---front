import { inject } from "@angular/core"
import { forkJoin } from "rxjs"
import { BandService } from "../../../services/band/band.service"

export const BandListResolver = () => 
{
    const bandService = inject(BandService);

    return forkJoin({
        bands: bandService.getAll()
    })
}