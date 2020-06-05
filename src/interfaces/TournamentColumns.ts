export default interface Columns {
  id:
    | "id"
    | "description"
    | "max_participants"
    | "status"
    | "category"
    | "date_from"
    | "date_to"
    | "date_register_from"
    | "date_register_to"
    | "participant_type"
    | "currency"
    | "booking_type"
    | "amount";
  label: string;
  minWidth?: number;
  align?: "left" | "right";
  component?: any;
}
