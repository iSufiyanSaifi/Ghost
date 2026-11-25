import { ReviewCard } from "@/components/ghost/review-card"

export default function ReviewCardDemo() {
  return (
    <div className="grid max-w-md gap-3">
      <ReviewCard name="Anita Deshpande" rating={4} text="Delivered on time. The estimate matched the final bill, including GST." date="28/10/2026" />
      <ReviewCard name="Vikram Reddy" rating={5} text="Pickup and drop were smooth, and the car came back washed." date="25/10/2026" />
    </div>
  )
}
