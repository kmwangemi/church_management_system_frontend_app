import type { NextApiResponse } from 'next';

// Utility class for response handling
export class ApiResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data?: any;

  constructor() {
    this.success = false;
    this.message = '';
    this.statusCode = 500;
  }

  setSuccess(message: string, statusCode: number, data?: any) {
    this.success = true;
    this.message = message;
    this.statusCode = statusCode;
    this.data = data;
  }

  setError(message: string, statusCode: number) {
    this.success = false;
    this.message = message;
    this.statusCode = statusCode;
  }

  send(res: NextApiResponse) {
    res.status(this.statusCode).json({
      success: this.success,
      message: this.message,
      data: this.data,
    });
  }
}
