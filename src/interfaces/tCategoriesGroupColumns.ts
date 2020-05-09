export default interface Columns {
  id:
    | "id"
    | "description"
    | "age_from"
    | "age_to"
    | "golf_handicap_from"
    | "golf_handicap_to"
    | "gender"
    | "category";
  label: string;
  minWidth?: number;
  align?: "left" | "right";
  component?: any;
}
