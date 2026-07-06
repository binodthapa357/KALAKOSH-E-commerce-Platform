import { ReactNode, TableHTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from 'react';
import { cn } from '@/app/lib/utils';

// Main Table
interface TableProps extends TableHTMLAttributes<HTMLTableElement> {
  children: ReactNode;
  className?: string;
}

export function Table({ children, className, ...props }: TableProps) {
  return (
    <div className="w-full overflow-x-auto">
      <table
        className={cn(
          'w-full border-collapse text-sm',
          className
        )}
        {...props}
      >
        {children}
      </table>
    </div>
  );
}

// Table Header
interface TableHeadProps {
  children: ReactNode;
  className?: string;
}

export function TableHead({ children, className }: TableHeadProps) {
  return (
    <thead className={cn(
      'bg-[#F7F2EA] border-b border-border',
      className
    )}>
      {children}
    </thead>
  );
}

// Table Header Cell (th)
interface TableHeaderProps extends ThHTMLAttributes<HTMLTableCellElement> {
  children: ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right';
  width?: string;
}

export function TableHeader({ 
  children, 
  className, 
  align = 'left',
  width,
  ...props 
}: TableHeaderProps) {
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  return (
    <th
      className={cn(
        'px-4 py-3 text-xs font-semibold uppercase tracking-wider text-text-mid',
        alignClasses[align],
        className
      )}
      style={{ width }}
      {...props}
    >
      {children}
    </th>
  );
}

// Table Body
interface TableBodyProps {
  children: ReactNode;
  className?: string;
}

export function TableBody({ children, className }: TableBodyProps) {
  return (
    <tbody className={cn('bg-white', className)}>
      {children}
    </tbody>
  );
}

// Table Row
interface TableRowProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  striped?: boolean;
  index?: number;
}

export function TableRow({ 
  children, 
  className, 
  hover = true,
  striped = false,
  index = 0,
  ...props 
}: TableRowProps) {
  return (
    <tr
      className={cn(
        'border-b border-border/50 transition-colors',
        hover && 'hover:bg-primary-50/50',
        striped && index % 2 === 0 && 'bg-[#FAF8F5]',
        className
      )}
      {...props}
    >
      {children}
    </tr>
  );
}

// Table Cell (td)
interface TableCellProps extends TdHTMLAttributes<HTMLTableCellElement> {
  children: ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right';
  width?: string;
  bold?: boolean;
}

export function TableCell({ 
  children, 
  className, 
  align = 'left',
  width,
  bold = false,
  ...props 
}: TableCellProps) {
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  return (
    <td
      className={cn(
        'px-4 py-3.5 text-text-dark',
        bold && 'font-medium',
        alignClasses[align],
        className
      )}
      style={{ width }}
      {...props}
    >
      {children}
    </td>
  );
}

// Table Actions (for action buttons)
interface TableActionsProps {
  children: ReactNode;
  className?: string;
}

export function TableActions({ children, className }: TableActionsProps) {
  return (
    <div className={cn('flex items-center justify-end gap-2', className)}>
      {children}
    </div>
  );
}

// Table Empty State
interface TableEmptyProps {
  children?: ReactNode;
  icon?: ReactNode;
  title?: string;
  description?: string;
}

export function TableEmpty({ 
  children, 
  icon, 
  title = 'No data found',
  description = 'No records available' 
}: TableEmptyProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      {icon && <div className="text-4xl text-text-light mb-4">{icon}</div>}
      <p className="text-text-dark font-medium text-lg">{title}</p>
      <p className="text-text-light text-sm">{description}</p>
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}