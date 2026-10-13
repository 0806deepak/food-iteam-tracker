import React from 'react';
import { getExpiryStatus } from '../../lib/inventoryFilters';
import { Clock, AlertTriangle, AlertCircle, CheckCircle2 } from 'lucide-react';

interface ExpiryBadgeProps {
  expiryDate: string;
  className?: string;
  showIcon?: boolean;
}

export const ExpiryBadge: React.FC<ExpiryBadgeProps> = ({
  expiryDate,
  className = '',
  showIcon = true,
}) => {
  const info = getExpiryStatus(expiryDate);

  const renderIcon = () => {
    if (!showIcon) return null;
    switch (info.status) {
      case 'expired':
        return <AlertCircle className="w-3.5 h-3.5 mr-1 flex-shrink-0" />;
      case 'critical':
        return <AlertTriangle className="w-3.5 h-3.5 mr-1 flex-shrink-0 animate-bounce" />;
      case 'warning':
        return <Clock className="w-3.5 h-3.5 mr-1 flex-shrink-0" />;
      case 'fresh':
      default:
        return <CheckCircle2 className="w-3.5 h-3.5 mr-1 flex-shrink-0" />;
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border transition-colors ${info.badgeClass} ${className}`}
      title={`Expiry Date: ${expiryDate}`}
    >
      {renderIcon()}
      <span>{info.label}</span>
    </span>
  );
};
