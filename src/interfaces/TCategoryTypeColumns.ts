export default interface Columns {
    id: "id" | "description" | "slug" | "status" | "type";
    label: string;
    minWidth?: number;
    align?: "left" | "right";
    component?: any;
  }
  