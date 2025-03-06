export type ResultType = {
  error?: string;
  correct?: boolean;
  performant?: boolean;
  usersTime?: number;
  referenceTime?: number;
  usersRows?: Record<string, any>[];
  referenceRows?: Record<string, any>[];
  usersPlan?: string;
};

export interface EvaluateRequestBody {
  preparationQuery: string;
  selectQuery: string;
}

export interface EvaluateResponseBody extends ResultType {} 