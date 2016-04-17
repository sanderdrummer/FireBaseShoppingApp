import Route = require('./route');
import Param = require('./param');

class Router {

    routes: Route[];
    findParam: RegExp;

    constructor(){
        this.routes = [];
        this.findParam = new RegExp(':[a-zA-Z]*');

        // Adds global eventlistener for routing on hashchange
        window.addEventListener('hashchange', () => {
            this.handleHashChange();
        });

        // Special case load handle Hashchange on startup
        document.addEventListener("DOMContentLoaded", () => { 
            this.handleHashChange();
        });
    }


    /**
     * Parse hash and url and check for matching
     * 
     * @param  {string}   hash
     * @param  {Route}   route
     * 
     * @return {void}
     */
    parseRouteUrl(hash: string, route: Route) {

        var result = this.getMatchAndParamsOf(hash, route.url);

        if (result.doesMatch) {

            route.callback(new Param(result.params));
        }
    }


    /**
     * Checks if route matches hash 
     * and parses params from hash
     * 
     * @param  {string}   hash 
     * @param  {string}   url  
     * @return {Object}        
     */
    getMatchAndParamsOf(hash:string , url:string ) {
        
        var urlParts = url.split('/');
        var hashParts = hash.split('/');
        var doesMatch = false;
        var params = {};
        var allMatches = [];
        var key;
        
        // do both hash and url have the same size ?
        // -> could match  
        if (urlParts.length === hashParts.length) {
            
            // check all parts of given hash for matching if 
            // a part is indentified to be a param it is ignored 
            // for matching but saved into params Object
            hashParts.map((item, index) => {
                
                if (item === urlParts[index]) {

                    allMatches.push(true);
                    
                } else if(this.findParam.test(urlParts[index])) {
                    
                    // replace : indicator of param key
                    key = urlParts[index].replace(':', '');
                    params[key] = item
                    
                } else {
                    allMatches.push(false);
                }
            });
            
            // reduce all matchings to one boolean
            doesMatch = allMatches.reduce((a,b) =>{
                return a && b;
            });
                    
        }
        
        // return doesMatch flag and parsed params
        return {
            params: params,
            doesMatch: doesMatch
        }
        
    }

    /**
     */
    handleHashChange(){
        const hash =  window.location.hash.replace('#', '');
        this.routes.forEach( (route) => {    
            this.parseRouteUrl(hash, route);
        });
    }

    register(url: string, callback) {
        this.routes.push(new Route(url, callback));
        return this;
    }
}

// exports public api to register new route
export = Router
