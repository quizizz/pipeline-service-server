export type ApiSchema = {
  schemaDefinitionVersion: string;
  name: string;
  type: string;
  method: string;
  url: string;
  owner: {
    email: string;
  };
  retry: {
    count: number;
    delay: number;
  };
};
