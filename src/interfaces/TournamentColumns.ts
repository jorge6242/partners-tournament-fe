export default interface Columns {
    id: "id" | "description" | "max_participants" | "status";
    label: string;
    minWidth?: number;
    align?: "left" | "right";
    component?: any;
  }
  