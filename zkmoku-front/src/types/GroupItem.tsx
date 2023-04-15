export interface GroupItem {
  name: string;
  content: string[];
  belongs: {
    key: string;
    name: string;
    value: string;
  }[],
  signature: string;
  h: string,
  pub: string,
}
