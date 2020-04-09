export default interface Columns {
    id: "id" | "description" | "slug" | "status";
    label: string;
    minWidth?: number;
    align?: "left" | "right";
    component?: any;
  }
  