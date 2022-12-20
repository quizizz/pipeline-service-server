export type PipelineSchema = {
  namespace: string;
  schemaDefinitionVersion: string;
  name: string;
  version: number;
  data: {
    resources: [{ name: string; version: string }];
    config: string;
    input: string;
    steps: [
      [
        {
          name: string;
          version: number;
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
  };
  createdAt: Date;
};

export type PipelineExecutionSchema = {
  id: string;
  schemaDefinitionVersion: string;
  data: {
    stepOverrides: Record<
      string,
      {
        retry: Record<string, unknown>;
        reusability: Record<string, unknown>;
      }
    >;
    configOverrides: {
      resources: [];
    };
    meta: {
      pipelineServerVersion: string;
      pipelineWorkerVersion: string;
      pipelinesVersion: string;
      temporalWorkflowId: string;
      temporalRunId: string;
    };
    startedBy: string;
    pipelineNamespace: string;
    pipelineName: string;
    pipelineVersion: string;
    status: string;
  };
  startedAt: Date;
  stoppedAt: Date;
};
