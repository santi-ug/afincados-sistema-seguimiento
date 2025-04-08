import { cn } from '@/lib/utils';
import React from 'react';

interface MainProps extends React.HTMLAttributes<HTMLElement> {
	fixed?: boolean;
}

export const Main = React.forwardRef<HTMLElement, MainProps>(
	({ fixed, className, ...props }, ref) => {
		return (
			<main
				ref={ref}
				className={cn(
					'flex flex-1 min-w-0 w-full flex-col px-4 py-6', // 💥 ADD min-w-0 !!!
					fixed && 'fixed-main overflow-hidden',
					className
				)}
				{...props}
			/>
		);
	}
);

Main.displayName = 'Main';
