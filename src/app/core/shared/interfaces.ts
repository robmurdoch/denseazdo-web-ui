
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
    /**
     * Whether this is the currently selected connections
     */
    selected?: boolean;
    /**
     * Arbitraty value that distinguishes the Azure DevOps (TFS) server instance from other instances
     */
    instanceName?: string;
}

/**
 * Contains information displayed that describes a problem, warning, or informaion found during analysis
 */
export interface Finding {
    /**
     * Rule analyzed
     */
    rule:Rule;
    /**
     * Value that was not expected by the rule
     */
    value?:string;
    /**
     * Identifier that was not expected by the rule
     */
    id?:string;
}

/**
 * Contains a rule analyzed by the applications
 */
export interface Rule {

    /**
     * Name of the rule
     */
    name:string;
    /**
     * Detail
     */
    detail:string;
    /**
     * Description
     */
    description:string;
}