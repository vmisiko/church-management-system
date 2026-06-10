export interface MessageTemplate {
  id: string
  name: string
  body: string
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface CreateMessageTemplateRequest {
  name: string
  body: string
}
