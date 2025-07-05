import React from 'react';

const ActionCard = ({ 
  title, 
  description, 
  icon, 
  color = 'blue', 
  buttonText = 'Acessar',
  onClick,
  disabled = false 
}) => {
  const colorClasses = {
    blue: {
      bg: 'bg-blue-50',
      icon: 'text-blue-600',
      button: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
    },
    green: {
      bg: 'bg-green-50',
      icon: 'text-green-600',
      button: 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
    },
    purple: {
      bg: 'bg-purple-50',
      icon: 'text-purple-600',
      button: 'bg-purple-600 hover:bg-purple-700 focus:ring-purple-500'
    },
    orange: {
      bg: 'bg-orange-50',
      icon: 'text-orange-600',
      button: 'bg-orange-600 hover:bg-orange-700 focus:ring-orange-500'
    }
  };

  const colors = colorClasses[color] || colorClasses.blue;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start space-x-4">
        {icon && (
          <div className={`h-12 w-12 rounded-lg ${colors.bg} flex items-center justify-center flex-shrink-0`}>
            <div className={colors.icon}>
              {icon}
            </div>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
          <p className="text-sm text-gray-600 mb-4">{description}</p>
          <button
            onClick={onClick}
            disabled={disabled}
            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white ${colors.button} focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200`}
          >
            {buttonText}
            <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActionCard;

