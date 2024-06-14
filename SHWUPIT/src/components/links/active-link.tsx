import type { LinkProps } from 'next/link';
import { useRouter } from 'next/router';
import AnchorLink from '@/components/links/anchor-link';
import classNames from 'classnames';

interface ActiveLinkProps extends LinkProps {
  activeClassName?: string;
  children?: React.ReactNode;
}

const ActiveLink: React.FC<
  ActiveLinkProps & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>
> = ({ href, className, activeClassName = 'active', children, ...props }) => {
  const { asPath } = useRouter();
  const isActive = asPath === href || asPath.startsWith(href as string);
  
  return (
    <AnchorLink
      href={href}
      className={classNames(className, { [activeClassName]: isActive })}
      {...props}
    >
      {children}
    </AnchorLink>
  );
};

export default ActiveLink;