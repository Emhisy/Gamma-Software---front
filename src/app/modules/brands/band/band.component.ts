import { Component, OnInit } from "@angular/core";
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { Band } from "../../../services/band/band.model";
import { BandService } from "../../../services/band/band.service";
import { debounceTime, filter, Subject, takeUntil } from 'rxjs';
import { AbstractControl, UntypedFormControl, ValidationErrors, ValidatorFn } from '@angular/forms';


@Component({
    templateUrl: './band.component.html',
    styleUrl: './band.component.css'
})
export class BandComponent implements OnInit
{
    public band: Band;

    /**
     * assert if is empty
     * @param control 
     * @returns 
     */
    protected sharedValidators = (control: AbstractControl): ValidationErrors | null =>
    {
        const formControl = control as UntypedFormControl;
        return formControl.value && formControl.value.trim().length !== 0 ? null : { empty: true };
    }

    bandForm = this._formBuilder.group({
        name: [null, [this.sharedValidators]],
        origin: [null, []],
        city: [null, []],
        startDate: [null, []],
        endDate: [null, []],
        founder: [null, []],
        totalMember: [0, []],
        genre: [null, []],
        description: [null, []],
    });

    public updated: any = {};

    private _unsubscribeAll: Subject<boolean> = new Subject<boolean>();

    constructor(
        private _formBuilder: UntypedFormBuilder,
        private _bandService: BandService
    ){}

    /**
     * recover the data from the resolver, fill the form with data, on fields change call updateBand
     */
    ngOnInit(): void {
        this._bandService.object$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data) => 
            {
                if(data instanceof Band){
                    this.band = data;
                }                
            })
        
        this.bandForm.patchValue({
            name: this.band.name,
            origin: this.band.origin,
            city: this.band.city,
            startDate: this.band.startDate,
            endDate: this.band.endDate,
            founder: this.band.founder,
            totalMember: this.band.totalMember,
            genre: this.band.genre,
            description: this.band.description,
        });

        Object.entries(this.bandForm.controls).forEach(([key, control]) => 
        {
            control.valueChanges.pipe(
                takeUntil(this._unsubscribeAll),
                filter(() => control.valid),
                debounceTime(500)
            ).subscribe(value => 
                {
                    const data: {[index: string]:any} = {};
                    if(['startDate', 'endDate'].includes(key) && value !== null){
                        const d = new Date(value);
                        value = d.getFullYear() + '/' + d.getMonth() + '/'+ d.getDate()
                    }
                    data[key] = value;
                    this.updateBand(data, key);
                })
        })
    }

    /**
     * check if an band is present and send only the updated data
     * @param data 
     * @param key 
     * @returns 
     */
    updateBand(data: {[index: string]:any} , key: string)
    {
        data[key] = !data[key] && typeof data[key] === "string" ? null : data[key];

        if(this.band?.id === undefined){
            return;
        }

        this._bandService.update(
            this.band.id,
            data,
        ).subscribe(() =>
        {
            this.updated[key] = true;

            setTimeout(() => delete this.updated[key], 3000);
        })
    }
}