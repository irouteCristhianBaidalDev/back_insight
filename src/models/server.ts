import express, { Application } from 'express';
import generalRoute from '../routes/generalRoutes';

export class Server{
    private _app: Application;
    private _port: number;
    private ApiRoutes: Record<string, string> = {
        general: "/general",
    }
    constructor(){
        this._app = express();
        this._port = 8000;
        this.middleWares();
        this.routes();
    }

    listen(){
        this._app.listen( this._port,  () => {
            console.log( `Server escuchando en puerto ${ this._port }`);
        });
    }

    middleWares(){
        this._app.use(express.json());
    }

    routes(){
        this._app.use( this.ApiRoutes.general, generalRoute );
    }
}