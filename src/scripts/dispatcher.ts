import * as Bacon from "baconjs";

interface IBusCache {
    [index: string]: Bacon.Bus<any, any>;
}

export class Dispatcher {
    private busCache: IBusCache;
    constructor() {
        this.busCache = {};
    }

    public stream(name: string): Bacon.Bus<any, any> {
        return this.bus(name);
    }

    public push(name: string, value: any): void {
        this.bus(name).push(value);
    }

    public plug(name: string, value: Bacon.EventStream<any, any>): void {
        this.bus(name).plug(value);
    }

    public bus(name: string): Bacon.Bus<any, any> {
        return this.busCache[name] = this.busCache[name] || new Bacon.Bus();
    }
}
