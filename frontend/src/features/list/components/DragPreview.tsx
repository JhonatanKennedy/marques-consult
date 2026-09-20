import {
  ItemCard,
  type ItemCardProps,
} from '@/features/list/components/ItemCard/ItemCard';

type DragPreviewProps = {
  card: Omit<ItemCardProps, 'handleProps'> | null;
};

export function DragPreview({ card }: DragPreviewProps) {
  if (!card) return null;
  return <ItemCard {...card} handleProps={null} />;
}
