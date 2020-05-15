export default interface Columns {
    id: "id" | "description" | "info" | "status" | "currency";
    label: string;
    minWidth?: number;
    align?: "left" | "right";
    component?: any;
  }
  