export type ResultType = {
  error?: string;
  correct?: boolean;
  performant?: boolean;
  usersTime?: number;
  referenceTime?: number;
  usersSet?: Record<string, any>[];
  referenceSet?: Record<string, any>[];
  usersPlan?: Record<string, any>;
};

export interface EvaluateRequestBody {
  preparationQuery: string;
  selectQuery: string;
}

export interface EvaluateResponseBody extends ResultType {} 