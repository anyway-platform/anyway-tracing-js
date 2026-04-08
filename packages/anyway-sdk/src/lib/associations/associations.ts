/**
 * Standard association properties for tracing.
 * Use these with withAssociationProperties() or decorator associationProperties config.
 *
 * @example
 * ```typescript
 * // Set end user and session context
 * await traceloop.withAssociationProperties(
 *   {
 *     [traceloop.AssociationProperty.CUSTOMER_ID]: "CUS_a1b2c3d4e5f6",
 *     [traceloop.AssociationProperty.SESSION_ID]: "session-abc",
 *   },
 *   async () => {
 *     await chat();
 *   }
 * );
 *
 * // Add order context
 * await traceloop.withAssociationProperties(
 *   {
 *     [traceloop.AssociationProperty.CUSTOMER_ID]: "CUS_a1b2c3d4e5f6",
 *     [traceloop.AssociationProperty.ORDER_ID]: "ORD_x7y8z9",
 *   },
 *   async () => {
 *     await processPayment();
 *   }
 * );
 *
 * // With decorator
 * @traceloop.workflow((thisArg) => ({
 *   name: "my_workflow",
 *   associationProperties: {
 *     [traceloop.AssociationProperty.CUSTOMER_ID]: (thisArg as MyClass).customerId,
 *   },
 * }))
 * ```
 */
export enum AssociationProperty {
  /** Your customer's unique identifier. Use this to filter and group traces by customer. */
  CUSTOMER_ID = "customer_id",
  /** A session or conversation identifier. Use this to correlate traces within a single session. */
  SESSION_ID = "session_id",
  /** An order or transaction identifier. Use this to trace a specific business transaction. */
  ORDER_ID = "order_id",
}
