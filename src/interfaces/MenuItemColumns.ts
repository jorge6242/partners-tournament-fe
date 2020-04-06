export default interface Columns {
  id: "id" | "name" | "slug" | "description" | "route";
  label: string;
  minWidth?: number;
  align?: "left" | "right";
  component?: any;
}
