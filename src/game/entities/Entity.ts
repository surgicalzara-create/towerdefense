export abstract class Entity {
    public x: number;
    public y: number;
    public id: string;

    constructor(
        x: number,
        y: number,
        id: string = crypto.randomUUID()
    ) {
        this.x = x;
        this.y = y;
        this.id = id;
    }
}
