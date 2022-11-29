export type ApiSchema = {
  schemaDefinitionVersion: string;
  name: string;
  type: string;
  owner: {
    email: string;
  };
  retry: {
    count: number;
    delay: number;
  };
};
