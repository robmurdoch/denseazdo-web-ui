
/**
 * Contains information describing a connection.
 */
export interface ConnectionInfo {
    /**
     * The url
     */
    url: string;
    /**
     * The token
     */
    token?: string;
    /**
     * The Version of AzDO at the other end of the ur
     */
    apiVersion?: string;
}