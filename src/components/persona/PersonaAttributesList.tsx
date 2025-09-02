import { formatPersonaAttribute } from '@/utils/formatPersonaAttributes';

interface PersonaAttributesListProps {
  attributes: string[] | undefined;
  title: string;
  emptyMessage?: string;
}

export function PersonaAttributesList({ attributes, title, emptyMessage = `No ${title.toLowerCase()} specified` }: PersonaAttributesListProps) {
  if (!attributes || attributes.length === 0) {
    return (
      <div>
        <label className="text-sm font-medium text-muted-foreground mb-2 block">{title}</label>
        <p className="text-sm text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div>
      <label className="text-sm font-medium text-muted-foreground mb-2 block">{title}</label>
      <div className="space-y-2">
        {attributes.map((attribute, index) => (
          <div key={index} className="text-sm text-foreground">
            • {formatPersonaAttribute(attribute)}
          </div>
        ))}
      </div>
    </div>
  );
}
