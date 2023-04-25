export interface ResponseType {
  statusCode: string;
  code: string;
  message: string | object;
  service?: string;
  meta?: any[];
  data?: [];
}
