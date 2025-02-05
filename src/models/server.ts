import express from 'express';
import generalRoute from '../routes/generalRoutes';

export class Server{
    private _app;
    private _port;
    private ApiRoutes = {
        general: "/general",
    }
    constructor(){
        this._app = express();
        this._port = 8000;
        this.routes();
    }

    listen(){
        this._app.listen( this._port,  () => {
            console.log( `Server escuchando en puerto ${ this._port }`);
        })
    }

    routes(){
        this._app.use( this.ApiRoutes.general, generalRoute );
    }
}