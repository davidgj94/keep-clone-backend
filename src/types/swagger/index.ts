/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

export interface paths {
  "/notes/{noteId}": {
    put: operations["modifyNote"];
  };
  "/notes": {
    get: operations["getNotes"];
    post: operations["createNote"];
  };
  "/labels": {
    get: operations["getLabels"];
    post: operations["createLabel"];
  };
  "/labels/{labelId}": {
    put: operations["modifyLabel"];
  };
}

export interface definitions {
  Note: {
    _id?: string;
    title?: string;
    content?: string;
    labels?: string[];
    user?: string;
    archived?: boolean;
    binned?: boolean;
  };
  Label: {
    _id?: string;
    name?: string;
  };
  GetLabelsResponse: {
    data?: definitions["Label"][];
  };
  GetNotesResponse: {
    data?: definitions["Note"][];
    cursor?: string;
    hasMore?: boolean;
  };
}

export interface operations {
  modifyNote: {
    parameters: {
      path: {
        noteId: string;
      };
      body: {
        data: definitions["Note"];
      };
    };
    responses: {
      /** OK */
      200: {
        schema: definitions["Note"];
      };
      /** Bad request */
      400: unknown;
      /** Unauthorized */
      401: unknown;
      /** Not found */
      404: unknown;
    };
  };
  getNotes: {
    parameters: {
      query: {
        cursor?: string;
        limit?: number;
        labelId?: string;
      };
    };
    responses: {
      /** OK */
      200: {
        schema: definitions["GetNotesResponse"];
      };
      /** Bad request */
      400: unknown;
      /** Unauthorized */
      401: unknown;
      /** Not found */
      404: unknown;
    };
  };
  createNote: {
    parameters: {
      body: {
        data: definitions["Note"];
      };
    };
    responses: {
      /** OK */
      200: {
        schema: definitions["Note"];
      };
      /** Bad request */
      400: unknown;
      /** Unauthorized */
      401: unknown;
      /** Not found */
      404: unknown;
    };
  };
  getLabels: {
    responses: {
      /** OK */
      200: {
        schema: definitions["GetLabelsResponse"];
      };
      /** Bad request */
      400: unknown;
      /** Unauthorized */
      401: unknown;
      /** Not found */
      404: unknown;
    };
  };
  createLabel: {
    parameters: {
      body: {
        data: definitions["Label"];
      };
    };
    responses: {
      /** OK */
      200: {
        schema: definitions["Label"];
      };
      /** Bad request */
      400: unknown;
      /** Unauthorized */
      401: unknown;
      /** Not found */
      404: unknown;
    };
  };
  modifyLabel: {
    parameters: {
      path: {
        labelId: string;
      };
      body: {
        data: definitions["Label"];
      };
    };
    responses: {
      /** OK */
      200: {
        schema: definitions["Label"];
      };
      /** Bad request */
      400: unknown;
      /** Unauthorized */
      401: unknown;
      /** Not found */
      404: unknown;
    };
  };
}

export interface external {}
