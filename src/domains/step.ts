export type StepSchema = {
  schemaDefinitionVersion: string;
  name: string;
  version: number;
  data: {
    key: string;
    api: {
      name: string;
    };
    input: {
      map: string;
    };
    output: string;
    reusable: boolean;
  };
  createdAt: Date;
};
