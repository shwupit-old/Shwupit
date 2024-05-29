import React from 'react';
import cn from 'classnames';
import Image from 'next/image';
import { twMerge } from 'tailwind-merge';

const classes = {
  base: 'inline-flex items-center justify-center flex-shrink-0 border text-accent border-border-100 bg-accent/10 overflow-hidden relative',
  size: {
    sm: '32px',
    DEFAULT: '40px',
    lg: '48px',
    xl: '56px',
  },
  fontSize: {
    sm: 'text-xs',
    DEFAULT: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg',
  },
  rounded: {
    none: 'rounded-none',
    sm: 'rounded',
    md: 'rounded-xl',
    lg: 'rounded-2xl',
    full: 'rounded-full',
  },
};

type AvatarProps = {
  src?: string;
  firstName: string;
  lastName: string;
  size?: keyof typeof classes.size;
  customSize?: string;
  rounded?: keyof typeof classes.rounded;
  onClick?: () => void;
  className?: string;
};

const CHECK_VALID_CUSTOM_SIZE = /(\d*px)?/g;

function getInitials(firstName: string, lastName: string) {
  if (!firstName && !lastName) return 'GU';
  const firstInitial = firstName ? firstName[0] : '';
  const lastInitial = lastName ? lastName[0] : '';
  return (firstInitial + lastInitial).toUpperCase();
}

const Avatar: React.FC<AvatarProps> = ({
  src,
  firstName,
  lastName,
  size = 'DEFAULT',
  customSize,
  rounded = 'full',
  onClick,
  className,
  ...rest
}) => {
  const [isError, setError] = React.useState(false);

  // checking customSize value
  if (customSize?.match(CHECK_VALID_CUSTOM_SIZE)) {
    const checkedCustomSizeValue =
      customSize?.match(CHECK_VALID_CUSTOM_SIZE) ?? [];
    if (checkedCustomSizeValue[0] === '') {
      console.warn(
        'customSize prop value is not valid. Please set customSize prop like -> customSize="50px"',
      );
    }
  }

  if (src && !isError) {
    return (
      <div
        className={twMerge(
          cn(
            classes.base,
            classes.rounded[rounded],
            onClick && 'cursor-pointer',
            className,
          ),
        )}
        style={{
          width: customSize ?? classes.size[size],
          height: customSize ?? classes.size[size],
        }}
        onClick={onClick}
        {...rest}
      >
        <Image
          alt={`${firstName} ${lastName}`}
          src={src}
          fill
          priority={true}
          sizes="(max-width: 768px) 100vw"
          onError={() => setError(() => true)}
        />
      </div>
    );
  }
  return (
    <span
      title={`${firstName} ${lastName}`}
      className={twMerge(
        cn(
          classes.base,
          classes.fontSize[size],
          classes.rounded[rounded],
          'font-semibold',
          onClick && 'cursor-pointer',
          className,
        ),
      )}
      style={{
        width: customSize ?? classes.size[size],
        height: customSize ?? classes.size[size],
      }}
      onClick={onClick}
    >
      {getInitials(firstName, lastName)}
    </span>
  );
};

export default Avatar;