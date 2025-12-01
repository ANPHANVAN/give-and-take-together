import * as React from 'react';
import { cn } from '@/lib/utils';

// Heading 1
export function TypographyH1({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h1
      className={cn(
        'scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance lg:text-5xl',
        className
      )}
      {...props}
    />
  );
}

// Heading 2
export function TypographyH2({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn('scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0', className)}
      {...props}
    />
  );
}

// Heading 3
export function TypographyH3({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn('scroll-m-20 text-2xl font-semibold tracking-tight', className)} {...props} />;
}

// Heading 4
export function TypographyH4({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h4 className={cn('scroll-m-20 text-xl font-semibold tracking-tight', className)} {...props} />;
}

// Paragraph
export function TypographyP({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('leading-7 [&:not(:first-child)]:mt-6', className)} {...props} />;
}

// Blockquote
export function TypographyBlockquote({ className, ...props }: React.HTMLAttributes<HTMLQuoteElement>) {
  return <blockquote className={cn('mt-6 border-l-2 pl-6 italic', className)} {...props} />;
}

// List
/**
 * children should be li elements
 * @param param0 className
 * @returns ul element with list styles
 * "my-6 ml-6 list-disc [&>li]:mt-2"
 */
export function TypographyList({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) {
  return <ul className={cn('my-6 ml-6 list-disc [&>li]:mt-2', className)} {...props} />;
}

// Lead text
export function TypographyLead({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('text-xl text-muted-foreground', className)} {...props} />;
}

// Large text
export function TypographyLarge({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('text-lg font-semibold', className)} {...props} />;
}

// Small text
export function TypographySmall({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return <small className={cn('text-sm font-medium leading-none', className)} {...props} />;
}

// Muted text
export function TypographyMuted({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('text-sm text-muted-foreground', className)} {...props} />;
}
