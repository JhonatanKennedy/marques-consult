export interface ListItemProps {
  id: string;
  name: string;
  description?: string;
  order: number;
}

export class ListItem {
  readonly id: string;
  readonly name: string;
  readonly description?: string;
  readonly order: number;

  constructor(props: ListItemProps) {
    this.id = props.id;
    this.name = props.name;
    this.description = props.description;
    this.order = props.order;
  }

  withOrder(order: number): ListItem {
    return new ListItem({ ...this, order });
  }

  withUpdatedData(name: string, description?: string): ListItem {
    return new ListItem({ ...this, name, description });
  }
}
