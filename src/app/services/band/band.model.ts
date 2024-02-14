import { IBand } from "./band.type";

export class Band implements IBand
{
    id?: number;
    name?: string;
    origin?: string;
    city?: string;
    startDate?: Date;
    endDate?: Date;
    founder?: string;
    totalMember?: number;
    genre?: string;
    description?: string;

    constructor(band: IBand)
    {
        this.id = band.id;
        this.name = band.name;
        this.origin = band.origin;
        this.city = band.city;
        this.startDate = band.startDate;
        this.endDate = band.endDate;
        this.founder = band.founder;
        this.totalMember = band.totalMember;
        this.genre = band.genre;
        this.description = band.description;
        this.id = band.id;
    }
}