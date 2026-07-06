import { Card } from './Card';

interface StatsCardProps {
  label: string;
  value: string | number;
  change: string;
  icon?: React.ReactNode;
}

export function StatsCard({ label, value, change, icon }: StatsCardProps) {
  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <span className="text-text-light text-xs">{label}</span>
          <h2 className="font-serif text-primary-700 text-[54px] font-semibold mt-2 leading-none">
            {value}
          </h2>
          <p className="text-text-mid text-sm mt-2">{change}</p>
        </div>
        {icon && <div className="text-primary-700 text-3xl opacity-50">{icon}</div>}
      </div>
    </Card>
  );
}