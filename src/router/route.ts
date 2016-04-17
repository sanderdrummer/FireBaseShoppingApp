class Route {
    url: string;
    title: string;
    callback: any;


    constructor( url: string, callback) {
        this.url = url;
        this.callback = callback;
    }
}

export = Route;
