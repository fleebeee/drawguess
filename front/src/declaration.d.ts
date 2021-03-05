declare var __DEBUG__: boolean;

declare module '*.png' {
  const value: string;
  export default value;
}

interface Message {
  type: string;
  payload: any;
}

interface ApiError {
  type: string;
  string: string;
}
