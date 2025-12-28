import { ReactNode } from 'react';

interface ConditionalRenderProps {
  /**
   * The current status value to check against
   */
  status: string | null | undefined;
  /**
   * Array of statuses to hide the component on
   * If the current status matches any of these, the component will be hidden
   */
  hideOn?: string[];
  /**
   * Array of statuses to show the component on
   * If provided, the component will only show when status matches one of these
   * This takes precedence over hideOn if both are provided
   */
  showOn?: string[];
  /**
   * The content to conditionally render
   */
  children: ReactNode;
  /**
   * Optional fallback content to render when hidden
   * If not provided, nothing is rendered when hidden
   */
  fallback?: ReactNode;
}

/**
 * A flexible component for conditionally rendering content based on status values.
 *
 * @example
 * // Hide on specific statuses
 * <ConditionalRender
 *   status={articleStatus}
 *   hideOn={['PUBLISHED', 'ACCEPTED', 'AWAITING DECISION']}
 * >
 *   <Button>Submit</Button>
 * </ConditionalRender>
 *
 * @example
 * // Show only on specific statuses
 * <ConditionalRender
 *   status={articleStatus}
 *   showOn={['SUBMITTED', 'UNDER REVIEW']}
 * >
 *   <Button>Edit</Button>
 * </ConditionalRender>
 */
export const ConditionalRender = ({
  status,
  hideOn = [],
  showOn,
  children,
  fallback = null,
}: ConditionalRenderProps) => {
  // If status is null/undefined, don't render
  if (!status) {
    return <>{fallback}</>;
  }

  // If showOn is provided, only show when status matches
  if (showOn && showOn.length > 0) {
    const shouldShow = showOn.some(
      (s) => s.toUpperCase() === status.toUpperCase()
    );
    return <>{shouldShow ? children : fallback}</>;
  }

  // If hideOn is provided, hide when status matches
  if (hideOn && hideOn.length > 0) {
    const shouldHide = hideOn.some(
      (s) => s.toUpperCase() === status.toUpperCase()
    );
    return <>{shouldHide ? fallback : children}</>;
  }

  // If neither hideOn nor showOn is provided, always show
  return <>{children}</>;
};

export default ConditionalRender;
