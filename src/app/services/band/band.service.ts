import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, catchError, of, map, tap, switchMap, take } from "rxjs";
import { apiUrl } from "../../config/api.config";
import { Band } from "./band.model";
import { IBand } from "./band.type";

@Injectable({
    providedIn: 'root'
})
export class BandService
{
    private _ressource = "bands";

    private _band: BehaviorSubject<Band | null>;
    private _bands: BehaviorSubject<Band[] | null>;

    constructor(private _httpClient: HttpClient)
    {
        this._band = new BehaviorSubject<Band | null>(null);
        this._bands = new BehaviorSubject<Band[] | null>(null);
    }

    // Observables 

    get object$(): Observable<Band | null>
    {
        return this._band.asObservable();
    }

    get objects$(): Observable<Band[] | null>
    {
        return this._bands.asObservable();
    }

    // Getter et setter

    get object(): Band | null
    {
        return this._band.value;
    }

    set object(object: Band | null)
    {
        this._band.next(object);
    }
    
    
    get objects(): Band[] | null
    {
        return this._bands.value;
    }

    set objects(objects: Band[] | null)
    {
        this._bands.next(objects);
    }

    /**
     * create a band 
     * @param data 
     * @returns 
     */
    protected _new(data: IBand): Band
    {
        return new Band(data);
    }

    /**
     * send a request to the api to get all the bands
     */
    getAll(): Observable<Band[] | HttpErrorResponse>
    {
        return this._httpClient.get<Band[]>(
            apiUrl +this._ressource,
        ).pipe(
            catchError((errorResponse) => of(errorResponse)),
            map(response => {
                if (response instanceof HttpErrorResponse) {
                    return response;
                }

                return response.map((item: object) => this._new(item));
            }),
        );
    }

    /**
     * send a reqeust to the api to get a specific band
     * @param id 
     * @returns 
     */
    get(id: number): Observable<Band | HttpErrorResponse>
    {
        return this._httpClient.get<Band>(
            apiUrl + this._ressource + '/' + id,
        ).pipe(
            catchError((errorResponse) => of (errorResponse)),
            map(response => {
                if (response.error) {
                    return response;
                }

                this.object = this._new(response);
            })
        );
    }

    /**
     * send a request too the api to create band
     * @param object 
     * @returns 
     */
    create(object: Band): Observable<Band | HttpErrorResponse>
    {
        return this.objects$.pipe(
            take(1),
            switchMap(
                objects => this._httpClient.post<Band>(
                    apiUrl + this._ressource,
                    this._formatBand(object)
                ).pipe(
                    catchError((errorResponse) => of (errorResponse)),
                    map(response => {
                        if (response instanceof HttpErrorResponse) {
                            return response;
                        }
                        
                        if (objects) {
                            this.objects = [this._new(response), ...objects]
                        }
    
                        return this._new(response);
                    })
                )
            )
        )
    }

    /**
     * send a request to the api to update the given band with the updated data.
     * @param id 
     * @param object 
     * @returns 
     */
    update(id:number, object: Band): Observable<Band | HttpErrorResponse>
    {
        return this.objects$.pipe(
            take(1),
            switchMap(
                objects => this._httpClient.put<Band>(
                    apiUrl + this._ressource + '/' + id,
                    this._formatBand(object)
                ).pipe(
                    catchError((errorResponse) => of (errorResponse)),
                    map(response => {
                        if (response instanceof HttpErrorResponse) {
                            return response;
                        }
                        
                        if (objects) {
                            const index = objects.findIndex(item => item['id'] === id);
                            objects[index] = this._new(response);
                            this.objects = objects;
                        }

                        if(this.object) {
                            this.object = this._new(response);
                        }
    
                        return this._new(response);
                    })
                )
            )
        )
    }

    /**
     * send a request to the api to delete the given band.
     * @param id 
     * @returns 
     */
    delete(id:number): Observable<boolean | HttpErrorResponse>
    {
        return this.objects$.pipe(
            take(1),
            switchMap(
                objects => this._httpClient.delete(
                    apiUrl + this._ressource + '/' + id
                ).pipe(
                    catchError((errorResponse) => of (errorResponse)),
                    map(response => {
                        if (response instanceof HttpErrorResponse) {
                            return response;
                        }
                        
                        if (objects) {
                            const index = objects.findIndex(item => item['id'] === id);
                            objects.splice(index, 1);
                            this.objects = objects;
                        }
                        this.object = null;
    
                        return true;
                    })
                )
            )
        )
    }

    /**
     * send a request to the api with the file in the body.
     * @param formData 
     * @returns 
     */
    importFromFile(formData: FormData): Observable<Band[] | HttpErrorResponse>
    {
        return this._httpClient.post<Band[]>(
            apiUrl + this._ressource + '/import/xlsx',
            formData
        ).pipe(
            catchError((errorResponse) => of (errorResponse)),
            map(response => {
                if (response instanceof HttpErrorResponse) {
                    return response;
                }

                return response.map((item: object) => this._new(item));
            }),
        );
    }

    /**
     * format request body.
     * @param band 
     * @returns 
     */
    private _formatBand(band: {[index: string]:any} ): object
    {
        const json: {[index: string]:any} = {};

        Object.keys(band).forEach((key) => 
        {
            if(band[key] === undefined) {
                return;
            }

            json[key] = band[key];
        })

        return json;
    }
}