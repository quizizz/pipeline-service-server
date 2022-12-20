export type ApiSchema = {
  schemaDefinitionVersion: string;
  name: string;
  version: number;
  data: {
    functionName: string;
    type: string;
    owner: {
      service: string;
    };
    method: string;
  };
  createdAt: number;
};
