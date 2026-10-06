import { Children, isValidElement, cloneElement, type ReactElement, type ReactNode, type CSSProperties } from 'react';

/*
  Cascades children in one after another (see .stagger in globals.css).
  Each direct child gets --i for its delay.
*/
export default function Stagger({
  children,
  className = '',
  as: Tag = 'div',
}: {
  children: ReactNode;
  className?: string;
  as?: 'div' | 'ul' | 'ol' | 'section';
}) {
  let i = 0;
  return (
    <Tag className={`stagger ${className}`}>
      {Children.map(children, (child) => {
        if (!isValidElement(child)) return child;
        const el = child as ReactElement<{ style?: CSSProperties }>;
        return cloneElement(el, {
          style: { ...el.props.style, '--i': i++ } as CSSProperties,
        });
      })}
    </Tag>
  );
}
