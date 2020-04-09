export default interface Columns {
    id: "id" | "description" | "image" | "status";
    label: string;
    minWidth?: number;
    align?: "left" | "right";
    component?: any;
  }
  