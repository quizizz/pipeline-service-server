export type StepSchema = {
  schemaDefinitionVersion: string;
  name: string;
  version: string;
  key: string;
  api: {
    name: string;
  };
  input: {
    map: string;
  };
  output: string;
  reusable: boolean;
  createdAt: Date;
};
