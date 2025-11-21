/**
 * Card - Compound Component (KD Design System)
 * 
 * An uncontrolled, composable Card component using the compound components pattern.
 * Provides flexible structure with optional Header, Body, and Footer sections.
 * 
 * @example
 * ```tsx
 * <Card>
 *   <Card.Header>
 *     <h3>Card Title</h3>
 *   </Card.Header>
 *   <Card.Body>
 *     <p>Main content goes here</p>
 *   </Card.Body>
 *   <Card.Footer>
 *     <button>Action</button>
 *   </Card.Footer>
 * </Card>
 * ```
 * 
 * All subcomponents accept standard HTML div attributes and className for customization.
 */

import type { FC, HTMLAttributes } from "react";
import "./styles.css";

/**
 * Helper type that ensures className is explicitly available for merging.
 * Combines a base type T with an optional className property.
 */
type WithClassName<T> = T & { className?: string };

/**
 * CardRoot - The main container component
 * 
 * Renders the outer card wrapper with base styling from "kd__card".
 * Accepts all standard div attributes and merges custom className with base styles.
 * 
 * @param children - Any React nodes to render inside the card
 * @param className - Optional custom classes to merge with "kd__card"
 * @param rest - All other HTML div attributes (id, onClick, aria-*, etc.)
 */
const CardRoot: FC<WithClassName<HTMLAttributes<HTMLDivElement>>> = ({
  children,
  className,
  ...rest
}) => {
  return (
    // Merge base "kd__card" class with any custom className provided
    <div className={["kd__card", className].filter(Boolean).join(" ")} {...rest}>
      {children}
    </div>
  );
};

/**
 * CardHeader - Optional header section
 * 
 * Typically used for titles, subtitles, or action buttons at the top of the card.
 * Styled with "kd__card-header" and allows className customization.
 */
const CardHeader: FC<WithClassName<HTMLAttributes<HTMLDivElement>>> = ({
  children,
  className,
  ...rest
}) => {
  return (
    <div className={["kd__card-header", className].filter(Boolean).join(" ")} {...rest}>
      {children}
    </div>
  );
};

/**
 * CardBody - Main content section
 * 
 * The primary content area of the card. Use this for the main text, forms, or media.
 * Styled with "kd__card-body" and allows className customization.
 */
const CardBody: FC<WithClassName<HTMLAttributes<HTMLDivElement>>> = ({
  children,
  className,
  ...rest
}) => {
  return (
    <div className={["kd__card-body", className].filter(Boolean).join(" ")} {...rest}>
      {children}
    </div>
  );
};

/**
 * CardFooter - Optional footer section
 * 
 * Typically used for action buttons, links, or metadata at the bottom of the card.
 * Styled with "kd__card-footer" and allows className customization.
 */
const CardFooter: FC<WithClassName<HTMLAttributes<HTMLDivElement>>> = ({
  children,
  className,
  ...rest
}) => {
  return (
    <div className={["kd__card-footer", className].filter(Boolean).join(" ")} {...rest}>
      {children}
    </div>
  );
};

/**
 * Export Card as a compound component with namespaced subcomponents.
 * 
 * This allows usage like:
 * - <Card> for the root container
 * - <Card.Header> for the header section
 * - <Card.Body> for the main content
 * - <Card.Footer> for the footer section
 * 
 * Each subcomponent is optional and can be used in any combination or order.
 */
export default Object.assign(CardRoot, {
    Header: CardHeader,
    Body: CardBody,
    Footer: CardFooter
})
