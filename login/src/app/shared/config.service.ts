import { Injectable } from "@angular/core";

// @Injectable()
export class ConfigService {
    paths = {
        api: 'http://localhost:5000/api/'
    };
    constructor(){}
    getLoginApi() {
        return this.paths.api+'login'
    }
}