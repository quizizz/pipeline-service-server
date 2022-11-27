export type PipelineSchema = {
  namespace: string;
  schemaVersion: string;
  name: string;
  version: string;
  resources: [{ name: string; version: string }];
  config: string;
  input: string;
  steps: [
    [
      {
        name: string;
        version: string;
        key: (
          pipelineExecution: Record<string, unknown>,
        ) => Record<string, unknown>;
        input: {
          map: (result: Record<string, unknown>) => Record<string, unknown>;
        };
        output: {
          map: (result: Record<string, unknown>) => Record<string, unknown>;
        };
      },
    ],
  ];
  createdAt: Date;
};

export type PipelineExecutionSchema = {
  id: string;
  config: {
    resources: [];
  };
  steps: Record<
    string,
    {
      result: Record<string, unknown>;
    }
  >;
  startedBy: string;
  pipelineName: string;
  pipelineVersion: string;
  status: string;
  startedAt: Date;
  stoppedAt: Date;
};
