import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
      <path d="M12 18c-4.418 0-8-2.686-8-6s3.582-6 8-6 8 2.686 8 6-3.582 6-8 6z" fill="currentColor" fillOpacity="0.3"/>
      <path d="M12 12l-2-2.5 4 0 -2 2.5z" />
      <path d="M12 12l-2 2.5 4 0 -2-2.5z" />
    </svg>
  );
}
