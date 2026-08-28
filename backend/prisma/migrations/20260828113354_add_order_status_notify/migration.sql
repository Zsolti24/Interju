CREATE OR REPLACE FUNCTION notify_order_status_change() RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status IS DISTINCT FROM OLD.status THEN
    PERFORM pg_notify(
      'order_status_changed',
      json_build_object('orderId', NEW.id, 'userId', NEW."userId", 'status', NEW.status)::text
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER order_status_change_trigger
AFTER UPDATE ON "Order"
FOR EACH ROW
EXECUTE FUNCTION notify_order_status_change();
