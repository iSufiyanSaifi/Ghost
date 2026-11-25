import { InlineTip } from "@/components/ui/inline-tip"

export default function InlineTipDemo() {
  return (
    <div className="flex w-full flex-col gap-3">
      <InlineTip>Scan the registration plate to fill in the vehicle details automatically.</InlineTip>
      <InlineTip variant="warning" label="Note">
        The estimate changes once the customer adds or removes a job.
      </InlineTip>
      <InlineTip variant="error">Bay 3 is double booked between 2:00 and 3:00 pm on 26/11/2026.</InlineTip>
      <InlineTip variant="success">Payment of ₹{(18450).toLocaleString("en-IN")} received.</InlineTip>
    </div>
  )
}
