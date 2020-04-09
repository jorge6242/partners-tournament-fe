export default interface Columns {
    id: "id" | "balance" | "balancer_date" | "is_suspended" | "is_active";
    label: string;
    minWidth?: number;
    align?: "left" | "right";
    component?: any;
  }
  