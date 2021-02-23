/**
 * Contains information describing a project.
 */
export interface Collection<T> {
    /**
     * The number of items in the collection
     */
    count?: number;
    value?: T[];
}

/**
 * Contains information describing an API Version.
 */
export interface ApiVersion {
    /**
     * The number of items in the collection
     */
    name?: string;
    version?: string;
}

/**
 * Contains the top-level of an on-premise instance 
 * 
 * Artifact Package Types
 *  Maven
 *  Npm
 *  NuGet
 * Build
 *  Badge
 *  Controllers
 *  Resource Usgage
 * Core
 *  Processes
 *  Projects
 *  Teams
 * Extension Management
 *   Installed Extensions
 * Feeds
 *   Artifact Details
 *   Feed Management
 *   Recycle Bin
 *   Retention Policies
 *   Service Settings   
 * Notification
 *  Diagnostic Logs
 *  Diagnostics
 *  Event Types
 *  Events
 *  Settings
 *  Subscribers
 *  Subscriptions
 * Operations
 * Security
 *   Access Control Entities
 *   Access Control Lists
 *   Permissions
 *   Security Namespace
 * Service Endpoints
 *   Types
 * Service Hooks
 *   Consumers
 *   Diagnostics
 *   Notifications
 *   Publishers
 *   Subscriptions
 * Tasks Agent
 *   Agentclouds
 *   Agentcloudtypes
 *   Requests
 * Token Admin
 *   Personal Access Tokens
 *   Revocation Rules
 *   Revocations
 *  Work Item Tracking
 *   Artifact Link Types 
 *   Work Item Icons
 *   Work Item Relation Types
 *   Work Item Transitions
 *  Work Item Tracking Process
 *   Behaviors
 *   Controls
 *   Fields
 *   Groups
 *   Layout
 *   Lists
 *   Pages
 *   Processes
 *   Rules
 *   States
 *   Work Item Types
 *   Work Item Types Behaviors
 *  Work Item Tracking Process Template
 *   Behaviors
 *   Processes
 */
export interface CollectionInfo {
    /**
     * The number of items in the collection
     */
}

/**
 * Contains information describing a project.
 * Build
 *  Artifacts
 *  Attachments
 *  Authorizedresources
 *  Builds
 *   Definitions
 *   Folders
 *   Latest
 *   Metrics
 *   Options
 *   Properties
 *   Report
 *   Resources
 *   Settings
 *   Source Providers
 *   Status
 *   Tags
 *   Template
 *   Timeline
 * Dashboard
 *   Dashboards
 *   Widget Types
 *   Widgets
 * Git 
 *   Annotation Tags
 *   Blobs
 *   Cherry Picks
 *   Commits
 *      .....
 * Policy
 *   Configurations
 *   Evaluations
 *   Revisions
 *   Types
 * Release
 *   Approvals
 *   Attachments
 *   Definitions
 *   Deployments
 *   Dates
 *   Manual Interventions
 *   Releases
 * Search
 *   Code Search Results
 *   Wiki Search Results
 *   Work Item Search Results
 * Service Endpoints
 *   Endpointproxy
 *   Endpoint
 *   Executionhistory
 * Tasks Agent
 *   Deploymentgroups
 *   Targets
 *   Taskgroups
 *   Variablegroups
 * Test
 *   .....
 * Test Plan
 *   .....
 * Tfvc
 *   Branches
 *   Changesets
 *   Items
 *   Labels
 *   Shelvesets
 * Wiki
 *   Attachments
 *   Page Moves
 *   Pages
 *   Wikis
 *  Work
 *   .....
 *  Work Item Tracking
 *   Artifact Uri Query
 *   Attachments
 *   Classification Nodes
 *   Comments
 *   Fields
 *   Queries
 *   Recylebin
 *   Reporting Work Item Links
 *   Reporting Work Item Revisions
 *   Revisions
 *   Templates
 *   Updates
 *   Wiql
 *   Work Item Type Categories
 *   Work Item Type States
 *   Work Item Types
 *   Work Item Types Fiels
 *   Work Items
 */
export interface ProjectInfo {
    /**
     * The abbreviated name of the project.
     */
    abbreviation?: string;
    /**
     * The description of the project.
     */
    description?: string;
    /**
     * The id of the project.
     */
    id?: string;
    /**
     * The time that this project was last updated.
     */
    lastUpdateTime?: Date;
    /**
     * The name of the project.
     */
    name?: string;
    /**
     * A set of name-value pairs storing additional property data related to the project.
     */
    properties?: ProjectProperty[];
    /**
     * The current revision of the project.
     */
    revision?: number;
    /**
     * The current state of the project.
     */
    state?: any;
    /**
     * A Uri that can be used to refer to this project.
     */
    uri?: string;
    /**
     * The version number of the project.
     */
    version?: number;
    /**
     * Indicates whom the project is visible to.
     */
    // visibility?: ProjectVisibility;
}

export interface ProjectProperties {
    /**
     * The team project Id
     */
    projectId?: string;
    /**
     * The collection of team project properties
     */
    properties?: ProjectProperty[];
}

/**
 * A named value associated with a project.
 */
export interface ProjectProperty {
    /**
     * The name of the property.
     */
    name?: string;
    /**
     * The value of the property.
     */
    value?: any;
}

/**
 * Contains information a Security Namespace
 */
export interface SecurityNamespace {
    /**
     * The Actions supported by the namespace
     */
    actions: Action[];
    dataspaceCategory?: string;
    displayName?: string;
    elementLength?: number;
    extensionType?: string;
    isRemotable?: boolean;
    name?: string;
    namespaceId?: string;
    readPermission?: number;
    separatorValue?: string;
    structureValue?: number;
    systemBitMask?: number;
    useTokenTranslator?: boolean;
    writePermission?: number;
}

export interface Action {
    bit?: number;
    name?: string;
    displayName?: string;
    namespaceId?: string;
}

export interface IdentityPropertyData {
    SchemaClassName?: IdentityProperty;
    Description?: IdentityProperty;
    Domain?: IdentityProperty;
    Account?: IdentityProperty;
    SecurityGroup?: IdentityProperty;
    SpecialType?: IdentityProperty;
    ScopeId?: IdentityProperty;
    ScopeType?: IdentityProperty;
    LocalScopeId?: IdentityProperty;
    SecuringHostId?: IdentityProperty;
    ScopeName?: IdentityProperty;
    GlobalScope?: IdentityProperty;
    VirtualPlugin?: IdentityProperty;
}

export interface IdentityProperty {
    $type?: string;
    $value?: string;
}

export interface Identity {
    id?: number;
    descriptor?: string;
    subjectDescriptor?: string;
    providerDisplayName?: string;
    isActive?: boolean;
    isContainer?: boolean;
    members: string[];
    memberOf: string[];
    memberIds: string[];
    properties?: IdentityPropertyData;
    resourceVersion?: number;
    metaTypeId?: number;
}