import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm flex-wrap">
      <Link 
        href="/" 
        className="flex items-center space-x-1 px-1.5 sm:px-2 py-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-all duration-200 flex-shrink-0"
      >
        <Home className="h-3 w-3 sm:h-4 sm:w-4" />
        <span className="font-medium hidden sm:inline">Главная</span>
        <span className="font-medium sm:hidden">Гл</span>
      </Link>
      
      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
          <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 text-slate-400 dark:text-slate-500" />
          {item.href ? (
            <Link 
              href={item.href}
              className="px-1.5 sm:px-2 py-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-all duration-200 font-medium truncate max-w-20 sm:max-w-32"
            >
              {item.label}
            </Link>
          ) : (
            <span className="px-1.5 sm:px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-semibold truncate max-w-24 sm:max-w-40">
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}