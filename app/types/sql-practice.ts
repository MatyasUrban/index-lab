export type ResultType = {
  error?: string;
  correct?: boolean;
  performant?: boolean;
  usersTime?: number;
  referenceTime?: number;
  usersSet?: any[];
  referenceSet?: any[];
  usersPlan?: string;
};

export interface EvaluateRequestBody {
  preparationQuery: string;
  selectQuery: string;
}

export interface EvaluateResponseBody extends ResultType {} 