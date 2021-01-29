
/**
 * Contains information describing a connection.
 */
export class ConnectionInfo {

    constructor(url: string, token: string){
        this.url = url
        this.token = token
    }
    /**
     * The url
     */
    url: string;
    /**
     * The token
     */
    token: string;
    /**
     * The Version of AzDO at the other end of the ur
     */
    apiVersion?: string;
}