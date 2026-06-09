export interface Message {
  id: string;
  sender: "bot" | "user" | "system";
  text: string;
  type?: "text" | "result_card" | "support_card";
}

export interface ApiResponse {
  reply: string;
  extractedData?: {
    service?: string;
    location?: string;
    status: "SUCCESS" | "FALLBACK" | "CONTINUE";
  };
}
