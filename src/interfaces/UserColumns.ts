export default interface PersonColumn {
    id: "id" | "name" | "email" | "roles";
    label: string;
    minWidth?: number;
    align?: "left" |"right";
    component: any;
  }