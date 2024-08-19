import { ComponentPropsWithRef } from 'react';

type PropType = ComponentPropsWithRef<'button'>;

export const CarouselDotButton = (props: PropType) => {
  const { children, ...restProps } = props;

  return (
    <button type="button" {...restProps}>
      {children}
    </button>
  );
};
