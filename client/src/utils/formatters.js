export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

export const getDeadlineStatus = (deadlineString) => {
  if (!deadlineString) return { text: 'No deadline', color: 'text-slate-400', bg: 'bg-slate-500/10', icon: '⏳' };
  
  const now = new Date();
  const deadline = new Date(deadlineString);
  const diffTime = deadline - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return {
      text: `${Math.abs(diffDays)}d overdue`,
      color: 'text-rose-400',
      bg: 'bg-rose-500/15 border-rose-500/30',
      icon: '🔴',
    };
  } else if (diffDays === 0) {
    return {
      text: 'Due Today',
      color: 'text-amber-400',
      bg: 'bg-amber-500/15 border-amber-500/30',
      icon: '🟡',
    };
  } else if (diffDays === 1) {
    return {
      text: 'Due Tomorrow',
      color: 'text-amber-400',
      bg: 'bg-amber-500/15 border-amber-500/30',
      icon: '🟡',
    };
  } else if (diffDays <= 5) {
    return {
      text: `${diffDays} days left`,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/15 border-cyan-500/30',
      icon: '🟢',
    };
  } else {
    return {
      text: `${diffDays} days left`,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/15 border-emerald-500/30',
      icon: '🟢',
    };
  }
};
