import { Component, ViewChild, OnInit, ElementRef } from "@angular/core";
import { Band } from "../../../services/band/band.model";
import { BandService } from "../../../services/band/band.service";
import { ActivatedRoute, Router } from "@angular/router";
import { takeUntil, Subject, map } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";


@Component({
    selector: 'app-bands',
    templateUrl: './list.component.html',
    styleUrl: './list.component.css',
})
export class BandListComponent implements OnInit
{
    @ViewChild('uploadButton')
    inputVariable: ElementRef;
    
    public bands: Band[];

    private _unsubscribeAll: Subject<boolean> = new Subject<boolean>();


    constructor(
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _bandService: BandService
    ){
    }

    /**
     * recover data from resolver.
     */
    ngOnInit(): void {
        this._activatedRoute.data
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data) => 
            {
                this.bands = data['inventoryInitialState'].bands;
            })

    }

    /**
     * on click delete button send a request to the api and splice the object from this.bands.
     * @param index 
     * @returns 
     */
    onDelete(index: number): void
    {
        const id = this.bands[index].id;
        if(!id){
            return;
        }   
        this._bandService.delete(id).subscribe(() => this.bands.splice(index, 1));
    }

    /**
     * on click add button send a request to the api and add the newly created object in this.bands
     */
    onCreate()
    {
        const band = new Band({
            name: 'Nouveau Groupe de musique'
        });
        
        this._bandService.create(band).subscribe((band) =>
        {
            if (band instanceof HttpErrorResponse) {
                return;
            }

            this._router.navigate(['/', 'bands', band.id]);
        });
    }

    /**
     * on upload send the request to the api and refresh the view with all the data sent.
     * @param event 
     */
    uploadFile(event: any) {
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append('file', file);
        
        this._bandService.importFromFile(formData).subscribe((data: any) => {
            this.bands = data;
            this.inputVariable.nativeElement.value = "";
        });
    }
}