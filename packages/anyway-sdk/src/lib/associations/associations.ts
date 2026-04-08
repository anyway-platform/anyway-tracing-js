/**
 * Standard association properties for tracing.
 * Use these with withAssociationProperties() or decorator associationProperties config.
 *
 * @example
 * ```typescript
 * // With withAssociationProperties
 * await traceloop.withAssociationProperties(
 *   {
 *     [traceloop.AssociationProperty.USER_ID]: "12345",
 *     [traceloop.AssociationProperty.SESSION_ID]: "session-abc"
 *   },
 *   async () => {
 *     await chat();
 *   }
 * );
 *
 * // Add order context
 * await traceloop.withAssociationProperties(
 *   {
 *     [traceloop.AssociationProperty.USER_ID]: "12345",
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
 *     [traceloop.AssociationProperty.USER_ID]: (thisArg as MyClass).userId,
 *   },
 * }))
 * ```
 */
export enum AssociationProperty {
  /**
   * Anyway platform customer identifier (CUS_xxx format).
   * Obtained from the Anyway Customers API or order system.
   * Use this to link traces to Anyway billing, orders, and revenue attribution.
   */
  CUSTOMER_ID = "customer_id",
  /**
   * Your application's internal user identifier (from your own auth system).
   * Use this to filter and group traces by user in your app.
   */
  USER_ID = "user_id",
  /** A session or conversation identifier. Use this to correlate traces within a single session. */
  SESSION_ID = "session_id",
  /** An order or transaction identifier. Use this to trace a specific business transaction. */
  ORDER_ID = "order_id",
}
