import { DocumentReference } from "firebase/firestore";

export interface AuditData {
    created_at: number;
    updated_at: number;
    created_by: DocumentReference | null;
    updated_by: DocumentReference | null;
}