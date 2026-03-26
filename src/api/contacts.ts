import { apiClient } from "./apiClient";

export interface Contact {
    _id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    createdAt: string;
    __v: number;
}

export const getContacts = async (): Promise<Contact[]> => {
    return apiClient<Contact[]>("/api/admin/contacts");
};
